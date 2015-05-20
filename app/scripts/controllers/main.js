'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('mainCtrl', function ($scope, $rootScope, Restangular, $interval, $location, $cordovaNfc, $aside, $timeout, $cordovaNativeAudio) {

        // EVENTS FROM CURRENT TIMESTAMP +++++++++++++++++++++++++++++++++++++++++++++++++
        function refreshData() {

            // Determines the time zone of the browser client
            // tz lib or ECMA 6 Intl API for modern browsers
            // var tz = jstz.determine();
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!timeZone) {
                var tz = jstz.determine(); // Determines the time zone of the browser client
                timeZone = tz.name();

            }

            // We need current timestamp for display
            $rootScope.currentTime = moment().tz(timeZone).format('HH:mm');

            // Create today date string for backend query
            // Minus 2 hours based on Outlook API
            var today = moment().tz(timeZone).subtract(3, 'hour').format('YYYY-MM-DDTHH:mm:ss');

            // Create tomorrow date string for backend query
            var tomorrow = moment().tz(timeZone).format('YYYY-MM-DDT23:59:59');

            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');

            // Rest API communication -> get calendarview using startdatetime and enddatetime
            Restangular.all('rooms/calendar').getList({'apikey': apikey, 'startDateTime': today, 'endDateTime': tomorrow})
                .then(function (results) {
                    // Hide preloader and show content
                    $scope.hidden = '';
                    $scope.preloader = 'hidden';
                    // Fetch only room name
                    $rootScope.roomName = results[0];
                    // Fetch only one scheduled event
                    $rootScope.nextEvent = results[1].value[0];
                    $rootScope.futureEvent = results[1].value[1];
                    // If there are no events today -> skip, otherwise change timezone for LV or SWE, also change meetingText
                    //TODO: auto timezone change
                    if ($rootScope.nextEvent) {
                        $scope.nextEvent.Start = moment($scope.nextEvent.Start).format('HH:mm');
                        $scope.nextEvent.End = moment($scope.nextEvent.End).format('HH:mm');
                        $scope.meetingText = ($scope.nextEvent.Start) > $scope.currentTime ? 'Next meeting' : 'Current meeting';

                        var currentTime = moment($scope.currentTime, 'HH:mm');
                        var startTime = moment($scope.nextEvent.Start, 'HH:mm');
                        var endTime = moment($scope.nextEvent.End, 'HH:mm');

                        if (currentTime >= startTime) { // BUSY PART
                            // LED light func busy
                            //$cordovaNativeAudio.stop('free');
                            //$cordovaNativeAudio.loop('busy');
                            // Status
                            $scope.status = 'busy';
                            $scope.statusText = 'Room booked';
                            $scope.meetingWill = 'Ends in ' + moment.preciseDiff(currentTime, endTime);
                            $scope.availableTimeButtonText = 'Ends in ' + $scope.nextEvent.End;

                            // Extend meeting feature [shown only if posible]
                            var freeTimeGap = 0;
                            // If future meeting present we should check gap
                            if ($rootScope.futureEvent) {
                                // Set moment like future event start time
                                var futureEventStart = moment($rootScope.futureEvent.Start, 'YYYY-MM-DDTHH:mm:ssZ');
                                // Check for a gap between current meeting end time and next meeting start time
                                freeTimeGap = futureEventStart.diff(endTime, 'minutes');
                            }
                            // If it's possible to extend current meeting -> set time
                            if (freeTimeGap >= 30 || !$rootScope.futureEvent) {
                                $rootScope.extendedEventStart = endTime;
                                $rootScope.extendedEventStartTime = $scope.nextEvent.End;

                                $rootScope.extendedEventEnd = moment(endTime, 'HH:mm').add(30, 'minutes');
                                $rootScope.extendedEventEndTime = $rootScope.extendedEventEnd.format('HH:mm');
                            }

                        } else if (startTime > currentTime) { // FREE PART
                            // LED light func free
                            //$cordovaNativeAudio.stop('busy');
                            //$cordovaNativeAudio.loop('free');
                            // Status
                            $scope.status = 'free';
                            $scope.statusText = 'Room available';
                            $scope.meetingWill = 'Starts in ' + moment.preciseDiff(currentTime, startTime);
                            $scope.availableTimeButtonText = 'Next meeting at ' + $scope.nextEvent.Start;
                            // Time diff betweeb start time and current time for internal use
                            $scope.timeDiff = startTime.diff(currentTime, 'minutes');
                        } else if (startTime === currentTime) {
                            $scope.meetingWill = 'Ends now';
                        }

                    } else { // FREE PART
                        $scope.status = 'free noMore';
                        $scope.statusText = 'Room available';
                        $scope.availableTimeButtonText = '';
                        $scope.meetingText = '';
                        $scope.timeDiff = 999;
                        // LED light func free
                        //$cordovaNativeAudio.stop('busy');
                        //$cordovaNativeAudio.loop('free');
                    }


                });

            // NFC LOGOUT +++++++++++++++++++++++++++++++++++++++++++++++++++
            // Check localStorage for auth nfc id
            var auth = window.localStorage.getItem('auth');
            // If auth nfc id present
            if (typeof(auth) !== 'undefined' && auth !== null) {
                // Check auth timestamp
                var authTime = localStorage.getItem('authTime');
                // Make it moment like
                authTime = moment(authTime, 'YYYY-MM-DDTHH:mm:ss');
                var currentTime = moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ss');
                // Time diff between current timestamp and auth
                var authTimeDiff = authTime.diff(currentTime, 'seconds');
                $scope.authTimeDiff = authTimeDiff;
                // If its more than minute -> clear it out
                if (authTimeDiff < -60) {
                    window.localStorage.removeItem('auth');
                    window.localStorage.removeItem('authTime');
                    $scope.tagId = null;
                    $scope.authTimeDiff = null;
                }
            }

        }

        // Auto start
        refreshData();

        // Promise should be created to be deleted afterwards
        var refreshDataPromise = $interval(refreshData, 30000);

        // Cancel interval on page changes
        $scope.$on('$destroy', function () {
            if (angular.isDefined(refreshDataPromise)) {
                $interval.cancel(refreshDataPromise);
                refreshDataPromise = undefined;
            }
        });
        // Data refresh end
        // EVENTS FROM CURRENT TIMESTAMP END


        // NFC +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Because of the problem about the async-ness of the nfc plugin, we need to wait for it to be ready.
        $cordovaNfc.then(function (nfcInstance) {
            // Use the plugins interface as you go, in a more "angular" way
            nfcInstance.addTagDiscoveredListener(function (event) {
                checkNfcTag(event);
            })
                .then(
                // Success callback
                function () {
                },
                // Fail callback
                function (err) {
                    console.log(err);
                });
        });

        // Callback when ndef got triggered
        function checkNfcTag(event) {
            if (event) {
                // Set localStorage for card id
                window.localStorage.setItem('auth', event.tag.id);
                // Set localStorage for auth timestamp
                window.localStorage.setItem('authTime', moment().format('YYYY-MM-DDTHH:mm:ss'));
                if (event.tag.id == '50,3,32,36') {
                    $scope.tagId = 'Jurijs Kobecs';
                } else if (event.tag.id == '82,3,32,36') {
                    $scope.tagId = 'Jurijs Kolomijecs';
                } else {
                    $scope.tagId = 'Some employee - ' + event.tag.id;
                }
            }
        }

        // Refresh dummy function for android to fetch nfc card every 2 secs
        function refreshNfc() {
            //
        }

        // Auto start for Nfc
        refreshNfc();

        // Promise should be created to be deleted afterwards
        var refreshNfcPromise = $interval(refreshNfc, 2000);

        // Cancel interval on page changes
        $scope.$on('$destroy', function () {
            if (angular.isDefined(refreshNfcPromise)) {
                $interval.cancel(refreshNfcPromise);
                refreshNfcPromise = undefined;
            }
        });
        // NFC refresh end
        // NFC ---------------------------------------------------------------------------


        // RESOURCES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Retrieve resource statuses from local storage
        $scope.beamer = localStorage.getItem('beamer') ? localStorage.getItem('beamer') : 'working';
        $scope.whiteboard = localStorage.getItem('whiteboard') ? localStorage.getItem('whiteboard') : 'working';
        $scope.light = localStorage.getItem('light') ? localStorage.getItem('light') : 'working';

        $scope.setStatus = function (resource, status) {
            $scope[resource] = status;
            // Put status into storage
            localStorage.setItem(resource, status);

            // Send email if broken
            if (status === 'broken') {
                var post = {'room': $scope.roomName, 'resource': resource, 'user': $scope.tagId};
                // Rest API communication -> send email to ServiceDesk with room name and resource info
                Restangular.all('broken').post(post)
                    .then(function () {
                        //console.info(results);
                    });
            }
        };
        // RESOURCES END


        // INSTANT MEETING +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Send a timestamp to create an instant meeting
        $scope.createEvent = function (status, timeDiff, tagId) {
            if ((status === 'free' || status === 'free noMore') && timeDiff > 30 && !tagId) {
                // Hide element
                $scope.status = 'busy';
                $scope.statusText = 'Room booked';
                // Check localStorage for apikey
                var apikey = window.localStorage.getItem('apikey');
                var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // Rest API communication -> create calendar event using startdatetime and enddatetime
                // Make it 30 mins length from current time
                Restangular.all('rooms/calendar/create').post({'apikey': apikey, 'start': moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ'), 'end': moment().tz(timeZone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ')})
                    .then(function () {
                        refreshData();
                    }, function () {
                        console.log('Error in create meeting response');
                    });
            }
        };
        // INSTANT MEETING END

        // CANCEL MEETING +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.cancelEvent = function () {
            $scope.status = 'free';
            $scope.statusText = 'Room available';
            closeMenu();
            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');
            // Rest API communication -> cancel calendar event using id
            Restangular.all('rooms/calendar/cancel').post({'apikey': apikey, 'id': $scope.nextEvent.Id})
                .then(function () {
                    refreshData();
                }, function () {
                    console.log('Error in cancel meeting id ' + $scope.nextEvent.Id);
                });
        };
        // CANCEL MEETING END

        // Side menu feature
        $scope.openMenu = function (status) {
            if (status === 'free noMore') {
                status = 'free';
            }
            $aside.open({
                templateUrl: 'views/menu/main' + status + '.html',
                placement: 'right',
                size: 'lg',
                status: status,
                controller: 'mainCtrl'
            });
        };

        var closeMenu = function () {
            $timeout(function () {
                $('.modal').click()
            }, 10);
        };


        // To the main screen
        $rootScope.main = function () {
            closeMenu();
            $location.path('main');
        };

        // To the schedule screen
        $rootScope.schedule = function () {
            closeMenu();
            $location.path('schedule');
        };

        // Report broken equipment
        $rootScope.report = function () {
            closeMenu();
            $location.path('report');
        };

        // Help
        $rootScope.help = function () {
            closeMenu();
            $location.path('help');
        };

        // Login
        $rootScope.login = function () {
            closeMenu();
            $location.path('admin');
        };

        // Extend
        $rootScope.extend = function () {
            closeMenu();
            $location.path('extend');
        };

        // Logout
        $rootScope.logOut = function () {
            window.localStorage.removeItem('apikey');
            $location.path('login'); // path not hash
        };

        // WO for screen flash before content fetched from backend
        $scope.hidden = 'hidden';


    }
)

    // event stopPropagation directive to stop click event from firing parent's click events
    .directive('stopEvent', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('click', function (e) {
                    e.stopPropagation();
                });
            }
        };
    })
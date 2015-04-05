'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('mainCtrl', function ($scope, Restangular, $interval, $location, $cordovaNfc) {
	
		//Because of the problem about the async-ness of the nfc plugin, we need to wait
        //for it to be ready.
        $cordovaNfc.then(function (nfcInstance) {

            //Use the plugins interface as you go, in a more "angular" way
            nfcInstance.addTagDiscoveredListener(function (event) {
                //Callback when ndef got triggered
                alert(event.tag.id);
                $scope.tagId = event.tag.id;
            })
                .then(
                //Success callback
                function (event) {
                    console.log("bound success");
                    alert(event.tag.id);
                    $scope.tagId = event.tag.id;
                },
                //Fail callback
                function (err) {
                    console.log("error");
                    alert(err);
                });
        });

        // Today events +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        function refreshData() {

            //Determines the time zone of the browser client
            //tz lib or ECMA 6 Intl API for modern browsers
            //var tz = jstz.determine();
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (!timeZone) {
                var tz = jstz.determine(); // Determines the time zone of the browser client
                timeZone = tz.name();

            }

            // We need current timestamp for display
            $scope.currentTime = moment().tz(timeZone).format('HH:mm');

            // Create today date string for backend query
            // Minus 2 hours based on Outlook API
            var today = moment().tz(timeZone).subtract(2, 'hour').format('YYYY-MM-DDTHH:mm:ss');

            // Create tomorrow date string for backend query
            var tomorrow = moment().tz(timeZone).format('YYYY-MM-DDT23:59:59');

            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');

            // Rest API communication -> get calendarview using startdatetime and enddatetime
            Restangular.all('rooms/calendar').getList({'apikey': apikey, 'startDateTime': today, 'endDateTime': tomorrow})
                .then(function (results) {
                    // Fetch only room name
                    $scope.roomName = results[0];
                    // Fetch only one scheduled event
                    $scope.nextEvent = results[1].value[0];
                    // If there are no events today -> skip, otherwise change timezone for LV or SWE, also change meetingText
                    //TODO : auto timezone change
                    if ($scope.nextEvent) {
                        // LV settings for a timezone
                        $scope.nextEvent.Start = moment($scope.nextEvent.Start).format('HH:mm');
                        $scope.nextEvent.End = moment($scope.nextEvent.End).format('HH:mm');
                        $scope.nextEvent.time = $scope.nextEvent.Start + ' - ' + $scope.nextEvent.End;
                        $scope.meetingText = ($scope.nextEvent.Start) > $scope.currentTime ? 'Next meeting' : 'Current meeting';

                        var currentTime = moment($scope.currentTime, 'HH:mm');
                        var startTime = moment($scope.nextEvent.Start, 'HH:mm');
                        var endTime = moment($scope.nextEvent.End, 'HH:mm');

                        // Meeting will start in, else meeting will end in
                        if (currentTime > startTime) {
                            $scope.status = 'busy';
                            $scope.meetingWill = 'Ends in ' + moment.preciseDiff(currentTime, endTime);
                        } else if (startTime > currentTime) {
                            $scope.status = 'free';
                            $scope.meetingWill = 'Starts in ' + moment.preciseDiff(currentTime, startTime);
                        }

                    } else {
                        $scope.status = 'free noMore';
                        $scope.meetingText = 'No more meetings today';
                        $scope.meetingWill = '';
                    }
                });
        }

        // Auto start
        refreshData();

        // Promise should be created to be deleted afterwards
        var promise = $interval(refreshData, 100000);

        // Cancel interval on page changes
        $scope.$on('$destroy', function () {
            if (angular.isDefined(promise)) {
                $interval.cancel(promise);
                promise = undefined;
            }
        });
        // Data refresh end

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
                var post = {'room':  $scope.roomName, 'resource': resource};
                // Rest API communication -> send email to ServiceDesk with room name and resource info
                Restangular.all('broken').post(post)
                    .then(function (results, error) {
                        //console.info(results);
                    });
            }
        };

        // To the Info screen
        $scope.openInfo = function () {
            $location.path('info'); // path not hash
        };

        // Send a timestamp to create an instant meeting
        $scope.createEvent = function () {
            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // Rest API communication -> create calendar event using startdatetime and enddatetime
            // We need to substract 2 hours due to Outlook diff
            // Make it 30 mins length from current time
           Restangular.all('rooms/calendar/create').post({'apikey':apikey, 'start': moment().tz(timeZone).subtract(2, 'hour').format('YYYY-MM-DDTHH:mm:ssZ'), 'end': moment().tz(timeZone).subtract(2, 'hour').add(30,'minutes').format('YYYY-MM-DDTHH:mm:ssZ')});
        };

    })

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
    });


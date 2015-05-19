'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:extendCtrl
 * @description
 * # extendCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('extendCtrl', function ($scope, Restangular, $interval, $location, $cordovaNfc, $rootScope, $aside, $timeout) {

        $scope.main = function () {
            $timeout(function () {
                $('.modal').click()
            }, 10);
            $location.path('main');
        };

        $scope.openMenu = function () {
            $aside.open({
                templateUrl: 'views/menu/extend.html',
                placement: 'right',
                size: 'lg',
                controller: 'extendCtrl'
            });
        };

        $scope.extendEvent = function () {
            var futureFree = 'false';
            var freeTimeGap = 0;

            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');
            // Get local time zone
            var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!timeZone) {
                var tz = jstz.determine(); // Determines the time zone of the browser client
                timeZone = tz.name();

            }

            // Current meeting end time as extended meeting start time
            $scope.nextEvent.End = moment($rootScope.nextEvent.End,'HH:mm');

            // If future meeting present
            if ($rootScope.futureEvent) {
                // Check for a gap between current meeting end time and next meeting start time
                $scope.futureEvent.Start = moment($rootScope.futureEvent.Start,'YYYY-MM-DDTHH:mm:ssZ').tz(timeZone);
                freeTimeGap = $scope.futureEvent.Start.diff($scope.nextEvent.End, 'minutes');
            } else {
                console.log('No next meetings');
                futureFree = 'true';
            }

            // Rest API communication
            // Make it 30 mins length from current meeting end time
            if (futureFree === 'true') {
                $scope.extendedEventEnd = moment($rootScope.nextEvent.End, 'HH:mm').tz(timeZone).add(30, 'minutes');
                console.log('Extended meeting end time for busy room with no more meetings in future - from [' + $scope.nextEvent.End.format('YYYY-MM-DDTHH:mm:ssZ') + '] to [' + $scope.extendedEventEnd.format('YYYY-MM-DDTHH:mm:ssZ') + ']');
                Restangular.all('rooms/calendar/create').post({'apikey': apikey, 'start': $scope.nextEvent.End.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ'), 'end': $scope.extendedEventEnd.format('YYYY-MM-DDTHH:mm:ssZ')})
                    .then(function () {
                        $location.path('main');
                    }, function () {
                        console.log('Error in create meeting response');
                    });
            } else if (freeTimeGap > 30) {
                console.log('Extended meeting end time for busy room - ' + moment($rootScope.nextEvent.End, 'HH:mm').tz(timeZone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ'));
            }
            /*Restangular.all('rooms/calendar/create').post({'apikey': apikey, 'start': moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ'), 'end': moment().tz(timeZone).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ')})
             .then(function () {
             $location.path('main');
             }, function () {
             console.log('Error in create meeting response');
             });*/
        };

        $scope.extendTime = moment($rootScope.currentTime, 'HH:mm').add(30, 'minutes').format('HH:mm');

    }
);


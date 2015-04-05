'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:infoCtrl
 * @description
 * # infoCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('infoCtrl', function ($scope, Restangular, $location) {
        //Determines the time zone of the browser client
        //tz lib or ECMA 6 Intl API for modern browsers
        //var tz = jstz.determine();
        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!timeZone) {
            var tz = jstz.determine(); // Determines the time zone of the browser client
            timeZone = tz.name();

        }

        // Create today date string for backend query
        var today = moment().tz(timeZone).format('YYYY-MM-DDT00:00:00');

        // Create tomorrow date string for backend query
        var tomorrow = moment().tz(timeZone).format('YYYY-MM-DDT23:59:59');

        // Check localStorage for apikey
        var apikey = window.localStorage.getItem('apikey');

        // Rest API communication -> get calendarview using startdatetime and enddatetime
        Restangular.all('rooms/calendar').getList({'apikey': apikey, 'startDateTime': today, 'endDateTime': tomorrow})
            .then(function (results) {
                // Fetch only one scheduled event
                $scope.todayEvents = results[1];
            });

        $scope.openHome = function () {
            $location.path('main'); // path not hash
            //console.info('clicked for a view -> ' + view);
        };

        $scope.today = function () {
            $('.today').addClass('active');
            $('.tomorrow').removeClass('active');
            $('.week').removeClass('active');
        };

        $scope.tomorrow = function () {
            $('.today').removeClass('active');
            $('.tomorrow').addClass('active');
            $('.week').removeClass('active');
        };

        $scope.week = function () {
            $('.today').removeClass('active');
            $('.tomorrow').removeClass('active');
            $('.week').addClass('active');
        };

    });

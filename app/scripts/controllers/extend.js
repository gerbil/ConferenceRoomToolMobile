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
            $('.ok').hide();

            // Check localStorage for apikey
            var apikey = window.localStorage.getItem('apikey');

            // Rest API communication
            Restangular.all('rooms/calendar/create').post({'apikey': apikey, 'start': $rootScope.extendedEventStart.format('YYYY-MM-DDTHH:mm:ssZ'), 'end': $rootScope.extendedEventEnd.format('YYYY-MM-DDTHH:mm:ssZ')})
                .then(function () {
                    $location.path('main');
                }, function () {
                    console.log('Error in create meeting response');
                });
        };


    }
);


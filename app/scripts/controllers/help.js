'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:helpCtrl
 * @description
 * # helpCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('helpCtrl', function ($scope, $rootScope, Restangular, $interval, $location, $cordovaNfc, $aside, $timeout) {

        $scope.main = function () {
            $timeout(function() {
                $('.modal').click()
            },10);
            $location.path('main');
        };

        $scope.openMenu = function () {
            $aside.open({
                templateUrl: 'views/menu/help.html',
                placement: 'right',
                size: 'lg',
                controller: 'helpCtrl'
            });
        }

    }

);
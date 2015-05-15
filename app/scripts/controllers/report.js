'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:reportCtrl
 * @description
 * # reportCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('reportCtrl', function ($scope, $rootScope, Restangular, $interval, $location, $cordovaNfc, $aside, $timeout) {

        $scope.openMenu = function () {
            $aside.open({
                templateUrl: 'views/menu/report.html',
                placement: 'right',
                size: 'lg',
                controller: 'reportCtrl'
            });
        }

    }

);
'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:adminCtrl
 * @description
 * # adminCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('adminCtrl', function ($scope, $rootScope, Restangular, $interval, $location, $cordovaNfc, $aside) {

        $scope.openMenu = function () {
            $aside.open({
                templateUrl: 'views/menu/admin.html',
                placement: 'right',
                size: 'lg',
                controller: 'adminCtrl'
            });
        };

    }

);
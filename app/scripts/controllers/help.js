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

        $scope.sendHelpdesk = function () {
            console.log($scope.request);
        };

    }

);
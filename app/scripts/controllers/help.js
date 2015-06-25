'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:helpCtrl
 * @description
 * # helpCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('helpCtrl', function ($scope, $rootScope) {

        $scope.sendHelpdesk = function () {
            console.log($scope.request);
        };

        $scope.keyboardDown = function () {
            AndroidFullScreen.immersiveMode();
            $('body').css('margin-top', '0px');
        };

        $scope.keyboardUp = function () {
            $('body').css('margin-top', '-425px');
        };

    }
);
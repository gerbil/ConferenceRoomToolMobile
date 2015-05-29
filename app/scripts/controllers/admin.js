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

        $scope.admin = function (username, password) {
            // Rest API communication -> send username + password, get token
            Restangular.all('admin/login').post({'username': username, 'password': password})
                .then(function (result) {
                    // Success response from the server.
                    $scope.apikey = result.apikey;
                    // Set localStorage for apikey
                    window.localStorage.setItem('apikey', $scope.apikey);
                    // Redirect to a main screen
                    $location.path('admin'); // path not hash
                }, function () {
                    // Error response from the server.
                    $scope.loginForm.username.$setValidity('', false);
                    $scope.loginForm.password.$setValidity('', false);
                });
        };

    }

);
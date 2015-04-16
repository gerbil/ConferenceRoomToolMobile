'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('loginCtrl', function ($scope, Restangular, $location, $ionicPlatform, $cordovaStatusbar, $cordovaScreen) {

        // FullScreen
        //$cordovaStatusbar.hide();

        //window.keepScreenOn.enable();

        $ionicPlatform.ready(function() {
            $cordovaStatusbar.hide();
            $cordovaScreen.keepOn();
            keepscreenon.enable();
            AndroidFullScreen.immersiveMode();
            locktask.startLockTask();
        });

        // Check localStorage for apikey
        var apikey = window.localStorage.getItem('apikey');

        // Redirect to a main screen only if apikey is already set
        if (typeof(apikey) !== 'undefined' && apikey !== null) {
            // Redirect to a main screen
            $location.path('main'); // path not hash
            //console.info('Apikey found in localStorage - ' + apikey);
        } else {
            $scope.login = function (username, password) {
                // Rest API communication -> send username + password, get token
                Restangular.all('login').post({'username': username, 'password': password})
                    .then(function (result) {
                        // Success response from the server.
                        $scope.apikey = result.apikey;
                        // Set localStorage for apikey
                        window.localStorage.setItem('apikey', $scope.apikey);
                        // Redirect to a main screen
                        $location.path('main'); // path not hash
                    }, function () {
                        // Error response from the server.
                        $scope.loginForm.username.$setValidity('', false);
                        $scope.loginForm.password.$setValidity('', false);
                    });
            };
        }

    });
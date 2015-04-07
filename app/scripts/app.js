// Ionic Starter App
'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('t2EventsApp', [
    'ionic',
    'ngCordova',
    'ngCordova.plugins.nfc',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
    'ui.bootstrap'
])

    .config(function ($routeProvider, RestangularProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html'
            })
            .when('/info', {
                templateUrl: 'views/info.html'
            })
            .when('/main', {
                templateUrl: 'views/main.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        // BackEnd API endpoint
        RestangularProvider.setBaseUrl('http://10.30.60.165:3000');

        // Android scale workaround
        document.body.style.zoom = 0.5;

    });


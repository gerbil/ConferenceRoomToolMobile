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
    'ui.bootstrap',
    'ngAside'
])

    .config(function ($routeProvider, RestangularProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html'
            })
            .when('/main', {
                templateUrl: 'views/main.html'
            })
            .when('/schedule', {
                templateUrl: 'views/schedule.html'
            })
            .when('/extend', {
                templateUrl: 'views/extend.html'
            })
            .when('/report', {
                templateUrl: 'views/report.html'
            })
            .when('/admin', {
                templateUrl: 'views/admin.html'
            })
            .when('/help', {
                templateUrl: 'views/help.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        // BackEnd API endpoint
        // RestangularProvider.setBaseUrl('http://10.30.60.165:3000');
        RestangularProvider.setBaseUrl('http://128.199.46.235:11000');

        // Android scale workaround
        if (window.innerWidth <= 1400) {
            document.body.style.zoom = 0.5;
        }

    })

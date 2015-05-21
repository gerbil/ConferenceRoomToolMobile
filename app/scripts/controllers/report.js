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

        // RESOURCES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Retrieve resource statuses from local storage
        $scope.video = localStorage.getItem('video') ? localStorage.getItem('video') : 'working';
        $scope.sound = localStorage.getItem('sound') ? localStorage.getItem('sound') : 'working';
        $scope.light = localStorage.getItem('light') ? localStorage.getItem('light') : 'working';
        $scope.cleanup = localStorage.getItem('cleanup') ? localStorage.getItem('cleanup') : 'working';
        $scope.board = localStorage.getItem('board') ? localStorage.getItem('board') : 'working';
        $scope.other = localStorage.getItem('other') ? localStorage.getItem('other') : 'working';

        $scope.report = function (resource) {
            var status = localStorage.getItem(resource) ? localStorage.getItem(resource) : 'working';
            if (status === 'working') {
                status = 'broken';
            } else {
                status = 'working';
            }
            localStorage.setItem(resource, status);
            $scope[resource] = status;

            console.log($rootScope.roomName);

            // Send email if broken
            if (status === 'broken') {
                var post = {'room': $rootScope.roomName, 'resource': resource/*, 'user': $scope.tagId*/};
                // Rest API communication -> send email to ServiceDesk with room name and resource info
                Restangular.all('broken').post(post)
                    .then(function () {
                        //console.info(results);
                    });
            }
        };
        // RESOURCES END

    }
);
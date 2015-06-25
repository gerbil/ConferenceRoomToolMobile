'use strict';

/**
 * @ngdoc function
 * @name t2EventsApp.controller:reportCtrl
 * @description
 * # reportCtrl
 * Controller of the t2EventsApp
 */
angular.module('t2EventsApp')

    .controller('reportCtrl', function ($scope, $rootScope, Restangular, $interval, $location, $cordovaNfc, $aside) {

        $scope.openMenu = function () {
            $aside.open({
                templateUrl: 'views/menu/report.html',
                placement: 'right',
                size: 'lg',
                controller: 'reportCtrl'
            });
        };

        // RESOURCES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Retrieve resource statuses from local storage
        $scope.video = localStorage.getItem('video') ? localStorage.getItem('video') : 'working';
        $scope.sound = localStorage.getItem('sound') ? localStorage.getItem('sound') : 'working';
        $scope.light = localStorage.getItem('light') ? localStorage.getItem('light') : 'working';
        $scope.cleanup = localStorage.getItem('cleanup') ? localStorage.getItem('cleanup') : 'working';
        $scope.board = localStorage.getItem('board') ? localStorage.getItem('board') : 'working';
        $scope.wifi = localStorage.getItem('wifi') ? localStorage.getItem('wifi') : 'working';
        $scope.phone = localStorage.getItem('phone') ? localStorage.getItem('phone') : 'working';
        $scope.monitor = localStorage.getItem('monitor') ? localStorage.getItem('monitor') : 'working';
        $scope.printer = localStorage.getItem('printer') ? localStorage.getItem('printer') : 'working';
        $scope.bug = localStorage.getItem('bug') ? localStorage.getItem('bug') : 'working';
        $scope.officestuff = localStorage.getItem('officestuff') ? localStorage.getItem('officestuff') : 'working';
        $scope.plug = localStorage.getItem('plug') ? localStorage.getItem('plug') : 'working';

        $scope.tap = function (resource) {
            // Fetch current equipment status
            // And change it for reporting funct
            var status = localStorage.getItem(resource) ? localStorage.getItem(resource) : 'working';
            if (status === 'working') {
                $scope.status = 'broken';
            } else {
                $scope.status = 'working';
            }

            $scope.resource = resource;
            navigator.notification.confirm(
                'Please confirm ' + resource + ' is ' + $scope.status,
                $scope.reportCheck,
                'Report equipment',
                ['Confirm', 'Cancel']
            );
        };

        $scope.reportCheck = function (buttonIndex) {
            buttonIndex == 1 ? $scope.report($scope.resource, $scope.status) : false;
        };

        $scope.report = function (resource, status) {
            localStorage.setItem(resource, status);
            $scope[resource] = status;
            $scope.$apply();

            // Send email if broken
            if (status === 'broken') {
                var post = {'room': $rootScope.roomName, 'resource': resource, 'user': $scope.tagId};
                // Rest API communication -> send email to ServiceDesk with room name and resource info
                Restangular.all('broken').post(post)
                    .then(function (result) {
                       //navigator.notification.alert(result, null, 'Report status', 'Ok')
                    });
            }
        };
        // RESOURCES END

    }
);
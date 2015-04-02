// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngCordova.plugins.nfc'])

    .controller('MainController', function ($scope, $cordovaNfc) {

        //Because of the problem about the async-ness of the nfc plugin, we need to wait
        //for it to be ready.
        $cordovaNfc.then(function (nfcInstance) {

            alert('ready!');

            //Use the plugins interface as you go, in a more "angular" way
            nfcInstance.addTagDiscoveredListener(function (event) {
                //Callback when ndef got triggered
                alert(event.tag.id);
                $scope.tagId = event.tag.id;
            })
                .then(
                //Success callback
                function(event){
                    console.log("bound success");
                    alert(event.tag.id);
                    $scope.tagId = event.tag.id;
                },
                //Fail callback
                function(err){
                    console.log("error");
                    alert(err);
                });
        });

    })
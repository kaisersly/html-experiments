/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", [])
    , socket = io.connect('http://localhost:3000');



function MyCtrl($scope) {
    'use strict';
    $scope.contacts = [];
    $scope.setContacts = function (contacts) {
        $scope.modifiedBySocket = true;
        $scope.contacts = contacts;
        $scope.$apply();
    }
    $scope.sendUpdateToSocket = function (scope) {
        console.log(scope);   
    }
    socket.on('initialize contacts', function (data) {
        $scope.setContacts(data);
    });
    
    socket.on('refresh contacts', function (data) {
        $scope.setContacts(data);
    });
    
    $scope.$watch('contacts', function() {
        if (!$scope.modifiedBySocket && $scope.contacts.length > 0) {
            var data = JSON.parse(angular.toJson($scope.contacts));
            socket.emit('modifying contacts', data);
        }
        else {$scope.modifiedBySocket = false}
    }, true);
}
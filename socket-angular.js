/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", [])
    , socket = io.connect('http://localhost:3000');



function MyCtrl($scope) {
    'use strict';
    $scope.contacts = [];
    $scope.setContacts = function (contacts) {
//        $scope.modifiedBySocket = true;
        $scope.contacts = contacts;
        $scope.$apply();
    }
    $scope.updateContact = function (contact) {
        $scope.contacts.forEach(function (h,i) {
            if (h.id == contact.id) {
                $scope.contacts[i] = contact;
                $scope.$apply();
            }
        });
    }
    $scope.sendUpdateToSocket = function (contact) {
        contact = JSON.parse(angular.toJson(contact));
        socket.emit('modify contact', contact);
    }
    socket.on('initialize contacts', function (contacts) {
        $scope.setContacts(contacts);
    });
    
    socket.on('update contact', function (contact) {
        $scope.updateContact(contact);
    });
//    
//    $scope.$watch('contacts', function() {
//        if (!$scope.modifiedBySocket && $scope.contacts.length > 0) {
//            var data = JSON.parse(angular.toJson($scope.contacts));
//            socket.emit('modifying contacts', data);
//        }
//        else {$scope.modifiedBySocket = false}
//    }, true);
}
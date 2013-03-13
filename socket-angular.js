/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", [])
    , socket = io.connect('http://localhost:3000');



function MyCtrl($scope) {
    'use strict';
    $scope.contacts = [];
    $scope.selectedContacts = {};
    $scope.setContacts = function (contacts) {
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
    $scope.selectContact = function (contact) {
        var user = $scope.user;
        if (contact.selectedBy) {
            var index = contact.selectedBy.indexOf(user);
            if ( index == -1) {
                contact.selectedBy.push(user);   
            }
            else {
                contact.selectedBy.splice(index,1);   
            }
            
        }
        else {
            contact.selectedBy = [user];
        }
        $scope.sendUpdateToSocket(contact);
    }
    $scope.$watch('selectedContacts', function (a,b) {
        
    }, true);
    
    socket.on('login', function () {
        $scope.user = prompt('Veuillez entrez votre nom :');
        socket.emit('new user', $scope.user);
    });
    
    socket.on('initialize contacts', function (contacts) {
        $scope.setContacts(contacts);
    });
    
    socket.on('update contact', function (contact) {
        $scope.updateContact(contact);
    });
    
//    socket.on
}
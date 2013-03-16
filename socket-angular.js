/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", [])
    , socket = io.connect('http://localhost:3000');

myApp.directive('contenteditable', function ($parse) {
    'use strict';
    // TODO : essayer avec scope: {model: "="}
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.model) {
                // parse pour évaluer l'expression
                var model = $parse(attrs.model);
                // évalue l'expression dans le contexte du scope
                element.html(model(scope));
                element.on('blur keyup change', function () {
                    // met à jour la valeur du model
                    model.assign(scope, element.html());
                    // évalue le callback dans le contexte du scope
                    $parse(attrs.callback)(scope);
                });
            }
        }
    }
});
function MyCtrl($scope) {
    'use strict';
    $scope.alerts = function (contact) {console.log(contact)}
    $scope.contacts = [];
    $scope.selectedContactIds = {};
    $scope.setContacts = function (contacts) {
        $scope.contacts = contacts;
        $scope.$apply();
    };
    $scope.updateContact = function (contact) {
        $scope.contacts.forEach(function (h,i) {
            if (h.id == contact.id) {
                $scope.contacts[i] = contact;
                $scope.$apply();
            }
        });
    };
    $scope.sendUpdateToSocket = function (contact) {
        contact = JSON.parse(angular.toJson(contact));
        socket.emit('modify contact', contact);
    };
    $scope.selectContact = function (contact) {
        $scope.selectedContactIds[$scope.user] = contact.id;
        socket.emit('select contact', contact.id);
    };
    $scope.printSelectedBy = function (contact) {
        var text = '';
        angular.forEach($scope.selectedContactIds, function (contactId, user) {
            if (contactId == contact.id) {
                text += user;
                text += ' ';
            }
        });
        return text;
    }
//    $scope.$watch('selectedContacts', function (a,b) {
//        
//    }, true);
    
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
    socket.on('selected contact', function (data) {
        $scope.selectedContactIds[data.user] = data.contactId;
        $scope.$apply();
    });
}
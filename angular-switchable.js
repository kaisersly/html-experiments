/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

//myApp.directive('switchText', function () {
//    'use strict';
//    return function (scope, element, attrs) {
//        return true;
//    };
//    
//});


function MyCtrl($scope) {
    'use strict';
    $scope.articles = [{
        title: "Capacité",
        content: "Blaevkjla heazfhbhqqdf heaz. Djhekaz  dqsohe qfdsi dqszae."
    }, {
        title: "Licence",
        content: "Blaevkjla heazfhbhqqdf heaz. Djhekaz  dqsohe qfdsi dqszae."
    }];

}
/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

myApp.directive('draggable', function () {
    'use strict';
    return function (scope, element, attrs) {
        $(element).draggable({
            stop: function (evt, ui) {
                scope.item.left = ui.position.left;
                scope.item.top = ui.position.top;
                scope.$digest();
            }
        });
    };
});

myApp.directive('positioned', function () {
    'use strict';
    return function (scope, element, attrs) {
        function reposition() {
            var el = $(element);
            el.css('left', scope.item.left);
            el.css('top', scope.item.top);
        }
        scope.$watch('item.reposition_me', function (a, b) {
            if (a === true) {
                reposition();
                delete (scope.item.reposition_me);
            }
        });
        reposition();
    };
});

function MyCtrl($scope) {
    'use strict';
    var items = [{
        content: "un",
        left: 20,
        top: 0
    }, {
        content: "deux",
        left: 0,
        top: 20
    }, {
        content: "trois",
        left: 50,
        top: 40
    }],
        localStorage = window.localStorage;
    $scope.loadItemsFromScript = function () {
        $scope.items = items;
    };
    $scope.loadItemsFromLocalStorage = function () {
        var stored_items = localStorage[$scope.storage_prefix + '_items'];
        if (stored_items) {
            $scope.items = JSON.parse(stored_items);
            $scope.items.forEach(function (item) {
                item.reposition_me = true;
            });
        }
    };
    $scope.saveItemsToLocalStorage = function () {
        localStorage[$scope.storage_prefix + '_items'] = JSON.stringify($scope.items);
    };
    $scope.addItem = function () {
        var samples = ['un', 'deux', 'trois', 'quatre', 'cinq'],
            rand = Math.floor(Math.random() * samples.length);
        $scope.items.push({
            content: samples[rand]
        });
    };
    $scope.log = function () {
        console.log($scope.items);
    };
}
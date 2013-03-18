/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

function log (text) { console.log(text); }

myApp.directive("setContact", function () {
    return function (scope, el, attrs) {
        el.on('click', function () {
            var form = $(attrs.setContact);
            if (form.length != 1) { 
                console.log(attrs.setContact + " ne pointe pas vers un unique élément.");
                return false; 
            }
            $.each(scope.contact, function (key, value) {
                // on n'utilise pas les $$hashKey
                if (!/\$/.test(key)) {
                    form.find("input[name=" + key + "]").attr("value", value);   
                }
            });
        });
    }
});

function MyCtrl($scope) {
    'use strict';
    $scope.contacts = [{
        first_name: "Sylvain",
        last_name: "Kieffer",
        email: "sylvain.kieffer@univ-paris13.fr"
    },{
        first_name: "Laurent",
        last_name: "Mernier",
        email: "mernier@univ-paris13.fr"
    },{
        first_name: "Michel",
        last_name: "Renauld",
        email: "michel.renauld@univ-paris13.fr"
    }];
    $scope.contact = $scope.contacts[0];
}
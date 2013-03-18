/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

myApp.directive('contenteditable', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) { return false; }
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');  
            };
            element.on('blur keydown change', function () {
                scope.$apply(read());
            });
            function read() {
                ngModel.$setViewValue(element.html());
            }
        }
    }    
});
function MyCtrl($scope) {
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

}
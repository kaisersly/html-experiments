/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

function log(text) {
    console.log(text)
};

myApp.directive('myDirective', function () {
    return {
        require: "?ngModel",
        link: function (scope, el, attrs, ngModel) {
            ngModel.$setValidity("test",false);
        }
    }
});
myApp.directive('scopeLogger', function ($parse) {
    return function (scope, el, attrs) {
        log(scope);
        if (attrs.scopeLogger != '') {
            var logValue = $parse(attrs.scopeLogger)(scope);
        }
    }
});
myApp.directive('validate', function ($parse) {
    return function (scope, el, attrs) {
        var validate = $parse(attrs.validate)(scope);
        if (!validate) { return false }
        if (validate.required) {
            el.attr("required", "");   
        }
        if (validate.not) {
            var notHash = validate.not;
            var notScope = $parse(notHash.scope)(scope);
            
            notScope.forEach(function (h) {
                if (h.id == notHash.id) {
                    var hScope = scope.$new();
                    $.extend(hScope,h);
                    hScope.$watch(notHash.field, function(a, b) {
                        var value = $parse(attrs.ngModel)(scope);
                        var notField = $parse(notHash.field)(hScope);
                        if (value && value != '' && notField == notHash.value) { 
                            log(value); 
                        } 
                    });
                }
            }); 
        }
    }
});



/* ---------------------------------------------------------------- Controller ---------------------------------------------------------------- */

function MyCtrl($scope) {
    'use strict';
    var lastId = 3;
    function emptyQuestion () {
        return {
            label: "Une autre question ...",
            answer: {
                type: "text",
                options: [{label:'o',value:true}]
            }
        }
    }
    $scope.newQuestion = emptyQuestion();
    $scope.addQuestion = function () {
        var question = $scope.newQuestion;
        lastId++;
        question.id = "question" + lastId;
        if (['radio', 'checkbox'].indexOf(question.answer.type) == -1) {
            delete (question.answer.options);
        }
        $scope.model.questions.push($scope.newQuestion);
        $scope.newQuestion = emptyQuestion();
    }
    $scope.addOption = function (option) {
        option = option || {label: "", value: ""};
        $scope.newQuestion.answer.options.push(option);   
    }
    $scope.setDefaultOptions = function () {
        var question = $scope.newQuestion;
        var type = question.answer.type;
        question.answer.options = [];
        if (type == 'radio') {
            $scope.addOption({ label: 'Oui', value: true });   
            $scope.addOption({ label: 'Non', value: false });   
        }
        if (type == 'checkbox') {
            $scope.addOption({ label: '', value: false });   
        }
        
    }
    $scope.buildCheckboxAnswer = function (question) {
        var value = [];
        question.answer.options.forEach(function (option) {
            if (option.value) { value.push(option.label) }
        });
        question.answer.value = value;
    }
    $scope.setCheckboxAnswers = function (question) {
        var value = question.answer.value;
        question.answer.options.forEach(function (option) {
            option.value = value.indexOf(option.label) == -1 ? false : true
        });
    }
    $scope.model = {
        questions: [
            {
                id: "question1",
                label: "Quel est votre nom ?",
                answer: {
                    type: "text",
                    validate: {
                        required: false,
                        not: {
                            scope: "model.questions",
                            id: "question2",
                            field: "answer.value",
                            value: "au"
                        }
                    }
                }
            },
            {
                id: "question2",
                label: "Quel est votre sexe ?",
                answer: {
                    type: "radio",
                    value: "f",
                    options: [
                        {
                            label: "Masculin",
                            value: "m"
                        },
                        {
                            label: "Féminin",
                            value: "f"
                        },
                        {
                            label: "Autre",
                            value: "au"
                        }
                    ]
                }
            },
            {
                id: "question3",
                label: "Quelles sont vos passions ?",
                answer: {
                    type: "checkbox",
                    options: [
                        {
                            label: "Montagne"
                        },
                        {
                            label: "Randonnée"
                        },
                        {
                            label: "Plage"
                        }
                    ]
                }
            },
            {
                id: "question4",
                label: "Donnez vos impressions ...",
                answer: {
                    value: "blablabla",
                    type: "textarea"
                }
            }
        ]
    }
    $scope.buildAnswers = function () {
        var answers = [];
        $scope.model.questions.forEach(function (question) {
            var answer = {
                id: question.id,
                answer: {
                    value: question.answer.value
                }
            }
//            if (question.answer.type == "checkbox") {
//                answer.options = question.answer.options;
//            }
            answers.push(answer);
        });
        $scope.answers = answers
    };
    $scope.$watch('model', function () {
        $scope.buildAnswers();
    }, true);
    
//    $scope.response = $scope.$root.response = { answers: ["nom","sexe","impressions"] };
}
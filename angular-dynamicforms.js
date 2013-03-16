/*jslint devel: true, browser: true*/
/*global $: true, angular: true*/

var myApp = angular.module("myApp", []);

function log(text) {
    console.log(text)
};

myApp.directive('scopeLogger', function ($parse) {
    return function (scope, el, attrs) {
        log(scope);
        if (attrs.scopeLogger != '') {
            var logValue = $parse(attrs.scopeLogger)(scope);
            log(logValue);
        }
    }
});

function MyCtrl($scope) {
    'use strict';
    var lastId = 3;
    function emptyQuestion () {
        return {
            label: "Une autre question ...",
            answer: {
                type: "text",
                options: [
                    {label: "oui", value: true}, {label: "non", value: false}    
                ]
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
    $scope.addOption = function () {
        $scope.newQuestion.answer.options.push({label: "", value: ""});   
    }
    $scope.model = {
        questions: [
            {
                id: "question1",
                label: "Quel est votre nom ?",
                answer: {
                    type: "text"
                }
            },
            {
                id: "question2",
                label: "Quel est votre sexe ?",
                answer: {
                    type: "radio",
                    options: [
                        {
                            label: "Masculin",
                            value: "m"
                        },
                        {
                            label: "Féminin",
                            value: "f"
                        }
                    ]
                }
            },
            {
                id: "question3",
                label: "Donnez vos impressions ...",
                answer: {
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
            if (question.answer.type == "checkbox") {
//                var options = [];
//                question.answer.options.forEach(function (option) {
//                    options.push(option.value);
//                });
//                answer.answer.value = options;
//                    options.push(option.value);
//                });
                answer.options = question.answer.options;
            }
            answers.push(answer);
        });
        $scope.answers = answers
    };
    $scope.$watch('model', function () {
        $scope.buildAnswers();
    }, true);
    
//    $scope.response = $scope.$root.response = { answers: ["nom","sexe","impressions"] };
}
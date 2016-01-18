var $ = require("jquery");
var _ = require("underscore");
var angular = require("angular");

var TeamFormModel = require("./../../models/TeamFormModel.js");

angular.module('ControllerAddTeam', [
// Dependencies
], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
.controller('ControllerAddTeam', function(
// Dependency Injections
    $scope,
    $http,
    $timeout,
    $window
){
    $scope.form = new TeamFormModel(window.team);

    $scope.submit = function () {
        console.log(this.form.getOutput());
    };

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});

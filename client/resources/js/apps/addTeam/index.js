require("jquery");
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

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});

angular.module('ControllerAddTeam', [
// Dependencies
    'AddTeamFormModel'
], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
.controller('ControllerAddTeam', function(
// Dependency Injections
    $scope,
    $http,
    $timeout,
    $window,
    AddTeamFormModel
){
    $scope.form = new AddTeamFormModel();

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});
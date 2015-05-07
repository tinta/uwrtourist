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
    var dynamicFields = (function () {
        function dynamicFields (defaults) {
            var dyFields = {};
            dyFields.all = [];
            dyFields.create = function () {
                this.all.push(angular.copy(defaults));
            };
            dyFields.remove = function (index) {
                this.all.splice(index, 1);
            };

            return dyFields;
        }
        return dynamicFields;
    })();


    $scope.form = {};

    $scope.form.links = new dynamicFields({val: ''});
    $scope.form.links.create();

    $scope.form.contacts = new dynamicFields({
        name: '',
        email: '',
        title: ''
    });
    $scope.form.contacts.create();

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
        console.log($scope);
    };
});
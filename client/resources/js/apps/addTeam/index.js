var $ = window.$ = window.jQuery = require("jquery");
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
        var body = this.form.getOutput();
        $.post(window.location.href, body)
    };

    $(document).on("geocode:result", function (event, result) {
        var location = {
            countryCode: result.address_components[result.address_components.length - 1].short_name,
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            val: result.formatted_address 
        };

        _.extend($scope.form.location, location);
    });

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});

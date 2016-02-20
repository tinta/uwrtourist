var $ = window.$ = window.jQuery = require("jquery");
require("geocomplete");
var _ = require("underscore");
var angular = require("angular");

var TeamFormModel = require("./../../models/TeamFormModel.js");
var AddTeamFormValidator = require("./AddTeamFormValidator.js");

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
    $scope.form.contacts.create();

    $scope.formValidator = new AddTeamFormValidator();

    $scope.submit = function () {
        var body = this.form.getOutput();

        // Do not proceed if form is invalid
        if (!this.formValidator.validate(body)) return;
        body.status = "active";

        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: JSON.stringify(body),
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success: function (data) { alert("success") },
        });
        // if form submission success, show success message and redirect
    };

    $('[ng-model="form.location.val"]')
    .geocomplete()
    .bind("geocode:result", function (event, result) {
        // parse address components from google maps api response
        for (var i in result.address_components) {
            var locationComponent = result.address_components[i];
            var unitType = locationComponent["types"];
            var city, state, country;
            if (_.isEqual(unitType, ["locality", "political"])) {
                city = locationComponent["long_name"];
            }
            else if (_.isEqual(unitType, ["administrative_area_level_1", "political"])) {
                state = locationComponent["long_name"];
            }
            else if (_.isEqual(unitType, ["country", "political"])) {
                country = locationComponent["long_name"];
            }
        }

        if (!(state)) state = city;

        if (!(city && country)) {
            // Raise a validation error. A specific location is required.
            var msg = '- Please enter a more specific "Location"';
            $scope.formValidator.errorSets.basicInfo.push(msg);
            $scope.form.location.val = ''
        } else {
            // Concatenating strings in javascript can sometimes result in a slow, painful death
            var metro = city + ", " + state;

            var location = {
                country: country,
                metro: metro,
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
            };

            _.extend($scope.form.location, location);
        }

        // Tell Angular its template data has changed.
        $scope.$apply();
    });

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});

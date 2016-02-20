var $ = window.$ = window.jQuery = require("jquery");
require("geocomplete");
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
        body.status = "active";

        var formInfo = formValidator(body);
        $scope.errorSets = formInfo.errorSets;
        console.log($scope.errorSets)

        if (formInfo.isValid) {
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: JSON.stringify(body),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                success: function (data) { alert("success") },
            });
            // if form submission success, show success message and redirect
        }
    };

    $scope.form.contacts.create();

    $(function () {
        $('[ng-model="form.location.val"]')
        .geocomplete()
        .bind("geocode:result", function (event, result) {
            // parse address components from google maps api response
            for (i in result.address_components) {
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
            if (!(state)) {
                state = city;
            }
            if (!(city && country)) {
                console.log(city, country);
                //raise a validation error. A specific location is required.
            }
            else {
                // concatenating strings in javascript can sometimes result in a slow, painful death
                var metro = city + ", " + state;

                var location = {
                    country: country,
                    metro: metro,
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                };

                _.extend($scope.form.location, location);
            }
        });
    });

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
    };
});

/**
 * @description
 * `$formValidator` validates the new team form input fields.
 * The function returns an associative array with two keys:
 *   `isValid` - true/false
 *   `messages`- helpful hints for the user to fix validation errors
 */
function formValidator (data) {

    // Setup
    var validFields = {};
    _.each([
        'name',
        'location',
        'contactsName',
        'contactsEmail'
    ], function (field) {
        validFields[field] = {
            isValid: true
        };
    });

    // Validate

    // "Basic Info"
    if (!data.name) validFields.name = false;
    if (!data.location.val) validFields.location = false;

    // "Contacts"
    _.each(data.contacts, function (contact) {
        if (!contact.name) validFields.contactsName = false;
        if (!contact.email) validFields.contactsEmail = false;
    });


    // Set error messages for invalid fields
    var errorSets = {};

    errorSets.basicInfo = [];
    if (!validFields.name)
        errorSets.basicInfo.push('- Field "Team Name" is required.');
    if (!validFields.location)
        errorSets.basicInfo.push('- Field "Location" is required.');

    errorSets.contacts = [];
    if (!validFields.contactsName)
        errorSets.contacts.push('- Each Contact requires a "Name".');
    if (!validFields.contactsEmail)
        errorSets.contacts.push('- Each Contact requires an "Email".');


    // Were any errors caught?
    var isValid = true;
    _.each(validFields, function (fieldVal) {
        if (!fieldVal) isValid = false;
    });

    var expose = {
        isValid: isValid,
        errorSets: errorSets
    };

    return expose;
}
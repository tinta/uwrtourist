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
        body["status"] = "active";
        var formInfo = formValidator(body);

        if (formInfo["isValid"]) {
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: JSON.stringify(body),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                success: function(data) { alert("success") },
            });
            // if form submission success, show success message and redirect
        }
        else {
            showValidationErrors(formInfo["messages"]);
        }
    };

    $(function () {
        $('[ng-model="form.location.val"]')
        .geocomplete()
        .bind("geocode:result", function(event, result) {
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
 *   `messages`- helpful hits for the user to fix validation errors
 */
function formValidator(data) {
    var messages = new Array();
    var isValid;

    // do the validation here, and populate messages if needed
    // messages.push("Houstin, there's a problem.")

    if (true) {
        isValid = true;
    }
    else {
        isValid = false;
    }

    var result = new Object;
    result["isValid"] = isValid;
    result["messages"] = messages;

    return result;
}

/**
 * @description
 * `$showValidationErrors` displays the validation error messages
 * in some kind of html element just below the menu. `messages`
 * is an array of strings.
 */
function showValidationErrors(messages) {
    console.log(messages)
}

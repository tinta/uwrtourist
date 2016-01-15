var angular = require("angular");

angular
.module('AddTeamFormModel', [
// Dependencies
])
.factory('AddTeamFormModel', function(
// Dependency Injections
    $rootScope
){
    var DynamicFields = (function () {
        var DynamicFields = function (defaults) {
            this.all = [];
            this.defaults = defaults;
        };

        DynamicFields.prototype.create = function (cb) {
            var newField = angular.copy(this.defaults);
            this.all.push(newField);
            if (cb) cb(newField);
            return newField;
        };

        DynamicFields.prototype.remove = function (index) {
            this.all.splice(index, 1);
        };

        return DynamicFields;
    })();

    var FormClass = (function() {
        var Form = function () {
            this.links = new DynamicFields({val: ''});

            this.contacts = new DynamicFields({
                name: '',
                email: '',
                title: ''
            });

            this.practiceLocations = new DynamicFields({
                name: '',
                city: '',
                region: '',
                country: '',
                postalCode: '',
                times: new DynamicFields({
                    startTime: '',
                    endTime: '',
                    day: '',
                    notes: ''
                })
            });

            this.practiceLocations.dayOptions = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];

            this.links.create();
            this.contacts.create();
            this.newPractice();
        };

        Form.prototype.newPractice = function () {
            this.practiceLocations.create(function(newlyCreatedField) {
                // newlyCreatedField.times.create();
            });
        };

        return Form;
    })();

    return FormClass;
});
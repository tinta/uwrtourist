var angular = require("angular");

angular
.module('AddTeamFormModel', [
// Dependencies
])
.factory('AddTeamFormModel', function(
// Dependency Injections
    $rootScope
){
    var dynamicFields = (function () {
        function dynamicFields (defaults) {
            var dyFields = {};
            dyFields.all = [];
            dyFields.create = function (cb) {
                var newField = angular.copy(defaults);
                this.all.push(newField);
                if (cb) cb(newField);
                return newField;
            };
            dyFields.remove = function (index) {
                this.all.splice(index, 1);
            };

            return dyFields;
        }
        return dynamicFields;
    })();

    var FormClass = (function() {
        var Form = function () {
            this.links = new dynamicFields({val: ''});

            this.contacts = new dynamicFields({
                name: '',
                email: '',
                title: ''
            });

            this.practiceLocations = new dynamicFields({
                name: '',
                city: '',
                region: '',
                country: '',
                postalCode: '',
                times: new dynamicFields({
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
                newlyCreatedField.times.create();
            });
        };

        return Form;
    })();

    return FormClass;
});
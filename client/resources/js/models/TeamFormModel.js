var _ = require("underscore");
var DynamicFields = require("./DynamicFieldsCollection.js");

var TeamFormModel = (function() {
    var TeamFormModel = function (team) {
        console.log(team)
        team = team || {};

        this.name = team.name || '';
        this.location = team.location || '';
        this.yearEstablished = team.year_established || 'n/a';
        this.blurb = team.blurb || '';

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

        if (team.links && team.links.length) {
            _.each(team.links, function (linkObj) {
                this.links.create(function(field) {
                    field.val = linkObj.link;
                });
            }.bind(this));
        }

        if (team.practice_locations && team.practice_locations.length) {
            _.each(team.practice_locations, function (practiceLocation) {
                this.practiceLocations.create(function(fields) {
                    fields.city = practiceLocation.city;
                    fields.country = practiceLocation.country;
                    fields.name = practiceLocation.name;
                    fields.zip = practiceLocation.postal_code;
                    fields.region = practiceLocation.region;
                    fields.address = practiceLocation.street_address;
                });
            }.bind(this));
        }

        console.log(team, this.practiceLocations);

        this.yearEstablishedOptions = ["n/a"];
        var firstYear = 1989;
        var currentYear = new Date().getFullYear();
        while (firstYear++ < currentYear) {
            this.yearEstablishedOptions.push(firstYear);
        }

        this.contacts.create();
    };

    TeamFormModel.prototype.newPractice = function () {
        this.practiceLocations.create(function(newlyCreatedField) {
            newlyCreatedField.times.create();
        });
    };

    return TeamFormModel;
})();

module.exports = TeamFormModel;
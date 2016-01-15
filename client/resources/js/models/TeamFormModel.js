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

        if (team.links) {
            _.each(team.links, function (linkData) {
                this.links.create(function (field) {
                    field.val = linkData.link;
                });
            }.bind(this));
        }

        if (team.practice_locations) {
            _.each(team.practice_locations, function (locData) {
                this.practiceLocations.create(function (locField) {
                    locField.city = locData.city;
                    locField.country = locData.country;
                    locField.name = locData.name;
                    locField.zip = locData.postal_code;
                    locField.region = locData.region;
                    locField.address = locData.street_address;

                    var times = locData.practice_times;
                    if (times) {
                        _.each(times, function (time) {
                            locField.times.create(function(timeField) {
                                timeField.day = time.day
                            });
                        }); 
                    }
                });
            }.bind(this));
        }

        if (team.contacts) {
            _.each(team.contacts, function (contactData) {
                this.contacts.create(function (field) {
                    field.name = contactData.name;
                    field.email = contactData.email;
                    field.title = contactData.title;
                });
            }.bind(this));
        }

        this.yearEstablishedOptions = ["n/a"];
        var firstYear = 1989;
        var currentYear = new Date().getFullYear();
        while (firstYear++ < currentYear) {
            this.yearEstablishedOptions.push(firstYear);
        }
    };

    TeamFormModel.prototype.newPractice = function () {
        this.practiceLocations.create(function(newlyCreatedField) {
            newlyCreatedField.times.create();
        });
    };

    return TeamFormModel;
})();

module.exports = TeamFormModel;
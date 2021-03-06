var _ = require("underscore");
var DynamicFields = require("./DynamicFieldsCollection.js");

var TeamFormModel = (function() {
    var TeamFormModel = function (team) {
        team = team || {};

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

        this.populate(team);
    };

    TeamFormModel.prototype.populate = function (team) {
        this.practiceLocations.dayOptions = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        this.name = team.name || '';
        this.location = {
            lat: '',
            lng: '',
            country: '',
            metro: '',
        };
        this.yearEstablished = team.year_established || 'n/a';
        this.blurb = team.blurb || '';

        this.status = team.status;
        this.isAdmin = Boolean(this.status);

        this.statusOptions = [
            "active",
            "suspended",
            "pending"
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

    TeamFormModel.prototype.getOutput = function () {
        var output = {
            name: this.name || '',
            location: this.location || '',
            year_established: '',
            blurb: this.blurb || '',
            status: this.status || '',
            links: this.links.getOutput(),
            practice_locations: this.practiceLocations.getOutput(),
            contacts: this.contacts.getOutput(),
        };

        output.links = _.map(output.links, function (link) {
            return {link: link.val};
        });

        _.each(output.practice_locations, function (location) {
            location.postal_code = location.postalCode;
            delete location.postalCode;
            location.street_address = location.address;
            delete location.address;
            location.times = location.times.getOutput();
        });

        if (this.yearEstablished !== 'n/a') output.year_established = this.yearEstablished;

        return output;
    };

    TeamFormModel.prototype.newPractice = function () {
        this.practiceLocations.create(function(newlyCreatedField) {
            newlyCreatedField.times.create();
        });
    };

    return TeamFormModel;
})();

module.exports = TeamFormModel;

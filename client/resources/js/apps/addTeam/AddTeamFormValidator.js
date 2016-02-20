var _ = require("underscore");

var AddTeamFormValidator = (function () {
    var AddTeamFormValidator = function () {
        this.reset();
    };

    AddTeamFormValidator.prototype.reset = function () {
        // Set error messages for invalid fields
        this.errorSets = {
            basicInfo: [],
            contacts: []
        };

        this.isValid = true;
    };

    /**
     * @description
     * `$validate` validates the new team form input fields.
     * The function returns an associative array with two keys:
     *   `isValid` - true/false
     *   `errorSets`- helpful hints for the user to fix validation errors
     */
    AddTeamFormValidator.prototype.validate = function (data) {
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

        // Reset
        this.reset();

        // Set error messages for invalid fields
        if (!validFields.name)
            this.errorSets.basicInfo.push('- Field "Team Name" is required.');
        if (!validFields.location)
            this.errorSets.basicInfo.push('- Field "Location" is required.');

        if (!validFields.contactsName)
            this.errorSets.contacts.push('- Each Contact requires a "Name".');
        if (!validFields.contactsEmail)
            this.errorSets.contacts.push('- Each Contact requires an "Email".');


        // Were any errors caught?
        _.each(validFields, function (fieldVal) {
            if (!fieldVal) this.isValid = false;
        });

        return this.isValid;
    };

    return AddTeamFormValidator;

})();

module.exports = AddTeamFormValidator;

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
        // Reset
        this.reset();

        // Setup
        var validFields = {};
        _.each([
            'name',
            'location',
            'mustHaveContact',
            'contactsName',
            'contactsEmail'
        ], function (field) {
            validFields[field] = true
        });


        // Validate

        // "Basic Info"
        if (!data.name) validFields.name = false;
        if (!data.location.val) validFields.location = false;

        // "Contacts"
        if (data.contacts.length === 0) validFields.mustHaveContact = false;
        _.each(data.contacts, function (contact) {
            if (!contact.name) validFields.contactsName = false;
            if (!contact.email) validFields.contactsEmail = false;
        });

        // Set error messages for invalid fields
        if (!validFields.name)
            this.errorSets.basicInfo.push('- Field "Team Name" is required.');
        if (!validFields.location)
            this.errorSets.basicInfo.push('- Field "Location" is required.');

        if (!validFields.contactsName)
            this.errorSets.contacts.push('- Each Contact requires a "Name".');
        if (!validFields.contactsEmail)
            this.errorSets.contacts.push('- Each Contact requires an "Email".');
        if (!validFields.mustHaveContact)
            this.errorSets.contacts.push('- At least one Contact is required.');


        // Were any errors caught?
        var isValid = true;
        _.each(validFields, function (fieldVal) {
            if (!fieldVal) isValid = false;
        });
        this.isValid = isValid;

        return isValid;
    };

    return AddTeamFormValidator;

})();

module.exports = AddTeamFormValidator;

var angular = require("angular");

var DynamicFieldsCollection = (function () {
    var DynamicFieldsCollection = function (defaults) {
        this.all = [];
        this.defaults = defaults;
    };

    DynamicFieldsCollection.prototype.create = function (cb) {
        var newField = angular.copy(this.defaults);
        if (cb) cb(newField);
        this.all.push(newField);
        return newField;
    };

    DynamicFieldsCollection.prototype.remove = function (index) {
        this.all.splice(index, 1);
    };

    return DynamicFieldsCollection;
})();

module.exports = DynamicFieldsCollection;
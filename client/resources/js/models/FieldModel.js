angular
.module('FieldModel', [
// Dependencies
])
.factory('FieldModel', function(
// Dependency Injections
    $rootScope
){

    var Field = (function() {
        function Field (title) {
            this.title = title || _.random(100000,999999);
            this.value = undefined;
            this.initial = undefined;
            this.isUnchanged = true;
            this.errors = [];
        }

        Field.prototype.validate = function () {
            return true;
        };

        Field.prototype.change = function () {
            this.isUnchanged = String(this.value) == String(this.initial);
            this.validate();

            if (!$rootScope.$$phase) $rootScope.$apply();
        };

        Field.prototype.set = function (value) {

            this.value = value;
            this.initial = value;
        };

        return Field;
    })();

    return Field;
});
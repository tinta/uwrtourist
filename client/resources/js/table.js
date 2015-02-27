angular
.module('Table', [
    // Dependencies
])
.factory("Table", function(
    $http,
    $filter
){
    var Table = (function() {
        var Table = function (collection) {
            this.all = collection;
            // Used for filtering
            this.filter = {
                val: ''
            };
            // `queried` is filled when `all` is filtered
            this.queried = [];
            // List of keys that are properties for each object in `schools`
            this.keys = [];
            this.setKeys(collection);
            console.log(this.keys[0]);

            this.order = {
                value   :  this.keys[0],
                latestInput : null,
                reverse : false,
                set     : function(key) {
                    this.latestInput = key;
                    doubleQuotedKey = "'" + key + "'";
                    if (this.value === doubleQuotedKey) {
                        this.reverse = !this.reverse; 
                    } else {
                        this.value = doubleQuotedKey;
                    }
                    return this;
                }
            };

        };

        Table.prototype.setKeys = function(arr) {
            var i = 0;
            var arrLen = arr.length;
            var key;
            for (i; i < arrLen; i++) {
                for (key in arr[i]) {
                    if (this.keys.indexOf(key) === -1) {
                        this.keys.push(key);
                    }
                }
            }
        };

        return Table;
    })();

    return Table;
});
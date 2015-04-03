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

            // List of keys that are properties for each object in `schools`
            this.keys.set(collection);
        };

        Table.prototype.filter = (function(){
            var _filter = {};
            _filter.value = '';
            _filter.apply = function (obj) {
                console.log(obj, _filter)
                var re = new RegExp(_filter.value, 'i');
                return !_filter.value || re.test(obj['name']) || re.test(obj['location']);
            }

            return _filter;
        })();

        Table.prototype.keys = {
            list: [],
            set: function (arr) {
                var i = 0;
                var arrLen = arr.length;
                var key;
                for (i; i < arrLen; i++) {
                    for (key in arr[i]) {
                        if (this.list.indexOf(key) === -1) {
                            this.list.push(key);
                        }
                    }
                }

                console.log(this)
                this.order.set(this.list[0]);
            },
            order: {
                value   :  null,
                latestInput : null,
                reverse : false,
                set     : function (key) {
                    this.latestInput = key;
                    doubleQuotedKey = "'" + key + "'";
                    if (this.value === doubleQuotedKey) {
                        this.reverse = !this.reverse;
                    } else {
                        this.value = doubleQuotedKey;
                    }
                    return this;
                }
            }
        };

        return Table;
    })();

    return Table;
});
angular
.module('Table', [
    // Dependencies
])
.factory("Table", function(
    $http,
    $filter
){
    var Table = (function() {
        var Table = function (collection, whiteList) {
            this.rows = collection;
            this.keys = whiteList;

            this.order = order.bind(this)();
            this.filter = filter.bind(this)();
        };

        function filter () {
            var _filter = {};
            _filter.value = '';
            _filter.apply = function (obj) {
                var re = new RegExp(_filter.value, 'i');
                return !_filter.value || re.test(obj['name']) || re.test(obj['location']);
            };

            return _filter;
        }

        function order () {
            var _order = {};
            _order.value =  null;
            _order.latestInput = null;
            _order.reverse = false;
            _order.set     = function (key) {
                this.latestInput = key;
                doubleQuotedKey = "'" + key + "'";
                if (this.value === doubleQuotedKey) {
                    this.reverse = !this.reverse;
                } else {
                    this.value = doubleQuotedKey;
                }
                return this;
            };

            return _order;
        }

        return Table;
    })();

    return Table;
});
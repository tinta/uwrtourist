angular
.module('Table', [
    // Dependencies
])
.factory("Table", function(
    $http
){
    var Table = (function() {
        var Table = function (options) {
            this.rows = {};
            this.rows.all = options.rows;
            this.rows.queried = [];

            this.keys = options.keys;

            this.order = order.bind(this)();
            this.filter = filter.bind(this)(options.filterKeys);
            this.paginate = paginate.bind(this)();

            this.filter.apply();
        };

        function filter (keys) {
            var root = this;

            var _filter = {};
            _filter.keys = keys;
            _filter.value = '';
            _filter.apply = function () {
                root.rows.queried = _.filter(root.rows.all, function(row) {
                    var include = false;
                    // Create version of row that only contains properties in `filter.keys` list
                    var filterRow = _.pick(row, this.keys);
                    _.each(filterRow, function(rowValue, key) {
                        rowValue = rowValue.toLowerCase();
                        filterValue = this.value.toLowerCase();
                        shouldInclude = rowValue.indexOf(filterValue) > -1;
                        if (shouldInclude) include = shouldInclude;
                    }.bind(this));
                    return include;
                }.bind(this));
                root.paginate.update();
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

        function paginate () {
            var root = this;

            var _paginate = {};

            _paginate.disabled = true;

            _paginate.pages = {};
            _paginate.pages.current = 0;
            _paginate.pages.maxRows = 20;
            _paginate.pages.length = 0;

            // Total number of pages for current set of queried data
            determineNumOfPages = function() {
                var pages = Math.ceil(root.rows.queried.length/this.pages.maxRows);
                return pages;
            };

            // `disableButtons` returns `true` if view's `previous` and `next` buttons should be disabled
            shouldNavBeDisabled = function() {
                var shouldBeDisabled = this.pages.length <= 1;
                return shouldBeDisabled;
            };

            _paginate.update = function () {
                this.pages.length = determineNumOfPages.bind(this)();
                this.disabled = shouldNavBeDisabled.bind(this)();
            };

            _paginate.displayCurrent = function() {
                if (this.pages.length === 0) return 0;
                var page = this.pages.current + 1;
                if (page <= 0) page = this.pages.length + page;
                return page;
            };

            // Go back one page
            _paginate.previous = function () {
                if (this.pages.current > 0) {
                    this.pages.current -= 1;
                } else {
                    this.pages.current = this.pages.length - 1;
                }
            };

            // Go forward one page
            _paginate.next = function () {
                if (this.pages.current < this.pages.length - 1) {
                    this.pages.current += 1;
                } else {
                    this.pages.current = 0;
                }
            };

            return _paginate;
        }

        return Table;
    })();

    return Table;
});
angular
.module('Table', [
    // Dependencies
])
.factory("Table", function(
    $http,
    $filter
){
    var Table = (function() {
        var Table = function (options) {
            this.rows = {};
            this.rows.all = options.rows;
            this.rows.queried = [];

            this.keys = options.keys;

            // Create list of keys that filter affects
            var filterKeys = (function() {
                var keys = [];
                _.each(options.keys, function(val) {
                    if (val.filter) keys.push(val.value);
                });
                return keys;
            })();

            this.order = order.bind(this)();
            this.filter = filter.bind(this)(filterKeys);
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

                    // 
                    _.each(filterRow, function(rowValue, key) {
                        rowValue = rowValue || '';
                        rowValue = rowValue.toLowerCase();
                        filterValue = this.value.toLowerCase();
                        shouldInclude = rowValue.indexOf(filterValue) > -1;
                        if (shouldInclude) include = shouldInclude;
                    }.bind(this));
                    return include;
                }.bind(this));
                root.paginate.update();
                root.paginate.currentPage = 0;
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

            _paginate.currentPage = 0;
            _paginate.firstRow = 0;
            _paginate.maxRows = 15;
            _paginate.length = 0;

            // Total number of pages for current set of queried data
            determineNumOfPages = function() {
                var pages = Math.ceil(root.rows.queried.length/this.maxRows);
                return pages;
            };

            // `disableButtons` returns `true` if view's `previous` and `next` buttons should be disabled
            shouldNavBeDisabled = function() {
                var shouldBeDisabled = this.length <= 1;
                return shouldBeDisabled;
            };

            _paginate.update = function () {
                this.length = determineNumOfPages.bind(this)();
                this.disabled = shouldNavBeDisabled.bind(this)();
                this.firstRow = this.currentPage * this.maxRows;
            };

            _paginate.displayCurrent = function() {
                if (this.length === 0) return 0;
                var page = this.currentPage + 1;
                if (page <= 0) page = this.length + page;
                return page;
            };

            // Go back one page
            _paginate.previous = function () {
                if (this.currentPage > 0) {
                    this.currentPage -= 1;
                } else {
                    this.currentPage = this.length - 1;
                }

                this.update();
            };

            // Go forward one page
            _paginate.next = function () {
                if (this.currentPage < this.length - 1) {
                    this.currentPage += 1;
                } else {
                    this.currentPage = 0;
                }

                this.update();
            };

            return _paginate;
        }

        return Table;
    })();

    return Table;
});
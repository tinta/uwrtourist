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

            this.apply();
        };

        Table.prototype.apply = function () {
            this.filter.apply();
            this.order.apply();
            this.paginate.apply();
            console.log(this)
        };

        function filter (keys) {
            var root = this;

            var _filter = {};
            _filter.keys = keys;
            _filter.value = '';
            _filter.rows = [];
            _filter.apply = function () {
                this.rows = _.filter(root.rows.all, function(row) {
                    var include = false;
                    // Create version of row that only contains properties in `filter.keys` list
                    var filterRow = _.pick(row, this.keys);

                    _.each(filterRow, function(rowValue, key) {
                        rowValue = rowValue || '';
                        rowValue = rowValue.toLowerCase();
                        filterValue = this.value.toLowerCase();
                        shouldInclude = rowValue.indexOf(filterValue) > -1;
                        if (shouldInclude) include = shouldInclude;
                    }.bind(this));

                    return include;
                }.bind(this));
            };

            return _filter;
        }

        function order () {
            var root = this;
            var _order = {};
            _order.value =  null;
            _order.latestInput = null;
            _order.reverse = false;
            _order.rows = [];
            _order.set     = function (key) {
                this.latestInput = key;
                doubleQuotedKey = "'" + key + "'";
                if (this.value === doubleQuotedKey) {
                    this.reverse = !this.reverse;
                } else {
                    this.value = doubleQuotedKey;
                }

                root.apply();
                return this;
            };

            _order.apply = function () {
                this.rows = _.sortByOrder(root.filter.rows, [this.latestInput], [!this.reverse]);
            }

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
            _paginate.rows = [];

            // Total number of pages for current set of queried data
            determineNumOfPages = function() {
                var pages = Math.ceil(root.order.rows.length / this.maxRows);
                return pages;
            };

            // `disableButtons` returns `true` if view's `previous` and `next` buttons should be disabled
            shouldNavBeDisabled = function() {
                var shouldBeDisabled = this.length <= 1;
                return shouldBeDisabled;
            };

            _paginate.apply = function () {
                console.log(this.currentPage);
                this.length = determineNumOfPages.bind(this)();
                this.disabled = shouldNavBeDisabled.bind(this)();
                this.firstRow = this.currentPage * this.maxRows;

                this.rows = _.slice(root.order.rows, this.firstRow, this.firstRow + this.maxRows);
            };

            _paginate.displayCurrent = function() {
                if (this.length === 0) return 0;
                var page = this.currentPage + 1;
                // if (page <= 0) page = this.length + page;
                return page;
            };

            // Go back one page
            _paginate.previous = function () {
                if (this.currentPage > 0) {
                    this.currentPage -= 1;
                } else {
                    this.currentPage = this.length - 1;
                }

                root.apply();
            };

            // Go forward one page
            _paginate.next = function () {
                console.log(this.currentPage, this.length)
                if (this.currentPage < this.length - 1) {
                    this.currentPage += 1;
                } else {
                    this.currentPage = 0;
                }

                console.log(this.currentPage)

                root.apply();
            };

            return _paginate;
        }

        return Table;
    })();

    return Table;
});
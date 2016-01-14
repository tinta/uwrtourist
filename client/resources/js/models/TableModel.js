var angular = require("angular");
var _ = require("underscore");

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

            this.order = order.call(this);
            this.filter = filter.call(this, filterKeys);
            this.paginate = paginate.call(this);

            this.apply();
        };

        Table.prototype.apply = function () {
            this.filter.apply();
            this.order.apply();
            this.paginate.apply();
        };

        function filter (keys) {
            var self = this;

            var filterModel = {
                keys: keys,
                value: '',
                rows: []
            };
            
            filterModel.apply = function () {
                this.rows = _.filter(self.rows.all, function(row) {
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

            return filterModel;
        }

        function order () {
            var self = this;
            var orderModel = {
                latestInput: null,
                value:  null,
                reverse: false,
                rows: []
            };

            orderModel.set = function (key) {
                this.latestInput = key;
                doubleQuotedKey = "'" + key + "'";
                if (this.value === doubleQuotedKey) {
                    this.reverse = !this.reverse;
                } else {
                    this.value = doubleQuotedKey;
                }

                self.apply();
                return this;
            };

            orderModel.apply = function () {
                this.rows = _.sortBy(self.filter.rows,this.latestInput);
                if (this.reverse) this.rows = this.rows.reverse();
            };

            return orderModel;
        }

        function paginate () {
            var self = this;

            var paginateModel = {
                disabled: true,
                currentPage: 0,
                firstRow: 0,
                maxRows: 15,
                length: 0,
                rows: []
            };

            // Total number of pages for current set of queried data
            determineNumOfPages = function() {
                var pages = Math.ceil(self.order.rows.length / this.maxRows);
                return pages;
            };

            // `disableButtons` returns `true` if view's `previous` and `next` buttons should be disabled
            shouldNavBeDisabled = function() {
                var shouldBeDisabled = this.length <= 1;
                return shouldBeDisabled;
            };

            paginateModel.apply = function () {
                this.length = determineNumOfPages.call(this);
                this.disabled = shouldNavBeDisabled.call(this);
                this.firstRow = this.currentPage * this.maxRows;

                var lastRow = this.firstRow + this.maxRows;
                this.rows = self.order.rows.slice(this.firstRow, lastRow);
            };

            paginateModel.displayCurrent = function() {
                if (this.length === 0) return 0;
                var page = this.currentPage + 1;
                return page;
            };

            // Go back one page
            paginateModel.previous = function () {
                if (this.currentPage > 0) {
                    this.currentPage -= 1;
                } else {
                    this.currentPage = this.length - 1;
                }

                self.apply();
            };

            // Go forward one page
            paginateModel.next = function () {
                if (this.currentPage < this.length - 1) {
                    this.currentPage += 1;
                } else {
                    this.currentPage = 0;
                }

                self.apply();
            };

            return paginateModel;
        }

        return Table;
    })();

    return Table;
});
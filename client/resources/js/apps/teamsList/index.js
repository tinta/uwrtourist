require("jquery");
var angular = require("angular");

var Links = require("./../../services/links.js");
require("./../../models/TableModel.js");
require("./../../filters/startAt.js");

angular.module('ControllerTeamsList', [
// Dependencies
    'Table',
    'Filter:StartAt'
], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
.controller('ControllerTeamsList', function(
// Dependency Injections
    $scope,
    $http,
    $timeout,
    $window,
    Table
){

    var tableOptions = {};
    tableOptions.rows = window.teams;

    tableOptions.keys = [
        {
            display: 'Name',
            value: 'name',
            filter: true
        },
        {
            display: 'Location',
            value: 'location',
            filter: true
        },
        {
            display: 'Country',
            value: 'country',
            filter: true
        },
        {
            display: 'Links',
            value: 'links'
        }
    ];

    $scope.table = new Table(tableOptions);

    $scope.table.order.set('country');

    $scope.applyTableFilter = function () {
        this.table.paginate.currentPage = 0;
        this.table.apply();
    };

    $scope.typeOf = function(input) {
        return typeof input;
    };

    $scope.getFAClass = function (url) {
        var className = Links.getIcon(url);
        return className || "fa-globe";
    };

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
        console.log($scope);
    };
});

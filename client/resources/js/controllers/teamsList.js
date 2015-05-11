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

    $scope.typeOf = function(input) {
        return typeof input;
    };

    var icons = {
        default: 'fa-globe',
        map: {
            '.facebook.': 'fa-facebook',
            '.wordpress.': 'fa-wordpress',
            '.tumblr.': 'fa-tumblr',
            '.google.': 'fa-google',
            '.youtube.': 'fa-youtube',
            '.meetup.': 'fa-meetup'
        },
        getClass: function (url) {
            if (!url) return false;
            var className = this.default;
            angular.forEach(this.map, function (val, key) {
                if (url.indexOf(key) > -1) className = val;
            });
            return className;
        }
    };

    $scope.icons = icons;


    $scope.followLink = function () {
        console.log('LLLL');
    };

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
        console.log($scope);
    };
});
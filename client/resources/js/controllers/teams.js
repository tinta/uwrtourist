angular.module('ControllerTeams', [
// Dependencies
    'Table'
], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
.controller('ControllerTeams', function(
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
        'name',
        'location',
        'links'
    ];
    tableOptions.filterKeys = [
        'name',
        'location'
    ];

    $scope.table = new Table(tableOptions);

    $scope.table.order.set('name');

    $scope.typeOf = function(input) {
        return typeof input;
    };

    var icons = {
        default: 'fa-globe',
        map: {
            '.facebook.': 'fa-facebook'
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
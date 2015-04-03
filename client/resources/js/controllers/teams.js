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
    $scope.table = new Table(window.teams);

    $scope.table.order.set('Name');

    $scope.table.filter.apply = function (obj) {
        var val = $scope.table.filter.val;
        var re = new RegExp(val, 'i');
        return !val || re.test(obj['Name']) || re.test(obj['Region']);
    };

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

window.teams = [
    {
        "Name": "San Francisco Bears",
        "Region": "San Francisco, CA, USA",
        "Club Size": "8-12",
        "Links": [
            "https://www.facebook.com/sfuwr",
            "http://www.meetup.com/San-Francisco-Underwater-Rugby-Meetup/"
        ]
    },
    {
        "Name": "Club CAMO",
        "Region": "Montreal, QC, CAN",
        "Club Size": "10-14",
        "Links": [
            "https://www.facebook.com/pages/Rugby-sous-marin-%C3%A0-Montr%C3%A9al-Underwater-Rugby-Montreal/813316622034684"
        ]
    },
    {
        "Name": "Quincy UWR",
        "Region": "Quincy, MA, USA",
        "Club Size": "10-14",
        "Links": [
            "http://www.underwaterrugby.org/"
        ]
    }
];
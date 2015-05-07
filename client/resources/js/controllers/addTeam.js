angular.module('ControllerAddTeam', [
// Dependencies
], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
.controller('ControllerAddTeam', function(
// Dependency Injections
    $scope,
    $http,
    $timeout,
    $window
){
    var dynamicFields = (function () {
        function dynamicFields (defaults) {
            var dyFields = {};
            dyFields.all = [];
            dyFields.create = function (cb) {
                console.log('new item created', defaults);
                var newField = angular.copy(defaults);
                this.all.push(newField);
                if (cb) cb(newField);
                return newField;
            };
            dyFields.remove = function (index) {
                this.all.splice(index, 1);
            };

            return dyFields;
        }
        return dynamicFields;
    })();


    $scope.form = {};

    $scope.form.links = new dynamicFields({val: ''});
    $scope.form.links.create();

    $scope.form.contacts = new dynamicFields({
        name: '',
        email: '',
        title: ''
    });
    $scope.form.contacts.create();

    $scope.form.practiceLocations = new dynamicFields({
        name: '',
        city: '',
        region: '',
        country: '',
        postalCode: '',
        times: new dynamicFields({
            startTime: '',
            endTime: '',
            day: '',
            notes: ''
        }),
    });
    $scope.form.practiceLocations.dayOptions = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    $scope.form.practiceLocations.create(function(newField) {
        newField.times.create();
    });

    // Dev
    $window.logScope = function () {
        $window.$scope = $scope;
        console.log($scope);
    };
});
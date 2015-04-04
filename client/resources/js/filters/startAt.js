angular
.module('Filter:StartAt', [
    // Dependencies
])
.filter('startAt', function () {
    return function(input, startAt) {
        startAt = +startAt; // Parse String to Integer
        var filteredInput = input.slice(startAt);
        return filteredInput;
    };
});
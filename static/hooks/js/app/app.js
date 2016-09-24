var app = angular.module('equinoxApp', ['ngAnimate', 'ui.bootstrap', 'ngCookies', 'ui-notification', 'ngRoute', 'toggle-switch']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
});

var removeJsonElementFromJsonArrayByKeyValue = function(json_array, key, value) {
    var toReturn = [];
    for(var i=0 ; i < json_array.length; i++) {
        if (!json_array[i].hasOwnProperty(key) || (json_array[i][key] != value))
            toReturn.push(json_array[i]);
    }
    return toReturn;
};

var isJsonElementInJsonArrayByKeyValue = function(json_array, key, value) {
    if (json_array == undefined || json_array == null)
        return false;

    for(var i=0 ; i < json_array.length; i++) {
        if (json_array[i].hasOwnProperty(key) && (json_array[i][key] == value))
            return true;
    }
    return false;
};
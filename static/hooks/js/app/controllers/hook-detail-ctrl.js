app.controller('HookDetailCtrl', ['$scope', '$sce', 'api', function ($scope, $sce, api)
{
    $scope.hook = {"id": 0};
    $scope.application = {};
    //$scope.methods = [{"name": "GET", "value": "GET"}, "POST", "PUT", "PATCH", "DELETE"];
    $scope.methods = [{"name": "GET", "value": "GET"}, {"name": "POST", "value": "POST"}, {"name": "PUT", "value": "PUT"},
    {"name": "PATCH", "value": "PATCH"}, {"name": "DELETE", "value": "DELETE"}];

    var reloadUrlHook = function() {
        var pathArray = window.location.pathname.split( '/' );
        var id = pathArray[pathArray.length-2];
        var appId = pathArray[pathArray.length-4];

        api.getApplication(appId).then(function(response) {
            $scope.application = response.data;
        });

        if (id == 0)
            return;

        api.getHook(id).then(function(response) {
            $scope.hook = response.data;
        });
    };

    $scope.initDetail = function() {
        reloadUrlHook();
    };


    $scope.removeHook = function(id) {
        api.deleteHook(id).then(function(response) {
            reloadUrlApplication();
        });
    };


    $scope.saveHook = function(name, description, latch_status, method, url, body, regex,  method2, url2, body2, regex2, application) {

        if ($scope.hook.id == 0) {

            api.createHook(name, description, latch_status, method, url, body, regex,  method2, url2, body2, regex2, application).then(function(response) {

            });

        } else {
            api.updateHook($scope.hook.id, name, description, latch_status, method, url, body, regex,  method2, url2, body2, regex2, application).then(function(response) {

            });
        }



    };

}]);
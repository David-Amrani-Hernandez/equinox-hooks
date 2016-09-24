app.controller('ApplicationDetailCtrl', ['$scope', '$sce', 'api', function ($scope, $sce, api)
{
    $scope.application = {};

    var reloadUrlApplication = function() {
        var pathArray = window.location.pathname.split( '/' );
        var id = pathArray[pathArray.length-2];

        api.getApplication(id).then(function(response) {
            $scope.application = response.data;
        });
    };

    $scope.initDetail = function() {
        reloadUrlApplication();
    };

    $scope.removeHook = function(id) {
        api.deleteHook(id).then(function(response) {
            reloadUrlApplication();
        });
    };

    $scope.editHook = function(id) {
        document.location.href = "hooks/" + id + "/";
    };

    $scope.newHook = function() {
        document.location.href = "hooks/0/";
    };

}]);
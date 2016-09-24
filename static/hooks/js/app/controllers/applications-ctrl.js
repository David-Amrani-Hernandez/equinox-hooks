app.controller('ApplicationCtrl', ['$scope', '$sce', 'api', function ($scope, $sce, api)
{
    $scope.applications = [];
    $scope.new_application = {"name": "Nombre de la aplicación"};
    $scope.show_new_application = false;

    var reloadApplications = function() {
        api.getApplications().then(function(response) {
            $scope.applications = response.data;
        });
    };

    $scope.initList = function() {
        reloadApplications();
    };

    $scope.newApplication = function() {
        $scope.show_new_application = true;
    };

    $scope.removeApplication = function(id) {
        api.deleteApplication(id).then(function(response) {
                reloadApplications();
            });
    };

    $scope.saveApplication = function(id, name, appId, secret) {
        api.updateApplication(id, name, appId, secret)
            .then(function(response) {
                reloadApplications();
        });
    };

    $scope.changeApplication = function(id) {
        document.location.href = "/applications/" + id + "/";
    };

    $scope.createApplication = function(name, appId, secret) {

        api.createApplication(name, appId, secret).then(function(response) {
            $scope.show_new_application = false;
            reloadApplications();
        });

    };

    $scope.pairApplication = function(application, token) {

        api.pairApplication(application, token).then(function(response) {
            reloadApplications();
        });

    };

    $scope.unpairApplication = function(application) {

        api.unpairApplication(application).then(function(response) {
            reloadApplications();
        });

    };

}]);
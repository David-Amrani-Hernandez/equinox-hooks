app.controller('ItemCtrl', ['$scope', '$sce', 'alleatApi', function ($scope, $sce, alleatApi)
{
    $scope.items = [];
    $scope.filterItems = [];
    $scope.allergens = [];
    $scope.allergenStates = [];
    $scope.allergenOptions = [];
    $scope.restaurantOptions = [];
    $scope.item = {"pk": 0};
    $scope.restaurant = {};
    $scope.new = true;
    $scope.categoryTags = [];
    $scope.categoryTagsOptions = [];

    $scope.loadTags = function(query) {
        return $scope.categoryTagsOptions;
    };

    var reloadItems = function() {
        alleatApi.getItems().then(function(response) {
            $scope.items = response.data.results;
            reloadFilterItems(null);
        });
    };

    var reloadCategories = function() {
        if (!$scope.item.hasOwnProperty("categories"))
            return;

        for (var i=0; i<$scope.item.categories.length; i++)
            $scope.categoryTags.push({"text": $scope.item.categories[i].name})
    };

    var reloadItem = function() {
        var pathArray = window.location.pathname.split( '/' );
        var id = pathArray[pathArray.length-1];

        if (id == "new-item") {
            reloadImage();
            return;
        }

        alleatApi.getItem(id).then(function(response) {
            $scope.item = response.data;
            reloadCategories();
            reloadAllergenOptions();
            reloadImage();
            loadCategoryTagOptions();
        }, function (response) {

        });
    };

    var reloadImage = function () {
        var imageFile = $('.image-editor').cropit('export');
        if (imageFile == null || imageFile == undefined) {
            var image = $scope.item.mainPhoto || '/static/alleat_web_management/img/Imagen_no_disponible.png';

            $('.image-editor').cropit({
                imageState: {
                    src: image,
                },
            });
        }
    };

    var reloadAllergens = function() {
        alleatApi.getAllergens().then(function(response) {
            $scope.allergens = response.data.results;
            reloadAllergenOptions();
        });
    };

    var reloadAllergenStates = function() {
        alleatApi.getAllergenStates().then(function(response) {
            $scope.allergenStates = response.data;
            reloadAllergenOptions();
        });
    };

    $scope.loadCategoryTagOptions = function() {
        loadCategoryTagOptions();
    };

    var loadCategoryTagOptions = function() {
        if (!$scope.item.hasOwnProperty("restaurant")) {
            $scope.categoryTagsOptions = [];
            return;
        }

        alleatApi.getCategories($scope.item.restaurant).then(function(response) {
            var results = response.data.results;
            $scope.categoryTagsOptions = [];
            for(var i=0; i<results.length; i++) {
                $scope.categoryTagsOptions.push(results[i].name);
            }
        });
    };

    var reloadRestaurantOptions = function() {
        alleatApi.getRestaurants().then(function(response) {
            $scope.restaurantOptions = response.data.results;
            if (!$scope.item.hasOwnProperty("restaurant")) {
                $scope.item.restaurant = $scope.restaurantOptions[0];
            }
        });
    };

    var reloadAllergenOptions = function() {
        $scope.allergenOptions = [];
        for(var i=0; i<Math.ceil($scope.allergens.length/4); i++) {
            $scope.allergenOptions[i] = [];
        }
        var row = 0;
        for (var i=0; i<$scope.allergens.length; i++) {
            var option = {};
            option["name"] = $scope.allergens[i].name;
            option["possiblyAllergenContentDescriptionHTML"] = $sce.trustAsHtml($scope.allergens[i].possiblyAllergenContentDescription);
            option["allergenContentDescriptionHTML"] = $sce.trustAsHtml($scope.allergens[i].allergenContentDescription);
            option["pk"] = $scope.allergens[i].pk;
            if ($scope.allergenStates.length > 0) {
                if ($scope.item.hasOwnProperty("allergenContent") && ($scope.item.allergenContent.indexOf($scope.allergens[i].pk) != -1)) {
                    option["state"] = $scope.allergenStates[2].code;
                } else if ($scope.item.hasOwnProperty("possiblyAllergenContent") && $scope.item.possiblyAllergenContent.indexOf($scope.allergens[i].pk) != -1) {
                    option["state"] = $scope.allergenStates[1].code;
                } else {
                    option["state"] = $scope.allergenStates[0].code;
                }
            }
            row = Math.floor(i/4);
            $scope.allergenOptions[row].push(option)
        }
    };

    var readFile = function() {
        var file = $scope.item.mainPhoto;
        if (file == undefined || file == null)
            return null;

        var filename = file.name;
        var filetype = file.type;

        if (filename == undefined) {
            var imageurlsplit = file.split("/");
            filename = imageurlsplit[imageurlsplit.length-1];
        }

        var imageData = $('.image-editor').cropit('export');

        if (imageData == null || imageData == undefined)
            return null;

        var png = imageData.split(',')[1];
        return png;
    };

    $scope.initDetail = function() {
        reloadItem();
        reloadRestaurantOptions();
        reloadAllergens();
        reloadAllergenStates();
        loadCategoryTagOptions();
    };

    $scope.initList = function() {
        reloadItems();
        reloadRestaurantOptions();
    };

    $scope.changeItem = function(item_id) {
        // this url should be auto-generated
        document.location.href = "/management/items/" + item_id;
    };

    var getCategories = function() {
        var to_return = [];
        for (var i=0 ; i<$scope.categoryTags.length; i++) {
            var category = $scope.categoryTags[i].text;
            to_return.push({"name": category});
        }
        return to_return;
    };

    var getAllergens = function(state) {
        var to_return = [];
        for (var i=0; i<$scope.allergenOptions.length; i++) {
            for (var j=0; j<$scope.allergenOptions[i].length; j++)
                if ($scope.allergenOptions[i][j].state == state)
                    to_return.push($scope.allergenOptions[i][j].pk);
        }
        return to_return;
    };

    var clearDetails = function() {
        $('.image-editor').cropit('imageSrc', '/static/alleat_web_management/img/Imagen_no_disponible.png');
        $('#main-image').val('');
        reloadItem();
        reloadRestaurantOptions();
        reloadAllergens();
        reloadAllergenStates();
        //$('#categories').importTags('');
    };

    $scope.saveItem = function() {

        var mainPhoto = readFile();
        var allergens = getAllergens($scope.allergenStates[2].code);
        var possibly_allergens = getAllergens($scope.allergenStates[1].code);
        var categories = getCategories();

        if ($scope.item.pk == 0) {

            alleatApi.createItem($scope.item.name, $scope.item.description, $scope.item.price,
            $scope.item.restaurant, mainPhoto, categories, allergens, possibly_allergens).then(function(response) {
                clearDetails();
            });

        } else {

            alleatApi.updateItem($scope.item.pk, $scope.item.name, $scope.item.description, $scope.item.price,
            $scope.item.restaurant, mainPhoto, categories, allergens, possibly_allergens).then(function(response) {

            });
        }
    };

    $scope.removeItem = function(item_id) {
        alleatApi.deleteItem(item_id).then(function(response) {
            $scope.items = removeJsonElementFromJsonArrayByKeyValue($scope.items, "pk", item_id);
            reloadItems();
        });
    };

    var reloadFilterItems = function(restaurant_id) {
        if (restaurant_id == null || restaurant_id == undefined) {
            $scope.filterItems = $scope.items;
            return;
        }

        $scope.filterItems = [];
        for (var i=0; i<$scope.items.length; i++) {
            if ($scope.items[i].restaurant == restaurant_id)
                $scope.filterItems.push($scope.items[i]);
        }

    };

    $scope.changeSelectedRestaurant = function(restaurant_id) {
        reloadFilterItems(restaurant_id);
    };

}]);
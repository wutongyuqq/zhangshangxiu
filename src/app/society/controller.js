app.controller('carInfoCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    $scope.getCarInfoData = function () {
        var carInfo = locals.getObject("carInfo");
        var params = {
            db:"mycon1",
            function:"sp_fun_down_car_info",
            customer_id: carInfo.customer_id
    };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;

            if (state == 'ok') {
                var dataArr =  data.data;
                $scope.carInfo = dataArr[0];
            }

        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });
    }
    $scope.getCarInfoData();
}]);


app.controller('czInfoCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    $scope.getCarOwerData = function () {
        var carInfo = locals.getObject("carInfo");
        var params = {
            db: "mycon1",
            function: "sp_fun_down_car_owner",
            customer_id: carInfo.customer_id
        };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var dataArr =  data.data;
                $scope.czInfo = dataArr[0];
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });
    }
    $scope.getCarOwerData();
}]);

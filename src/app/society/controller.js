app.controller('SocietyCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    $scope.getCarInfoData = function () {
        var carInfo = locals
        var params = {
            db: "mycon1",
            function: "sp_fun_down_car_owner",
            customer_id: postFlag
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

            if (state == 'ok' && postFlag != "end") {

            }

        }).error(function (data) {
            ionicToast.show("·þÎñÒì³£", "middle", 2000);
        });
    }
}]);

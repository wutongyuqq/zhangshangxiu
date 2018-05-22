app.controller('RegisterCtrl', ['$http','$scope','ionicToast','locals','$state',function($http, $scope,ionicToast,locals,$state) {

    $scope.carListData=[];
    $scope.searchName="";
    $scope.searchData=function(searchName){
        locals.setObject("selectCarInfo",null);
        var params= {
            db: "mycon1",
            function: "sp_fun_down_plate_number_other",
            company_code: "A",
            parameter: searchName
        }
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr,
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                $scope.carListData=data.data;
            } else {
                ionicToast.show(data.msg ? data.msg : "服务异常", 'middle',false, 1000);
            }
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    }


    $scope.toHomePage=function(item){

        locals.setObject("selectCarInfo",item);
        $state.go("home");

    }

}]);
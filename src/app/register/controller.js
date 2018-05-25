app.controller('RegisterCtrl', ['$http','$scope','ionicToast','locals','$state',function($http, $scope,ionicToast,locals,$state) {

    $scope.carListData=[];
    $scope.searchName="";


    $scope.searchData=function(searchName){
        locals.setObject("selectCarInfo",null);

        var carListData =  locals.getObject("carListData");
        var hasCarListData = new Array();
        if(carListData!=null && carListData.length!=null && carListData.length>0){
            for(var i=0;i<carListData.length;i++){
                var car=carListData[i];
                if(car.mobile.indexOf(searchName)!=-1||car.vipnumber.indexOf(searchName)!=-1||car.cz.indexOf(searchName)!=-1){
                    hasCarListData.push(car);
                }
            }
        }
        if(hasCarListData!=null && hasCarListData.length!=null && hasCarListData.length>0){
            $scope.carListData=hasCarListData;
        }else{
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
                var carListData=data.data;
                $scope.carListData=carListData;
                locals.setObject("carListData",carListData);
            } else {
                ionicToast.show(data.msg ? data.msg : "服务异常", 'middle',false, 1000);
            }
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
        }
    }

    $scope.goBackPage=function(){
        history.back()
    }
    $scope.toHomePage=function(item){

        locals.setObject("selectCarInfo",item);
        $state.go("home");

    }

}]);
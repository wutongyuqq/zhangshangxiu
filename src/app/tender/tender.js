app.controller('tenderIndex', ['$http', '$scope', 'utils', '$stateParams', '$state', 'userTemp', '$anchorScroll',"$location", "utils","locals","ionicToast",function ($http, $scope, utils, $stateParams, $state, userTemp,$anchorScroll,$location, utils,locals,ionicToast) {
   var carInfo = locals.getObject("carInfo");
    $scope.carInfo=carInfo;

    var projectPer = locals.getObject("10600");
    $scope.projectPer = projectPer;
    $scope.toProjectSelect=function(){
        if(projectPer.new!='1'){
            ionicToast.show('没有权限', 'middle',false, 1000);
        }else{
            $state.go("TenderDtail");
        }
    }
    $scope.toHistoryRecord=function(){
        $state.go("TendListDetail");
    }
    $scope.toBjSelect=function(){
        ionicToast.show('没有权限', 'middle',false, 1000);
    }

    $scope.updateCarInfo=function(isShowItem,num){

        if(num==1){
            $scope.isShowGls=!isShowItem;
        }else if(num==2){
            $scope.isShowCjh=!isShowItem;
        }else if(num==3){
            $scope.isShowCx=!isShowItem;
        }else if(num==4){
            $scope.isShowGls=!isShowItem;
        }else if(num==5){
            $scope.isShowGzms=!isShowItem;
        }else if(num==6){
            $scope.isShowJsr=!isShowItem;
        }else if(num==7){
            $scope.isShowBz=!isShowItem;
        }
        if(!isShowItem){
            return;
        }
        var carInfo = $scope.carInfo;
        var params =
        {   db:"mycon1",
            function:"sp_fun_update_customer_info",
            cz:carInfo.cz,
            mobile:carInfo.mobile,
            phone:carInfo.phone,
            linkman:carInfo.linkman,
            custom5:carInfo.custom5,
            cx:carInfo.cx,
            cjhm:carInfo.cjhm,
            fdjhm:carInfo.fdjhm,
            ns_date:"2018-05-19 00:00:00",
            customer_id:carInfo.customer_id
        };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                locals.setObject("carInfo",upLoadInfo);
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });
    }
}]);


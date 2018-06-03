app.controller('tenderIndex', ['$http', '$scope', '$state' , "locals", "ionicToast", "$modal",function ($http, $scope, $state,  locals, ionicToast,$modal) {
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    locals.set("ticheTime","");
    var projectPer = locals.getObject("10600");
    $scope.projectPer = projectPer;
    $scope.toProjectSelect = function () {
        if (projectPer.new != '1') {
            ionicToast.show('没有权限', 'middle', false, 2000);
        } else {
            $state.go("TenderDtail");
        }
    }
    $scope.toHistoryRecord = function () {

        $state.go("TendListDetailCtrl");
    }


    $scope.toWinbding = function () {
        $state.go("Winbding");
    }

    var jsd_id = locals.get("jsd_id");
    $scope.jsd_id = jsd_id;
    var params = {
        db:"mycon1",
        function:"sp_fun_down_repair_list_main",
        jsd_id:jsd_id
    };
    var jsonStr3 =  angular.toJson(params);
    var gdData = new Object();
    $scope.gdData = gdData;
    $http({
        method: 'post',
        url: '/restful/pro',
        dataType: "json",
        data:jsonStr3
    }).success(function (data, status, headers, config) {
        console.log(data);
        var state = data.state;
        if (state == 'ok') {
            var gdDataList = data.data;
            if(gdDataList!=null&&gdDataList.length>0){
                carInfo = $scope.carInfo;
                gdData = gdDataList[0];
                var carToInfo = gdData;
                var jcDataStr = gdData.jc_date;
                if(jcDataStr.length>10){
                    jcDataStr = jcDataStr.substring(0,10);
                }
                carToInfo.cz = carInfo.cz?carInfo.cz:gdData.cz;
                carToInfo.cardName = carInfo.cardName?carInfo.cardName:gdData.cp;
                carToInfo.gls = gdData.jclc;
                carToInfo.cjhm = gdData.cjhm;
                carToInfo.cx =gdData.cx;
                carToInfo.ticheTime = jcDataStr;
                carToInfo.gzms = gdData.car_fault;//故障描述
                carToInfo.jsr =gdData.jsr;//介绍人,没有取到
                carToInfo.ywtx = gdData.memo;//备注
                carToInfo.ticheTime = (gdData.ywg_date&&gdData.ywg_date.length>9)?gdData.ywg_date.substring(0,10):"";//备注
                $scope.carInfo = carToInfo;
            }

        }
    });


    $scope.cancleJieche = function () {


        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modal8.html',
            controller: 'modalFCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return null;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (delData) {
            var jsd_id=locals.get("jsd_id");
            var params2 = {
                db:"mycon1",
                function:"sp_fun_delete_repair_list_main",
                jsd_id:jsd_id
            }

            var jsonStr3 =  angular.toJson(params2);

            $scope.gdData = gdData;
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data:jsonStr3
            }).success(function (data, status, headers, config) {
                console.log(data);
                var state = data.state;
                if (state == 'ok') {

                    locals.set("jsd_id","");
                    $state.go("home");
                }else{
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);

                }
            });
        }, function () {

        });
    }
    $scope.goBackPage=function(){
        history.back()
    }
    $scope.toBjSelect = function () {
        ionicToast.show('没有权限', 'middle', false, 2000);
    }


    $scope.clickNum=0;
    $scope.updateCarInfo = function (isShowItem, num) {

        if (num == 1) {

            $scope.isShowGls = !isShowItem;
        } else if (num == 2) {

            $scope.isShowCjh = !isShowItem;
        } else if (num == 3) {

            $scope.isShowCx = !isShowItem;
        } else if (num == 4) {

            locals.set("ticheTime",$scope.carInfo.ticheTime);
        } else if (num == 5) {
            $scope.isShowGzms = !isShowItem;
        } else if (num == 6) {

            $scope.isShowJsr = !isShowItem;
        } else if (num == 7) {

            $scope.isShowBz = !isShowItem;
        }
        if (!isShowItem) {
            return;
        }
        if(num!=5){
            var totleNum =  $scope.clickNum+1;
            $scope.clickNum =  totleNum;
        }else{
            var carInfo = $scope.carInfo;
            var params = {
                db:"mycon1",
                function:"sp_fun_update_fault_info",
                customer_id:carInfo.customer_id,
                car_fault:$scope.carInfo.gzms,
                days:$scope.getDateTime()
            };
            var jsonStr5 = angular.toJson(params);
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr5
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }

    }
    $scope.$on('$stateChangeStart', function (event, toState, fromState){
        if($scope.clickNum>0){
        $scope.updateCarInfoToServer();
        }

    });

    $scope.updateCarInfoToServer=function(){
        var carInfo = $scope.carInfo;
        var params =
        {
            db: "mycon1",
            function: "sp_fun_update_customer_info",
            cz: carInfo.cz,
            mobile: carInfo.mobile,
            phone: carInfo.phone,
            linkman: carInfo.linkman,
            custom5: carInfo.custom5,
            cx: carInfo.cx,
            cjhm: carInfo.cjhm,
            fdjhm: carInfo.fdjhm,
            customer_id: carInfo.customer_id
        };
        var jsonStr4 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr4
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                locals.setObject("carInfo", carInfo);
                var allCarList = locals.getObject("cardDataList");
                if(allCarList!=null&&allCarList.length>0){
                    for(var i=0;i<allCarList.length;i++){
                        var carItem = allCarList[i];
                        if(carItem.mc==carInfo.mc){
                            allCarList.splice(i,1,carItem);
                        }
                    }
                }

                locals.setObject("cardDataList",allCarList);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }

        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });


    }




    $scope.getDateTime = function(){
        var now = new Date();
        var year = now.getFullYear();
        var month =(now.getMonth() + 1).toString();
        var day = (now.getDate()).toString();
        var hour = (now.getHours()).toString();
        var minute = (now.getMinutes()).toString();
        var second = (now.getSeconds()).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        if (hour.length == 1) {
            hour = "0" + hour;
        }
        if (minute.length == 1) {
            minute = "0" + minute;
        }
        if (second.length == 1) {
            second = "0" + second;
        }
        var dateTime = year + "-" + month + "-" + day +" "+ hour +":"+minute+":"+second;
        return dateTime;

    }


}]);


//模态框对应的Controller
app.controller('modalFCtrl', function ($scope, $state, $modalInstance, locals, data) {
   var carInfo = locals.getObject("carInfo");
    $scope.cardName = carInfo.cardName;
    //在这里处理要进行的操作
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});
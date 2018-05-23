app.controller('tenderIndex', ['$http', '$scope', '$state' , "locals", "ionicToast", "$modal",function ($http, $scope, $state,  locals, ionicToast,$modal) {
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;

    var projectPer = locals.getObject("10600");
    $scope.projectPer = projectPer;
    $scope.toProjectSelect = function () {
        if (projectPer.new != '1') {
            ionicToast.show('没有权限', 'middle', false, 1000);
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
            locals.set("jsd_id","");
            $state.go("home");
        }, function () {

        });


    }




    $scope.toBjSelect = function () {
        ionicToast.show('没有权限', 'middle', false, 1000);
    }



    $scope.updateCarInfo = function (isShowItem, num) {

        if (num == 1) {
            $scope.isShowGls = !isShowItem;
        } else if (num == 2) {
            $scope.isShowCjh = !isShowItem;
        } else if (num == 3) {
            $scope.isShowCx = !isShowItem;
        } else if (num == 4) {
            $scope.isShowGls = !isShowItem;
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
            var jsonStr = angular.toJson(params);
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    locals.setObject("carInfo", carInfo);
                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });


        }else{
            var carInfo = $scope.carInfo;
            var params = {
                db:"mycon1",
                function:"sp_fun_update_fault_info",
                customer_id:carInfo.customer_id,
                car_fault:"漏机油",
                days:"2018-04-17 00:00:00"
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

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });
        }

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
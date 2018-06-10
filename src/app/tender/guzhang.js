app.controller('guzhangCtrl', ['$http', '$scope', '$state' , "locals", "ionicToast", "$modal",function ($http, $scope, $state,  locals, ionicToast,$modal) {
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    var jsdId = locals.get("jsd_id");
    $scope.jsd_id = jsdId;


    $scope.getGuzhangHistory=function(){
        var params2 = {
            db:"mycon1",
            function:"sp_fun_get_fault_info",
            customer_id:carInfo.customer_id,
            days:"1901-01-01 0:00:00"
        }

        var jsonStr3 =  angular.toJson(params2);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data:jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {

                $scope.dzDataList=data.data;
            }else{
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);

            }
        });


    }
    $scope.getGuzhangHistory();




    $scope.showFirstModel = function () {


        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modalOne.html',
            controller: 'modalMCtrl',
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
    $scope.showFirstModel();



}]);


//模态框对应的Controller
app.controller('modalMCtrl', function ($scope, $state, $modalInstance, locals, data) {
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
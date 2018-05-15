app.controller('HomeCtrl', ['$http', '$log', '$scope', '$document', 'userTemp', '$anchorScroll', "$location", "utils", "locals","$modal",function ($http, $log, $scope, $document, userTemp, $anchorScroll, $location, utils, locals,$modal) {
    var selt = this;
    $scope.showCardList = false;
    var carInfo = new Object();
    carInfo.company_code="";
    carInfo.plate_number="";
    carInfo.cz="";
    carInfo.mobile="";
    carInfo.phone="";
    carInfo.linkman="";
    carInfo.custom5="";
    carInfo.cx="";
    carInfo.cjhm="";
    carInfo.fdjhm="";
    carInfo.ns_date="";
    carInfo.oprater_code="";
    carInfo.cardName="";
    carInfo.gzms="";
    carInfo.ysph="";
    carInfo.ywtx="";
    $scope.carInfo = carInfo;
    $scope.showMore = 0;
    $scope.showCard = false;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
    }
    $scope.showCardMore = function (showCard) {
        $scope.showCard = !showCard;
    }
    $scope.selectCard = function (proviceName) {
        $scope.proName = proviceName;
        $scope.showCard = false;

    }
    $scope.showOldCardList = function ($event) {
        console.log('222');
    }

    $scope.$watch('carInfo.cardName', function () {
        var cardName = $scope.carInfo.cardName;
        if (cardName != "") {
            var previous_xh = locals.get("previous_xh", "0");
            var params = {
                db: "mycon1",
                function: "sp_fun_down_plate_number",
                company_code: "A",
                previous_xh: previous_xh
            };
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: angular.toJson(params),
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    locals.set("previous_xh", "2");
                    $scope.cardDataList = data.data;

                }
            });
        }
    });

    $scope.uploadCardInfo = function (upLoadInfo) {
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



        var params = {
            db:"mycon1",
            function:"sp_fun_upload_repair_list_main",
            company_code:"A",
            plate_number:upLoadInfo.cardName,
            cz:upLoadInfo.cz,
            mobile:upLoadInfo.mobile,
            phone: upLoadInfo.phone,
            linkman:upLoadInfo.linkman,
            custom5: upLoadInfo.custom5,
            cx:upLoadInfo.cx,
            cjhm:upLoadInfo.cjhm,
            fdjhm:upLoadInfo.fdjhm,
            ns_date:dateTime,
            oprater_code:"superuser",
            xllb:"保养",
            jclc:"5000",
            ywg_date:dateTime,
            keys_no:'',
            memo:'',
            customer_id:upLoadInfo.customer_id,
            jsd_id:''

        };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr,
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {


            }
        }).error(function(data){
                console.log("3333");
            });
    }

    var data = "通过modal传递的数据";
    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl : 'modal.html',//script标签中定义的id
            controller : 'modalCtrl',//modal对应的Controller
            size: 'lg',
            resolve : {
                data : function() {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        })
    }



    $scope.showCardName = function(item){
        carInfo = item;
        carInfo.company_code=item.customer_id;
        carInfo.cx=item.mc;
        carInfo.cardName=item.mc;
        $scope.carInfo=carInfo;
        $scope.showCardList = false;

    }
//{"mc":"浙G3G821","cz":"浙G3G821","mobile":"","phone":"","vipnumber":"","customer_id":"A2018N00008","linkman":"","custom5":"","cx":"","cjhm":"","fdjhm":"","ns_date":"","openid":""},
//车牌号码、        车主名称、      手机号码、   送修人电话、 会员卡号、    客户编码、                     送修人、  推荐人客户编码、车型、  车架号、  发动机号、  年审日期、   微信openid
}]);


//模态框对应的Controller
app.controller('modalCtrl', function($scope, $modalInstance, data) {
    $scope.data= data;

    //在这里处理要进行的操作
    $scope.ok = function() {
        $modalInstance.close();
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});
app.controller('HomeCtrl', ['$http', '$scope', '$document', 'userTemp', '$anchorScroll', "$location", "utils", "locals","$modal","$state","ionicToast",function ($http, $scope, $document, userTemp, $anchorScroll, $location, utils, locals,$modal,$state,ionicToast) {
    var selt = this;
    var user = locals.getObject("user");
    if(user==null||user.userName==null){
        $state.go("Login");
    }
    var userName = user.userName;

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


//获取车牌列表
    var previous_xh = "0";
    var allCardDataList  = [];
    $scope.cardDataList = [];
    $scope.getCardListData = function(){
        if(previous_xh=="end"){
            $scope.cardDataList = allCardDataList;
            locals.setObject("cardDataList",allCardDataList);
            return;
        }
        var params = {
            db: "mycon1",
            function: "sp_fun_down_plate_number",
            company_code: user.company_code,
            previous_xh: previous_xh
        };
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params),
        }).success(function (data, status, headers, config) {
            var state = data.state;
            previous_xh = data.Previous_xh;
            if (state == 'ok') {
                allCardDataList = allCardDataList.concat(data.data);
            }
            $scope.getCardListData();
        });


    }

    $scope.getCardListData();
    $scope.showCardListData = function () {
        $scope.showCardList = true;
    };


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

    $scope.uploadCardInfo = function (upLoadInfo) {



        if(upLoadInfo.cardName==null||upLoadInfo.cardName==""){
            ionicToast.show('车牌必填', 'middle',false, 1000);
            return;
        }
        if(upLoadInfo.linkman==null||upLoadInfo.linkman==""){
            ionicToast.show('报修人必填', 'middle',false, 1000);
            return;
        }
        if(upLoadInfo.phone==null||upLoadInfo.phone==""){
            ionicToast.show('手机号必填', 'middle',false, 1000);
            return;
        }

        var isNewCar = $scope.judgeNewCar(upLoadInfo.cardName);
        if(isNewCar){
            var params = {
            db:"mycon1",
                function:"sp_fun_upload_customer_info",
                company_code:user.company_code,
                plate_number:upLoadInfo.cardName,
                cz:upLoadInfo.cz,
                mobile:upLoadInfo.mobile,
                phone: upLoadInfo.phone+'',
                linkman:upLoadInfo.linkman,
                custom5:upLoadInfo.custom5,
                cx:upLoadInfo.cx,
                cjhm:upLoadInfo.cjhm,
                fdjhm:upLoadInfo.fdjhm,
                oprater_code:userName
            }
            var jsonStr = angular.toJson(params);
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr,
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    upLoadInfo.customer_id=data.customer_id;
                    locals.setObject("carInfo",upLoadInfo);
                    $scope.uploadCarToServer(upLoadInfo);

                }else {
                    ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
                }
            }).error(function(data){
                ionicToast.show("服务异常");
            });



        }else{
            var params = {
                db:"mycon1",
                function:"sp_fun_update_customer_info",
                cz:upLoadInfo.cz,
                mobile:upLoadInfo.mobile,
                phone: upLoadInfo.phone+'',
                linkman:upLoadInfo.linkman,
                custom5:upLoadInfo.custom5,
                cx:upLoadInfo.cx,
                cjhm:upLoadInfo.cjhm,
                fdjhm:upLoadInfo.fdjhm,
                customer_id:upLoadInfo.customer_id
            }
            var jsonStr = angular.toJson(params);
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr,
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    locals.setObject("carInfo",upLoadInfo);
                    $scope.uploadCarToServer(upLoadInfo);
                }else {
                    ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
                }
            }).error(function(data){
                ionicToast.show("服务异常");
            });

        }

    }




    $scope.uploadCarToServer=function(upLoadInfo){

        var dateTime=$scope.getDateTime();

        var params = {
            db:"mycon1",
            function:"sp_fun_upload_repair_list_main",
            company_code:user.company_code,
            plate_number:upLoadInfo.cardName,
            cz:upLoadInfo.cz,
            mobile:upLoadInfo.mobile,
            phone: upLoadInfo.phone+'',
            linkman:upLoadInfo.linkman,
            custom5: upLoadInfo.custom5,
            cx:upLoadInfo.cx,
            cjhm:upLoadInfo.cjhm,
            fdjhm:upLoadInfo.fdjhm,
            ns_date:dateTime,
            oprater_code:userName,
            xllb:"保养",
            jclc:upLoadInfo.gls,
            ywg_date:dateTime,
            keys_no:upLoadInfo.ysph,
            memo:upLoadInfo.ywtx,
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
                locals.set("jsd_id",data.jsd_id);
                $state.go("Tender");

            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });





    }

    $scope.insertCarInfo = function(upLoadInfo){
        var params= {
            "db":"mycon1",
            "function":"sp_fun_update_customer_info",
            "cz":upLoadInfo.cz,
            "mobile":upLoadInfo.mobile,
            "phone":upLoadInfo.phone,
            "linkman":upLoadInfo.linkman,
            "custom5":upLoadInfo.custom5,
            "cx":upLoadInfo.cx,
            "cjhm":upLoadInfo.cjhm,
            "fdjhm":upLoadInfo.fdjhm,
            "ns_date":upLoadInfo.ns_date,
            "customer_id":upLoadInfo.customer_id,
        }

        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr,
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $state.go("Tender");
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });

    }
    $scope.openModal = function(data) {
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
        carInfo.phone = item.phone?Number(item.phone):"";
        carInfo.company_code=user.company_code;
        carInfo.cx=item.mc;
        carInfo.cardName=item.mc;
        $scope.carInfo=carInfo;
        $scope.showCardList = false;

    }
    var params = {
        db:"mycon1",
        function:"sp_fun_get_oprater_right",
        operater_code:userName
    };
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
            var dataArr = data.data;
            for(var i=0;i<dataArr.length;i++){
                var item = dataArr[i];
                locals.setObject(item.menu_right,item);
            }

        }
    })

//获取项目一级页面配置

    $scope.getFirstPageData=function(){

        var params={
            db:"mycon1",
            function:"sp_fun_down_maintenance_category"
        }

        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if(state=="ok"){
                var firstIconArr = data.data;
                $scope.firstIconArr = firstIconArr;
                locals.setObject("firstIconArr",firstIconArr);
            }
        });
    }
    if(locals.getObject("firstIconArr")==null||locals.getObject("firstIconArr").length==0){
        $scope.getFirstPageData();
    }

//获取项目二级页面配置
    var kjProList = [];
    var chgProList = [];
    var postFlag = "0";

    $scope.getIconData = function () {
        if (postFlag == "122") {
            locals.setObject("kjProList",kjProList);
            locals.setObject("chgProList",chgProList);
            return;
        }
        var params = {
            db: "mycon1",
            function: "sp_fun_down_maintenance_project",
            previous_xh: postFlag
        };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            postFlag = data.Previous_xh;
            if (state == 'ok' && postFlag != "end") {
                var dataList = data.data;
                for (var i = 0; i < dataList.length; i++) {
                    var item = dataList[i];
                    if (item.tybz=="0"&&item.wxgz!=null&&item.wxgz!='') {
                        if (item.is_quick_project == "是") {
                            kjProList.push(item);
                        }else if(item.is_quick_project == "否"){
                            chgProList.push(item);
                        }
                    }
                }
                $scope.getIconData();
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }
    if(locals.getObject("kjProList")==null||locals.getObject("chgProList")==null||locals.getObject("kjProList").length==0||locals.getObject("chgProList").length==0){
        $scope.getIconData();
    }

    $scope.judgeNewCar=function(cardName){

        if(allCardDataList!=null && allCardDataList.length>0){
            for(var i=0;i<allCardDataList.length;i++){
                var itemCar = allCardDataList[i];
                if(cardName==itemCar.mc){
                    return false;
                }
            }
        }
        return true;
    }
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
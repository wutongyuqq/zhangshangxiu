app.controller('WinBidCtrl', ['$http', '$scope', '$state','locals', 'ionicToast',function ($http, $scope, $state,locals,ionicToast) {
    var carInfo =locals.getObject("carInfo");

    $scope.carInfo = carInfo;
    var params = {
        db:"mycon1",
        function:"sp_fun_down_poundage"
    };
    var jsToBean = new Object();
    jsToBean.wxFl="";
    jsToBean.zfbFl="";
    jsToBean.yhkFl="";
    $scope.jsToBean = jsToBean;
    $http({
        method: 'post',
        url: '/restful/pro',
        dataType: "json",
        data: angular.toJson(params),
    }).success(function (data, status, headers, config) {
        console.log(data);
        var state = data.state;
        if (state == 'ok') {
            var dataArray = data.data;
            if(dataArray!=null && dataArray.length>0){
                var jsdBean = jsToBean;

                for(var i=0;i<dataArray.length;i++){
                    var bean = dataArray[i];
                    if(bean.name=="微信"){
                        jsdBean.wxFl = bean.setup2;
                    }else if(bean.name=="支付宝"){
                        jsdBean.zfbFl = bean.setup2;
                    }else if(bean.name=="中行刷卡"){
                        jsdBean.yhkFl = bean.setup2;
                    }
                }
                $scope.jsToBean = jsdBean;
            }
            console.log(data.msg);
        }
    });
    var shouyinBean = locals.getObject("shouyinBean");
    $scope.shouyinBean = shouyinBean;
    $scope.isShowAll = false;

    $scope.showAllMoney=function(){
        var params2={
        db:"mycon1",
        function:"sp_fun_get_vipcard_money",
        vipcard_no:$scope.vipcard_no
    }

        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params2),
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                $scope.isShowAll = true;
                    $scope.vipcard_money = data.vipcard_money;
            }else{
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        });



    }

    $scope.xianjinPay=function(){

        $scope.xianjinNum = shouyinBean.ysje;
    }
    $scope.goBackPage=function(){

        history.back();
    }


    $scope.shuakaPay=function(){

        $scope.shuakaNum = shouyinBean.ysje;
    }


    $scope.zhuanzhangPay=function(){

        $scope.zhuanzhangNum = shouyinBean.ysje;
    }


    $scope.guazhangPay=function(){

        $scope.guazhangNum = shouyinBean.ysje;
    }

    $scope.weixinPay=function(){

        $scope.weixinNum = shouyinBean.ysje;
    }
    $scope.zfbPay=function(){

        $scope.zfbNum = shouyinBean.ysje;
    }
    $scope.shouYin=function(){
        var carInfo =locals.getObject("carInfo");
        var user = locals.getObject("user");
        var jsd_id = locals.get("jsd_id");
        $scope.carInfo = carInfo;




        var sxf = ($scope.weixinNum)*($scope.jsToBean.wxFl)+($scope.shuakaNum)*($scope.jsToBean.yhkFl);
        var sxf1 = ($scope.weixinNum)*($scope.jsToBean.wxFl);
        var sxf2 = ($scope.jsToBean.yhkFl)*($scope.shuakaNum);
        var ssje=shouyinBean.ysje - shouyinBean.yhje - sxf - shouyinBean.bit_use;

        var params = {
            db:"mycon1",
            function:"sp_fun_upload_receivables_data",
            company_code:user.company_code,
            customer_id:carInfo.customer_id,
            plate_number:carInfo.cardName,
            jsd_id:jsd_id,
            czy:user.userName,
            ysje:shouyinBean.ysje?shouyinBean.ysje:'0',
            yhje:shouyinBean.yhje?shouyinBean.yhje:'0',
            sxf:sxf?sxf:'0',
            ssje:ssje?ssje:'0',
            skfs:"现金",
            bit_compute:shouyinBean.bit_compute?shouyinBean.bit_compute:'0',
            bit_use:shouyinBean.bit_use?shouyinBean.bit_use:'0',
            skfs1:"微信",
            skje1:$scope.weixinNum?shouyinBean.weixinNum:'0',
            sxf1:sxf1,
            skfs2:"中行刷卡",
            skje2:$scope.shuakaNum?$scope.shuakaNum:'0',
            sxf2:sxf2?sxf2:'0',
            pre_payment:"0.00",
            vipcard_no:$scope.vipcard_no
        };
        var jsonToRes = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonToRes
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                ionicToast.show("提交成功", 'middle', false, 1000);
                $state.go("Winbding");
            }
        });
    }
}]);
app.controller('WinTotalCtrl', ['$http', '$scope', '$state','locals', 'ionicToast',function ($http, $scope, $state,locals,ionicToast) {
    var carInfo =locals.getObject("carInfo");
    var user =locals.getObject("user");
    $scope.factoryName = user.factoryName;
    var jsd_id = locals.get("jsd_id");
    var ticheTime = locals.get("ticheTime");
    $scope.carInfo = carInfo;
    $scope.jsd_id = jsd_id;
    $scope.ticheTime = ticheTime;
    var jsdInfo = new Object();
    $scope.getBaseData=function(){
        var params = {
            db:"mycon1",
            function:"sp_fun_down_repair_list_main",
            jsd_id:jsd_id
        };
        var jsonStr =  angular.toJson(params);
        var gdData = new Object();
        $scope.gdData = gdData;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data:jsonStr
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var gdDataList = data.data;
                if(gdDataList!=null&&gdDataList.length>0){
                    gdData = gdDataList[0];
                    jsdInfo = gdData;
                    $scope.gdData = gdData;

                    $scope.getGzData(gdData.jc_date);
                }
            }
        });

    }

    $scope.getBaseData();

    $scope.getGzData=function(jcDataStr){

    var carInfo = locals.getObject("carInfo");

            var params3= {
                db:"mycon1",
                function:"sp_fun_get_fault_info",
                customer_id:carInfo.customer_id,
                days:jcDataStr
        }

        var jsonStr3 = angular.toJson(params3);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data:jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var gzDataItem = data.data;
            }
        });
    }


    $scope.pjDataList = new Array();
    var totalCb = 0;
    var jsdInfo = new Object();
    $scope.getPjListData = function(){
        var params2 = {
            db:"mycon1",
            function:"sp_fun_down_jsdmx_pjclmx",
            jsd_id:jsd_id
        };
        var jsonStr2 =  angular.toJson(params2);
        var pjData = new Object();
        $scope.pjData = pjData;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data:jsonStr2
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var gdDataList = data.data;
                if(gdDataList!=null&&gdDataList.length>0){
                    $scope.pjDataList = gdDataList;
                    if(gdDataList!=null && gdDataList.length>0){
                        var totalsl = 0;
                        var totalMoney = 0;
                        for(var i=0;i<gdDataList.length;i++){
                            var bean = gdDataList[i];
                            totalsl += Number(bean.sl);
                            totalMoney += Number(bean.ssj)*Number(bean.sl);
                            totalCb+=Number(bean.cb);
                        }
                        $scope.totalsl = totalsl;
                        $scope.totalMoney = totalMoney;
                    }
                }
            }
        });
    }
    $scope.getPjListData();
    $scope.getProjListData = function(){
        var params2 = {
            db:"mycon1",
            function:"sp_fun_down_jsdmx_xlxm",
            jsd_id:jsd_id
        };
        var jsonStr3=  angular.toJson(params2);
        var pjData = new Object();
        $scope.pjData = pjData;
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
                    $scope.xmDataList = gdDataList;
                    if(gdDataList!=null && gdDataList.length>0){
                        var totalXlf = 0;
                        var totalZk = 0;
                        for(var i=0;i<gdDataList.length;i++){
                            var bean = gdDataList[i];
                            totalXlf += Number(bean.xlf);
                            totalZk += Number(bean.zk);
                        }
                        $scope.totalXlf = totalXlf;
                        $scope.totalZk = totalZk;
                    }

                }
            }
        });
    }
    $scope.getProjListData();

    $scope.goBackPage=function(){
        history.back();
    }


    $scope.getCompanyData=function(){
        var params2 = {
        db:"mycon1",
            function:"sp_fun_get_company_info",
            company_code:user.company_code
        };
        var jsonStr3=  angular.toJson(params2);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data:jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var dataList = data.data;
                if(dataList!=null && dataList.length>0){
                    var dataBean = dataList[0];
                    $scope.company_name = dataBean.company_name;
                    $scope.telphone = dataBean.telphone;
                    $scope.address = dataBean.address;
                }

            }
        });



    }
    $scope.getCompanyData();



    $scope.toJieSuanDetail=function(){
        //totalXlf+totalMoney


        if (Number(jsdInfo.clcb) != totalCb ||
            Number(jsdInfo.clfzj) != Number($scope.totalMoney) ||
            Number(jsdInfo.wxfzj) != Number($scope.totalXlf) ||
            (Number($scope.totalMoney) + Number(jsdInfo.totalXlf)) != Number(jsdInfo.zje)) {

            $scope.judgeIsSendData();
        }else{
            $scope.uploadMoney();
        }



    }


    $scope.judgeIsSendData=function(){
        var jsd_id = locals.get("jsd_id");
        var params = {
            db: "mycon1",
            function: "sp_fun_update_repair_main_money",
            jsd_id: jsd_id,
            zje: Number($scope.totalXlf) + Number($scope.totalMoney) + '',
            wxfzj: $scope.totalXlf,
            clfzj: $scope.totalMoney,
            clcb: totalCb + ''

        }
        var jsonStr8 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr8
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $scope.uploadMoney();
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }

    $scope.uploadMoney=function(){
        var jsd_id = locals.get("jsd_id");
        var params = {
            db:"mycon1",
            function:"sp_fun_get_settle_accounts_info",
            jsd_id:jsd_id
        }
        var jsonStr8 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr8
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                var shouyinBean = new Object();
                var dataArray = data.data;
                var dataBean=dataArray[0];
                shouyinBean.ysje=$scope.totalXlf+$scope.totalMoney;
                shouyinBean.yhje=$scope.totalZk;
                shouyinBean.bit_compute=dataBean.bit_compute;
                shouyinBean.bit_use=dataBean.bit_amount;
                shouyinBean.ysje = dataBean.zje;
                locals.setObject("shouyinBean",shouyinBean);
                $state.go("WinBid");
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });

    }

}]);

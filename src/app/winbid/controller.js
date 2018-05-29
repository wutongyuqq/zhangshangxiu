app.controller('WinBidCtrl', ['$http', '$scope', '$state','locals', function ($http, $scope, $state,locals) {
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


}]);
app.controller('WinTotalCtrl', ['$http', '$scope', '$state','locals', function ($http, $scope, $state,locals) {
    var carInfo =locals.getObject("carInfo");
    var user =locals.getObject("user");
    $scope.factoryName = user.factoryName;
    var jsd_id = locals.get("jsd_id");
    var ticheTime = locals.get("ticheTime");
    $scope.carInfo = carInfo;
    $scope.jsd_id = jsd_id;
    $scope.ticheTime = ticheTime;

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

}]);

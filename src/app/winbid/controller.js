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

app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location","locals", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,locals) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
    $scope.toGdListPage=function(){

        var params={
            db:"mycon1",
            function:"sp_fun_upload_maintenance_project_detail",
            jsd_id:"A1802260001",
            xlxm:"普通洗车",
            xlf:"20.00",
            zk:"0.00",
            wxgz:"洗车",
            pgzje:"5.00",
            pgzgs:"1.00",
            xh:"0"
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
                var id=data.xh;
                $state.go("Winbding");
            }
        });






    }

    var firstIconArr = locals.getObject("firstIconArr");
    if(firstIconArr==null){
        $scope.getFirstPageData();
    }else{
        $scope.firstIconArr = firstIconArr;
    }




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
                $scope.firstIconArr = firstIconArr;
            }
        });
    }


}]);



app.controller('WinbdingCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location","locals","ionicToast","$ionicHistory", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,locals,ionicToast,$ionicHistory) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
    $scope.toPjkSelect=function(){
        $state.go("TenderSay");
    }
    $scope.goBack = function(){
        window.history.back();
    }
    var carInfo = locals.getObject("carInfo");
    var jsdId = carInfo.customer_id;
    if(carInfo==null||jsdId==null||jsdId==""){
        $state.go("login");
        return;
    }
    $scope.carInfo = carInfo;
    var params =
    {
        db:"mycon1",
        function:"sp_fun_down_repair_list_main",
        jsd_id:jsdId
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
    $scope.toProjectFactory = function(){
        var params =
        {
            db:"mycon1",
            function:"sp_fun_down_maintenance_project",
            previous_xh:"0"
        }
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                // locals.setObject("carInfo",upLoadInfo);
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });

    }


    $scope.repairDataList=[];
    $scope.getRepairListData = function(){


        var carInfo = locals.getObject("carInfo");


        var params = {
            db:"mycon1",
            function:"sp_fun_down_jsdmx_xlxm",
            jsd_id:"A1802260001"
        }
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                // locals.setObject("carInfo",upLoadInfo);
                $scope.repairDataList = data.data;
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });

    }

    $scope.getRepairListData();

}]);
app.controller('TenderSayCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);


app.controller('TendListCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);

app.controller('TendListDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);

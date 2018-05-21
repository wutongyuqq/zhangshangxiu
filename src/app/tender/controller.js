app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location","locals","ionicToast", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,locals,ionicToast) {
    var selt = this;
    $scope.firstIconArr = locals.getObject("firstIconArr");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
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
            }
        }).error(function(data){
            console.log(data);
        });
    }

    var firstIconArr = null;

    if(firstIconArr==null||firstIconArr.length==0){

        $scope.getFirstPageData();

    }else{
        $scope.firstIconArr = locals.getObject("firstIconArr");
    }



    $scope.toGdListPage=function(){
        var jsd_id = locals.get("jsd_id");
        var params = {

            db:"mycon1",
            function:"sp_fun_upload_maintenance_project_detail",
            jsd_id:jsd_id,
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
            if (state == 'ok') {
                $state.go("Winbding");
                // locals.setObject("carInfo",upLoadInfo);
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
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
        $scope.xlfTotal=0;
        $scope.numZk = 0;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                // locals.setObject("carInfdata.datao",upLoadInfo);
                var repairDataList = data.data;
                $scope.repairDataList = data.data;
                var numMoney = 0;
                var numZk= 0;
                for(var i=0;i<repairDataList.length;i++){
                    var item = repairDataList[i];
                    numMoney += Number(item.xlf);
                    numZk+=Number(item.zk);
                }
                $scope.xlfTotal = numMoney;
                $scope.numZk = numZk;

            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });

    }

    $scope.getRepairListData();


    $scope.deleteItem=function(index){
        var params = {
        db:"mycon1",
        function:"sp_fun_delete_maintenance_project_detail",
        jsd_id:"A1802260001",
        xh:"1"
        }
        var jsonStr = angular.toJson(params);
        $scope.xlfTotal=0;
        $scope.numZk = 0;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $scope.repairDataList.splice(index, 1);

            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });
    }
}]);

//{"db":"mycon1","function":"sp_fun_down_stock","comp_code":"A","pjbm":"","cd":"","ck":""} 
app.controller('TenderSayCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    var params={
        db:"mycon1",
        function:"sp_fun_down_stock",
        comp_code:"A",
        pjbm:"",
        cd:"",
        ck:""
    }
    $http({
        method: 'post',
        url: '/restful/pro',
        dataType: "json",
        data: angular.toJson(params)
    }).success(function (data, status, headers, config) {
        console.log("data   "+angular.toJson(data));
        
        var state = data.state;
        if (state == 'ok') {
            $scope.data=data.data;
            // locals.setObject("carInfo",upLoadInfo);
        }else {
            ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
        }
    }).error(function(data){
        ionicToast.show("服务异常");
    });



    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);


app.controller('TendListCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", "ionicToast",function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,ionicToast) {
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

    $scope.pgDataList=[];
    //获取派工列表
    $scope.getPgListData=function(){
        var params= {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_xlxm_assign",
            jsd_id: "A1802260001"
        }
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            console.log("data   "+angular.toJson(data));


            var state = data.state;
            if (state == 'ok') {
                $scope.pgDataList=data.data;
                // locals.setObject("carInfo",upLoadInfo);
            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });


    }

    $scope.getPgListData();
}]);

app.controller('TendListDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;

    var params={db:"mycon1",
    function:"sp_fun_get_fault_info",
    customer_id:"A2018N00008",
    days:"2018-04-17 00:00:00"}
    $http({
        method: 'post',
        url: '/restful/pro',
        dataType: "json",
        data: angular.toJson(params)
    }).success(function (data, status, headers, config) {
        console.log("data   "+angular.toJson(data));
        
        var state = data.state;
        if (state == 'ok') {
            $scope.data=data.data;
            // locals.setObject("carInfo",upLoadInfo);
        }else {
            ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
        }
    }).error(function(data){
        ionicToast.show("服务异常");
    });


    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);
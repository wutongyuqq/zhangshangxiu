app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location","locals","ionicToast", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,locals,ionicToast) {
    var selt = this;
    $scope.firstIconArr = locals.getObject("firstIconArr");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailImgPro = function (type,wxgz) {


        var kjProList = locals.getObject("kjProList");
        var chgProList = locals.getObject("chgProList");
        var sencondPageData=[];
        if(type==0){

            for(var i=0;i<kjProList.length;i++){
                var kjPro=kjProList[i];
                if(kjPro.wxgz==wxgz){
                    sencondPageData.push(kjPro);
                }
            }
            $scope.sencondPageData = sencondPageData;

        }else{

            for(var i=0;i<chgProList.length;i++){
                var kjPro=chgProList[i];
                if(kjPro.wxgz==wxgz){
                    sencondPageData.push(kjPro);
                }
            }
            $scope.sencondPageData = sencondPageData;

        }

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

    var firstIconArr = locals.getObject("firstIconArr");

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



app.controller('WinbdingCtrl', ['$http', '$scope', '$state',"locals","ionicToast" ,"$modal",function ($http, $scope, $state,locals,ionicToast,$modal) {
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
    var jsdId = locals.get("jsd_id");
    if(carInfo==null||jsdId==null||jsdId==""){
        $state.go("login");
        return;
    }
    $scope.carInfo = carInfo;

    $scope.toProjectFactory = function(){
       /* var params =
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
        });*/
        $state.go("TenderDtail");

    }


    $scope.repairDataList=[];
    $scope.getRepairListData = function(){
        var carInfo = locals.getObject("carInfo");

        var params = {
            db:"mycon1",
            function:"sp_fun_down_jsdmx_xlxm",
            jsd_id:jsdId
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


    $scope.deleteItem=function(index,data){


        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal2.html',
            controller: 'modalBCtrl',
            size: 'lg',
            resolve : {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (delData) {
            var params = {
                db:"mycon1",
                function:"sp_fun_delete_maintenance_project_detail",
                jsd_id:jsdId,
                xh:delData.xh
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
        }, function () {

        });
    }
    $scope.pjDataList=[];
    $scope.pjTotal=0;
    $scope.numPj=0;
    $scope.getPjData=function(){
        var params = {
            db:"mycon1",
            function:"sp_fun_down_jsdmx_pjclmx",
            jsd_id:jsdId
        }
        var jsonStr=angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                var pjDataList = data.data;
                $scope.pjDataList = pjDataList;


                var numMoney = 0;
                var numZk= 0;
                for(var i=0;i<pjDataList.length;i++){
                    var item = pjDataList[i];
                    numMoney += Number(item.ssj)*Number(item.sl);
                    numZk+=Number(item.sl);
                }
                $scope.pjTotal = numMoney;
                $scope.numPj = numZk;



            }else {
                ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
            }
        }).error(function(data){
            ionicToast.show("服务异常");
        });
    }

    $scope.getPjData();

    $scope.deletePjItem = function (index,data) {
        data.wxgz = data.pjmc;
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal2.html',
            controller: 'modalBCtrl',
            size: 'lg',
            resolve : {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (delData) {
            var params = {
                db:"mycon1",
                function:"sp_fun_delete_parts_project_detail",
                jsd_id:jsdId,
                xh:delData.xh
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
        }, function () {

        });
    }

    $scope.editProjectForXm= function(item){
        data = item;
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal3.html',
            controller: 'modalDCtrl',
            size: 'lg',
            resolve : {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (resData) {
            var params = {
                db:"mycon1",
                function:"sp_fun_upload_maintenance_project_library",
                xlxm:resData.xlxm,
                wxgz:resData.wxgz,
                xlf:resData.xlf
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


                }else {
                    ionicToast.show("错误："+data.msg?data.msg:"", 'middle',false, 1000);
                }
            }).error(function(data){
                ionicToast.show("服务异常");
            });
        }, function () {

        });

    }

    $scope.addTempProject=function(){
        var firstIconArr = locals.getObject("firstIconArr");
        data = firstIconArr;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modal5.html',
            controller: 'modalAddTempCtrl',
            size: 'lg',
            resolve : {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (tempData) {
            var jsd_id = locals.get("jsd_id");
            var params = {

                db:"mycon1",
                function:"sp_fun_upload_maintenance_project_detail",
                jsd_id:jsd_id,
                xlxm:tempData.mc,
                xlf:tempData.xmjg,
                zk:"0.00",
                wxgz:tempData.xmlb,
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
        }, function () {

        });



    }
}]);




//模态框对应的Controller
app.controller('modalAddTempCtrl', function($scope,$state, $modalInstance,locals,data) {
    $scope.firstIconArr= data;

    var tempData = new Object();
    tempData.mc = "";
    tempData.wxcb = "";
    tempData.xmjg = "";
    tempData.xmlb = "";
    $scope.tempData = tempData;
    //在这里处理要进行的操作
    $scope.ok = function(tempData) {
        $modalInstance.close(tempData);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});


//模态框对应的Controller
app.controller('modalBCtrl', function($scope,$state, $modalInstance,locals,data) {
    $scope.data= data;

    //在这里处理要进行的操作
    $scope.ok = function(data) {
        $modalInstance.close(data);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});



//模态框对应的Controller
app.controller('modalDCtrl', function($scope,$state, $modalInstance,locals,data) {
    var dataD = data;

        $scope.xlxm=dataD.xlxm;
        $scope.wxgz=dataD.wxgz;
        $scope.xlf=dataD.xlf;

    //在这里处理要进行的操作
    $scope.ok = function(xlxm,wxgz,xlf) {
        var resData = new Object();
         resData.xlxm=xlxm;
         resData.wxgz=wxgz;
         resData.xlf=xlf;
        $modalInstance.close(resData);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
});

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


app.controller('TendListCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", "ionicToast","locals",function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location,ionicToast,locals) {

    var jsdId=locals.get("jsd_id");
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
            jsd_id: jsdId
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

app.controller('TendListDetailCtrl', ['$http','$scope','$state',"locals", function ($http, $scope, $state,locals) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    var carInfo=locals.getObject("carInfo");
    var params={
        db:"mycon1",
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
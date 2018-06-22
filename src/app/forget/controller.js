app.controller('ForgetCtrl', ['$http', '$scope', '$state', "locals", "ionicToast",  function ($http, $scope, $state, locals, ionicToast) {
    $scope.showMore = 0;
    var pre_row_number = "0";
    var factoryDataArr = new Array();
    var queryStatuStr = "待领工";
    $scope.showMoreView = function (showMore,queryState) {
        queryStatuStr = queryState;
        $scope.showMore = showMore;
        pre_row_number = "0";
        factoryDataArr = new Array();
        $scope.getListData();

    }

    $scope.getListData = function () {
        var user = locals.getObject("user");
        if(pre_row_number=="end"){

            $scope.factoryDataArr =factoryDataArr;
            return;
        }
        var params ={
            db:"mycon1",
            function:"sp_fun_down_repair_project_state",
            company_code:user.company_code,
            states:queryStatuStr,
            pre_row_number:pre_row_number
        }
        var jsonStr3 = angular.toJson(params);
        var gdData = new Object();
        $scope.gdData = gdData;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            pre_row_number = data.pre_row_number;
            if (state == 'ok') {
                factoryDataArr = factoryDataArr.concat(data.data);
                $scope.getListData();
            }else{
                $scope.factoryDataArr = new Array();
                return;
            }

        });
    }
    $scope.getListData();


    $scope.toLinggongPage=function(item){
        locals.set("jsd_id",item.jsd_id);
        $state.go("LinggongPage");
    }





    $scope.getFirstPageData = function () {

        var params = {
            db: "mycon1",
            function: "sp_fun_down_maintenance_category"
        }

        var jsonStr6 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr6
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == "ok") {
                var firstIconArr = data.data;
                $scope.firstIconArr = firstIconArr;
                locals.setObject("firstIconArr", firstIconArr);
            }
        }).error(function (data) {
            console.log(data);
        });
    }

    var firstIconArr = locals.getObject("firstIconArr");

    if (firstIconArr == null || firstIconArr.length == 0) {

        $scope.getFirstPageData();

    } else {
        $scope.firstIconArr = firstIconArr;
    }
    $scope.isShowSelect=false;
    $scope.showSelectDiv=function(isShowSelect){
        $scope.isShowSelect = !isShowSelect;
    }

    $scope.selectItem=function(item){
        $scope.wxgz = item.wxgz;
        $scope.isShowSelect=false;
    }
    $scope.content="";
    $scope.wxgz="";
    $scope.searchData=function(){
        var content = $scope.content;
        var wxgz = $scope.wxgz;
        if(wxgz=='选择工种'){
            wxgz='';
        }
        if(factoryDataArr==null||factoryDataArr.length==0){
            return;
        }
        if(content==null){
            $scope.factoryDataArr = factoryDataArr;
            return;
        }
        var newFactoryArr = new Array();
        for(var i=0;i<factoryDataArr.length;i++){
            var factoryData = factoryDataArr[i];

            if(((factoryData.jsd_id).indexOf(content)!=-1
                ||(factoryData.cp).indexOf(content)!=-1
                ||(factoryData.cx).indexOf(content)!=-1
                ||(factoryData.cjhm).indexOf(content)!=-1
                ||(factoryData.wxgz).indexOf(content)!=-1
                ||(factoryData.xlg).indexOf(content)!=-1
                ||(factoryData.states).indexOf(content)!=-1
                ||(factoryData.jc_date).indexOf(content)!=-1
                ||(factoryData.assign).indexOf(content)!=-1)&&((factoryData.wxgz).indexOf(wxgz)!=-1)){
                newFactoryArr.push(factoryData);
            }
        }
        $scope.factoryDataArr = newFactoryArr;
    }


}]);


app.controller('LinggongCtrl', ['$http', '$scope', '$state', "locals", "ionicToast",  function ($http, $scope, $state, locals, ionicToast) {

    var jsd_id=locals.get("jsd_id");
    $scope.goBackPage = function(){
        window.history.back();
    }

    $scope.getLinggongData = function () {
        var user = locals.getObject("user");
        var params ={
            db:"mycon1",
            function:"sp_fun_down_repair_project_schedule",
            jsd_id:jsd_id
        }
        var jsonStr3 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var dataArr = data.data;
                $scope.dataArr = dataArr;
            }
        });
    }
    $scope.getLinggongData();

}]);
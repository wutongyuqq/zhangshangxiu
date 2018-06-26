app.controller('ForgetCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    $scope.showMore = 0;
    var pre_row_number = "0";
    var factoryDataArr = new Array();
    var queryStatuStr = "待领工";
    $scope.showMoreView = function (showMore, queryState) {
        queryStatuStr = queryState;
        $scope.showMore = showMore;
        pre_row_number = "0";
        factoryDataArr = new Array();
        $scope.getListData();

    }

    $scope.getListData = function () {
        var user = locals.getObject("user");
        if (pre_row_number == "end") {

            $scope.factoryDataArr = factoryDataArr;
            return;
        }
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_state",
            company_code: user.company_code,
            states: queryStatuStr,
            pre_row_number: pre_row_number
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
                if (pre_row_number == "end") {
                    $scope.factoryDataArr = factoryDataArr;
                    return;
                }
                $scope.getListData();
            } else {
                $scope.factoryDataArr = new Array();
                return;
            }

        });
    }
    $scope.getListData();


    $scope.toLinggongPage = function (item) {
        locals.set("jsd_id", item.jsd_id);
        item.cardName = item.cp;
        locals.setObject("carInfo", item);

        var states = item.states;
        if (states == '待领工') {
            $state.go("TiaozhengPage");
        } else if (states == '修理中') {
            $state.go("HuanRen");

        } else if (states == '待质检') {
            $state.go("JianyanPage");

        } else if (states == '已完工') {
            $state.go("WanGong");

        }
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
    $scope.isShowSelect = false;
    $scope.showSelectDiv = function (isShowSelect) {
        $scope.isShowSelect = !isShowSelect;
    }

    $scope.selectItem = function (item) {
        $scope.wxgz = item.wxgz;
        $scope.isShowSelect = false;
    }
    $scope.content = "";
    $scope.wxgz = "";
    $scope.searchData = function () {
        var content = $scope.content;
        var wxgz = $scope.wxgz;
        if (wxgz == '选择工种') {
            wxgz = '';
        }
        if (factoryDataArr == null || factoryDataArr.length == 0) {
            return;
        }
        if (content == null) {
            $scope.factoryDataArr = factoryDataArr;
            return;
        }
        var newFactoryArr = new Array();
        for (var i = 0; i < factoryDataArr.length; i++) {
            var factoryData = factoryDataArr[i];

            if (((factoryData.jsd_id).indexOf(content) != -1
                    || (factoryData.cp).indexOf(content) != -1
                    || (factoryData.cx).indexOf(content) != -1
                    || (factoryData.cjhm).indexOf(content) != -1
                    || (factoryData.wxgz).indexOf(content) != -1
                    || (factoryData.xlg).indexOf(content) != -1
                    || (factoryData.states).indexOf(content) != -1
                    || (factoryData.jc_date).indexOf(content) != -1
                    || (factoryData.assign).indexOf(content) != -1) && ((factoryData.wxgz).indexOf(wxgz) != -1)) {
                newFactoryArr.push(factoryData);
            }
        }
        $scope.factoryDataArr = newFactoryArr;
    }


    $scope.bubbleSort = function (arr, isUp) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - i - 1; j++) {

                var jcDateJ = arr[j].jc_date ? arr[j].jc_date : '0';
                var jcDateK = arr[j + 1].jc_date ? arr[j + 1].jc_date : '0';
                var newJcDateJ = jcDateJ.replace(/:/g, '').replace(/-/g, '').replace(' ', '');
                var newJcDateK = jcDateK.replace(/:/g, '').replace(/-/g, '').replace(' ', '');
                if (isUp) {

                    if (newJcDateJ > newJcDateK) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                } else {
                    if (newJcDateJ < newJcDateK) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }

            }
        }
        return arr;
    }
    $scope.showUp=true;
    $scope.sortByJcTime=function(showUp){
        $scope.showUp = !showUp;
       var sortFactoryDataArr = $scope.bubbleSort(factoryDataArr,$scope.showUp);
        $scope.factoryDataArr = sortFactoryDataArr;
    }



    $scope.bubbleYwgSort = function (arr, isUp) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - i - 1; j++) {

                var jcDateJ = arr[j].ywg_date ? arr[j].ywg_date : '0';
                var jcDateK = arr[j + 1].ywg_date ? arr[j + 1].ywg_date : '0';
                var newJcDateJ = jcDateJ.replace(/:/g, '').replace(/-/g, '').replace(' ', '');
                var newJcDateK = jcDateK.replace(/:/g, '').replace(/-/g, '').replace(' ', '');
                if (isUp) {

                    if (newJcDateJ > newJcDateK) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                } else {
                    if (newJcDateJ < newJcDateK) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }

            }
        }
        return arr;
    }

    $scope.sortByYwgTime=function(showYwgUp){
        $scope.showYwgUp = !showYwgUp;
       var sortFactoryDataArr = $scope.bubbleYwgSort(factoryDataArr,$scope.showYwgUp);
        $scope.factoryDataArr = sortFactoryDataArr;
    }

    var user = locals.getObject("user");
    $scope.showMySelf=function(isShowMyWork){
        $scope.isShowMyWork = !isShowMyWork;

        if($scope.isShowMyWork) {
            var newFactoryArr = new Array();
            for (var i = 0; i < factoryDataArr.length; i++) {
                var factoryData = factoryDataArr[i];

                if (factoryData.assign==user.chinese_name) {
                    newFactoryArr.push(factoryData);
                }
            }
            $scope.factoryDataArr = newFactoryArr;
        }else{
            $scope.factoryDataArr = factoryDataArr;
        }

    }
}]);


app.controller('LinggongCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {

    var jsd_id = locals.get("jsd_id");
    $scope.goBackPage = function () {
        window.history.back();
    }

    $scope.getLinggongData = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_schedule",
            jsd_id: jsd_id
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


app.controller('TiaozhengCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    var factoryItem = locals.getObject("carInfo");
    $scope.factoryItem = factoryItem;

    var jsd_id = locals.get("jsd_id");
    $scope.goBackPage = function () {
        window.history.back();
    }
    var dataArr = new Array();

    $scope.getLinggongData = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_schedule",
            jsd_id: jsd_id
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
               dataArr = data.data;
                for(var i=0;i<dataArr.length;i++){
                    dataArr[i].choose=true;
                }
                $scope.dataArr = dataArr;
            }
        });
    }
    $scope.getLinggongData();

    $scope.selectAll=true;
    $scope.chooseAll= function (selectAll) {
        var newDataArr = new Array();
        var tmpDataArr = $scope.dataArr;
        for(var i=0;i<$scope.dataArr.length;i++){
            $scope.selectAll = !selectAll;
            var dataBean = tmpDataArr[i];
            if(selectAll==true){
                dataBean.choose=true;
            }else {
                dataBean.choose=false;
            }
            tmpDataArr.push(dataBean);
        }
        $scope.dataArr = tmpDataArr;
    };



    $scope.lingGong = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_update_jsdmx_xlxm_xlg",
            jsd_id: jsd_id,
            xh: factoryItem.xh,
            assign: user.chinese_name
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
                ionicToast.show("领工成功", 'middle', false, 2000);
                $scope.getLinggongData();
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        });
    }
}]);


//检验
app.controller('JianyanCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {

    var factoryItem = locals.getObject("carInfo");
    $scope.factoryItem = factoryItem;

    var jsd_id = locals.get("jsd_id");
    $scope.goBackPage = function () {
        window.history.back();
    }

    $scope.getLinggongData = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_schedule",
            jsd_id: jsd_id
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

    $scope.fanGong = function () {

        var params = {
            db: "mycon1",
            function: "sp_fun_update_repair_list_state",
            jsd_id: jsd_id,
            states: "",
            xm_state: "返工"
        }
        var jsonStr3 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr3
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $scope.getLinggongData();
                ionicToast.show("操作成功", 'middle', false, 2000);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });


    }

}]);


//完工
app.controller('WanGongCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    var factoryItem = locals.getObject("carInfo");
    $scope.factoryItem = factoryItem;


    var jsd_id = locals.get("jsd_id");
    $scope.goBackPage = function () {
        window.history.back();
    }

    $scope.getLinggongData = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_schedule",
            jsd_id: jsd_id
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


//换人
app.controller('HuanRenCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {

    var factoryItem = locals.getObject("carInfo");
    $scope.factoryItem = factoryItem;

    var jsd_id = locals.get("jsd_id");
    var user = locals.get("user");
    $scope.goBackPage = function () {
        window.history.back();
    }


    $scope.getLinggongData = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_project_schedule",
            jsd_id: jsd_id
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

    /*$scope.finishWork = function () {
        var user = locals.getObject("user");
        var params = {
            db: "mycon1",
            function: "sp_fun_update_repair_list_state",
            jsd_id: jsd_id,
            states: "审核未结算",
            xm_state: "已完工"
        }
        var jsonStr7 = angular.toJson(params);
        $scope.xlfTotal = 0;
        $scope.numZk = 0;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr7
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $scope.getLinggongData();
                ionicToast.show("操作成功", 'middle', false, 2000);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });
    }*/
    function getRepairData() {
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repairman",
            company_code: user.company_code
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
                locals.setObject("repairPersonList", data.data);
            } else {
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });
    }

    var repairPersonList = locals.getObject("repairPersonList");

    if (repairPersonList == null || repairPersonList.length == null || repairPersonList.length == 0) {
        getRepairData();
    }

    $scope.jiaRen = function () {
        var repairPersonList = locals.setObject("repairPersonList");

    }

}]);
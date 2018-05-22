app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state', 'userTemp', '$anchorScroll', "$location", "locals", "ionicToast", function ($http, $scope, utils, $stateParams, $state, userTemp, $anchorScroll, $location, locals, ionicToast) {
    var selt = this;
    var showType = 0;
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    $scope.firstIconArr = locals.getObject("firstIconArr");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
        showType = showMore;
    }
    $scope.showMoreChange = function () {
        $scope.showMore = showType;
    }
    $scope.showDetailImgPro = function (type, wxgz) {


        var kjProList = locals.getObject("kjProList");
        var chgProList = locals.getObject("chgProList");
        var sencondPageData = [];
        if (type == 0) {

            for (var i = 0; i < kjProList.length; i++) {
                var kjPro = kjProList[i];
                if (kjPro.wxgz == wxgz) {
                    sencondPageData.push(kjPro);
                }
            }
            $scope.sencondPageData = sencondPageData;

        } else {

            for (var i = 0; i < chgProList.length; i++) {
                var kjPro = chgProList[i];
                if (kjPro.wxgz == wxgz) {
                    sencondPageData.push(kjPro);
                }
            }
            $scope.sencondPageData = sencondPageData;

        }
        $scope.showMore = 2;
    }

    $scope.getFirstPageData = function () {

        var params = {
            db: "mycon1",
            function: "sp_fun_down_maintenance_category"
        }

        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
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
        $scope.firstIconArr = locals.getObject("firstIconArr");
    }
    $scope.toGdListPage = function () {
        var jsd_id = locals.get("jsd_id");
        var params = {

            db: "mycon1",
            function: "sp_fun_upload_maintenance_project_detail",
            jsd_id: jsd_id,
            xlxm: "普通洗车",
            xlf: "20.00",
            zk: "0.00",
            wxgz: "洗车",
            pgzje: "5.00",
            pgzgs: "1.00",
            xh: "0"
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
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });

    }
}]);


app.controller('WinbdingCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", "$modal", function ($http, $scope, $state, locals, ionicToast, $modal) {
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
    $scope.toPjkSelect = function () {
        $state.go("TenderSay");
    }
    $scope.goBack = function () {
        window.history.back();
    }
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    var jsdId = locals.get("jsd_id");
    if (carInfo == null || jsdId == null || jsdId == "") {
        $state.go("login");
        return;
    }


    $scope.toProjectFactory = function () {
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


    $scope.repairDataList = [];
    $scope.getRepairListData = function () {
        var carInfo = locals.getObject("carInfo");

        var params = {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_xlxm",
            jsd_id: jsdId
        }
        var jsonStr = angular.toJson(params);
        $scope.xlfTotal = 0;
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
                var numZk = 0;
                for (var i = 0; i < repairDataList.length; i++) {
                    var item = repairDataList[i];
                    numMoney += Number(item.xlf);
                    numZk += Number(item.zk);
                }
                $scope.xlfTotal = numMoney;
                $scope.numZk = numZk;

            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });

    }

    $scope.getRepairListData();


    $scope.deleteItem = function (index, data) {


        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal2.html',
            controller: 'modalBCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (delData) {
            var params = {
                db: "mycon1",
                function: "sp_fun_delete_maintenance_project_detail",
                jsd_id: jsdId,
                xh: delData.xh
            }
            var jsonStr = angular.toJson(params);
            $scope.xlfTotal = 0;
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

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });
        }, function () {

        });
    }
    $scope.pjDataList = [];
    $scope.pjTotal = 0;
    $scope.numPj = 0;
    $scope.getPjData = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_pjclmx",
            jsd_id: jsdId
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
                var pjDataList = data.data;
                $scope.pjDataList = pjDataList;


                var numMoney = 0;
                var numZk = 0;
                for (var i = 0; i < pjDataList.length; i++) {
                    var item = pjDataList[i];
                    numMoney += Number(item.ssj) * Number(item.sl);
                    numZk += Number(item.sl);
                }
                $scope.pjTotal = numMoney;
                $scope.numPj = numZk;


            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }

    $scope.getPjData();

    $scope.deletePjItem = function (index, data) {
        data.wxgz = data.pjmc;
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal2.html',
            controller: 'modalBCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (delData) {
            var params = {
                db: "mycon1",
                function: "sp_fun_delete_parts_project_detail",
                jsd_id: jsdId,
                xh: delData.xh
            }
            var jsonStr = angular.toJson(params);
            $scope.xlfTotal = 0;
            $scope.numZk = 0;
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    $scope.pjDataList.splice(index, 1);

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });
        }, function () {

        });
    }

    $scope.editProjectForXm = function (item) {
        data = item;
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal3.html',
            controller: 'modalDCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (resData) {
            var params = {
                db: "mycon1",
                function: "sp_fun_upload_maintenance_project_library",
                xlxm: resData.xlxm,
                wxgz: resData.wxgz,
                xlf: resData.xlf
            }
            var jsonStr = angular.toJson(params);
            $scope.xlfTotal = 0;
            $scope.numZk = 0;
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {


                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });
        }, function () {

        });

    }

    $scope.addTempProject = function () {
        var firstIconArr = locals.getObject("firstIconArr");
        data = firstIconArr;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modal5.html',
            controller: 'modalAddTempCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (tempData) {
            var jsd_id = locals.get("jsd_id");
            var params = {

                db: "mycon1",
                function: "sp_fun_upload_maintenance_project_detail",
                jsd_id: jsd_id,
                xlxm: tempData.mc,
                xlf: tempData.xmjg,
                zk: "0.00",
                wxgz: tempData.xmlb,
                pgzje: "5.00",
                pgzgs: "1.00",
                xh: "0"
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
                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常");
            });
        }, function () {

        });


    }
}]);


//模态框对应的Controller
app.controller('modalAddTempCtrl', function ($scope, $state, $modalInstance, locals, data) {
    $scope.firstIconArr = data;


    var tempData = new Object();
    tempData.mc = "";
    tempData.wxcb = "";
    tempData.xmjg = "";
    tempData.xmlb = "";
    $scope.tempData = tempData;
    //在这里处理要进行的操作
    $scope.ok = function (tempData) {
        $modalInstance.close(tempData);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});


//模态框对应的Controller
app.controller('modalBCtrl', function ($scope, $state, $modalInstance, locals, data) {
    $scope.data = data;

    //在这里处理要进行的操作
    $scope.ok = function (data) {
        $modalInstance.close(data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});


//模态框对应的Controller
app.controller('modalDCtrl', function ($scope, $state, $modalInstance, locals, data) {
    var dataD = data;

    $scope.xlxm = dataD.xlxm;
    $scope.wxgz = dataD.wxgz;
    $scope.xlf = dataD.xlf;

    //在这里处理要进行的操作
    $scope.ok = function (xlxm, wxgz, xlf) {
        var resData = new Object();
        resData.xlxm = xlxm;
        resData.wxgz = wxgz;
        resData.xlf = xlf;
        $modalInstance.close(resData);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});

//{"db":"mycon1","function":"sp_fun_down_stock","comp_code":"A","pjbm":"","cd":"","ck":""} 
app.controller('TenderSayCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state', 'locals', '$anchorScroll', "$location", function ($http, $scope, utils, $stateParams, $state, locals, $anchorScroll, $location) {
    var selt = this;
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    var user = locals.getObject("user");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    var params = {
        db: "mycon1",
        function: "sp_fun_down_stock",
        comp_code: user.company_code,
        pjbm: "",
        cd: "",
        ck: ""
    }
    $http({
        method: 'post',
        url: '/restful/pro',
        dataType: "json",
        data: angular.toJson(params)
    }).success(function (data, status, headers, config) {
        console.log("data   " + angular.toJson(data));

        var state = data.state;
        if (state == 'ok') {
            $scope.dataList = data.data;
            // locals.setObject("carInfo",upLoadInfo);
        } else {
            ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
        }
    }).error(function (data) {
        ionicToast.show("服务异常");
    });
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {

        $scope.showMore = 2;
    }

    $scope.checkAll = false;
    var checkedNum = 0;
    $scope.checkPjkAll = function () {
        angular.forEach($scope.dataList, function (value) {
            if ($scope.checkAll) {
                value.checked = true;
                checkedNum = $scope.dataList.length;
            } else {
                value.checked = false;
                checkedNum = 0;
            }
        })
    }
    $scope.checkPjkItem = function (index) {

        var i = 0;
        angular.forEach($scope.dataList, function (value) {
            if (i == index && value.checked) {
                checkedNum++
            } else if (i == index && !value.checked) {
                checkedNum--
            }
            i++;
        })
        //单选了所有商品，自动勾选全选。否则不勾选
        if ($scope.dataList.length === checkedNum) {
            $scope.checkAll = true;
        } else {
            $scope.checkAll = false;
        }
    }
    var postPjNum = 0;
    $scope.makeSurePj = function () {
        postPjNum = 0;
        angular.forEach($scope.dataList, function (value) {
            if (value.checked) {
                $scope.addToGdServer(value);
            }

        })
    }

    $scope.addToGdServer = function (item) {


        var jsd_id = locals.get("jsd_id");
        var params =
        {
            db: "mycon1",
            function: "sp_fun_upload_parts_project_detail",
            jsd_id: jsd_id,
            pjbm: item.pjbm,
            pjmc: item.pjmc,
            ck: item.ck,
            cd: item.cd,
            cx: item.cx,
            dw: item.dw,
            property: item.property,
            zt: item.zt,
            ssj: item.ssj,
            cb: item.cb,
            sl: item.sl,
            xh: item.xh,
            comp_code: user.company_code
        }

        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params)
        }).success(function (data, status, headers, config) {
            postPjNum++;
            if (postPjNum == checkedNum) {
                $state.go("Winbding");
            }
            console.log(data);
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }


}]);


app.controller('TendListCtrl', ['$http', '$scope', '$state', "ionicToast", "locals", "$modal", function ($http, $scope, $state, ionicToast, locals, $modal) {
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    var jsdId = locals.get("jsd_id");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }

    $scope.pgDataList = [];
    //获取派工列表
    $scope.getPgListData = function () {
        var params = {
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
            console.log("data   " + angular.toJson(data));


            var state = data.state;
            if (state == 'ok') {
                $scope.pgDataList = data.data;
                // locals.setObject("carInfo",upLoadInfo);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });


    }

    $scope.getPgListData();


    $scope.pgPerson = function (item) {
        var repairPersonList = locals.getObject("repairPersonList");
        data = repairPersonList;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modal7.html',
            controller: 'modalPgCtrl',
            size: 'lg',
            resolve: {
                data: function () {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        });

        modalInstance.result.then(function (choosePersonStr) {
            if (choosePersonStr != null && choosePersonStr[choosePersonStr.length - 1] == ",") {
                choosePersonStr.substring(0, choosePersonStr.length - 1);
            }
            var pgDataList = $scope.pgDataList;
            var jsd_id = locals.get("jsd_id");
            if (pgDataList != null && pgDataList.length > 0) {
                for (var i = 0; i < pgDataList.length; i++) {
                    var pgData = pgDataList[i];
                    if (pgData.checked) {
                        $scope.toPGDataToServer(jsd_id, choosePersonStr, pgData.xh)
                    }
                }
            }
        }, function () {

        });
    }

    $scope.toPGDataToServer = function (jsd_id, choosePersonStr, xh) {

        var params = {
            db: "mycon1",
            function: "sp_fun_update_jsdmx_xlxm_assign",
            jsd_id: jsd_id,
            xh: xh,
            assign: choosePersonStr
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
            } else {

            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }

}
])
;


//模态框对应的Controller
app.controller('modalPgCtrl', function ($scope, $state, $modalInstance, locals, data) {
    $scope.repairPersonList = data;
    $scope.clickIndex = 0;

    var repairPersonList = data;
    var firstPerson = repairPersonList[0];
    var personArr = [];
    for (var i = 0; i < repairPersonList.length; i++) {
        var person = repairPersonList[i];
        if (person.xlz == firstPerson.xlz) {
            personArr.push(person);
        }
    }
    $scope.personArr = personArr;

    $scope.chooseXlz = function (itemData, index) {
        $scope.clickIndex = index;
        personArr = [];
        for (var i = 0; i < repairPersonList.length; i++) {
            var person = repairPersonList[i];
            if (person.xlz == itemData.xlz) {
                personArr.push(person);
            }
        }
        $scope.personArr = personArr;
    };
    //在这里处理要进行的操作
    $scope.ok = function () {
        var choosePersonStr = "";
        if (personArr != null && personArr.length != null) {
            for (var i = 0; i < personArr.length; i++) {
                var person = personArr[i];
                if (person.checked) {
                    choosePersonStr += person.xlg + ",";
                }

            }
        }
        $modalInstance.close(choosePersonStr);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
});


app.controller('TendListDetailCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", function ($http, $scope, $state, locals, ionicToast) {
    var selt = this;
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.getDateTime = function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString();
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
        var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        return dateTime;

    }


    $scope.getSDateTime = function () {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString();
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
        var dateTime = year + "-" + month + "-01 00:00:00";
        return dateTime;

    }

    var selectData = new Object();
    selectData.startData = $scope.getSDateTime().substr(0, 10);
    selectData.endData = $scope.getDateTime().substr(0, 10);
    $scope.selectData = selectData;


    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }

    $scope.getWxHistory = function () {
        selectData = $scope.selectData;

        var startData = selectData.startData ? (selectData.startData + " 00:00:00") : $scope.getSDateTime();
        var endData = selectData.endData ? (selectData.endData + " 23:59:59") : $scope.getDateTime();
        var carInfo = locals.getObject("carInfo");
        var params =
        {
            db: "mycon1",
            function: "sp_fun_down_repair_history",
            customer_id: carInfo.customer_id,
            dates: startData,
            datee: endData
        }
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            console.log("data   " + angular.toJson(data));
            var state = data.state;
            if (state == 'ok') {
                $scope.data = data.data;

            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 1000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常");
        });
    }
    $scope.getWxHistory();


}]);
app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state', 'userTemp', '$anchorScroll', "$location", "locals", "ionicToast", "$ionicNavBarDelegate", function ($http, $scope, utils, $stateParams, $state, userTemp, $anchorScroll, $location, locals, ionicToast, $ionicNavBarDelegate) {
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
    $scope.goBackHistory = function () {
        history.back();
    };
    $scope.toSelectPage = function () {
        $state.go("Register");
    }

    $scope.checked = 0;
    var chooseItem = null;
    $scope.chooseProject = function (index, item) {
        $scope.checked = index;
        chooseItem = item;
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
        $scope.firstIconArr = locals.getObject("firstIconArr");
    }
    $scope.toGdListPage = function () {
        var jsd_id = locals.get("jsd_id");
        if (chooseItem == null) {
            var sencondPageData = $scope.sencondPageData;
            if (sencondPageData == null) {
                ionicToast.show("请选择项目", 'middle', false, 2000);
                return;
            }
            chooseItem = sencondPageData[0];
        }
        var params = {

            db: "mycon1",
            function: "sp_fun_upload_maintenance_project_detail",
            jsd_id: jsd_id,
            xlxm: chooseItem.mc,
            xlf: chooseItem.xlf,
            zk: "0.00",
            wxgz: chooseItem.wxgz,
            pgzje: chooseItem.pgzje,
            pgzgs: chooseItem.pgzgs,
            xh: "0"
        }
        var jsonStr1 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr1
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                $state.go("Winbding");
                // locals.setObject("carInfo",upLoadInfo);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });

    }
}]);


app.controller('WinbdingCtrl', ['$http', '$scope', '$state', "locals", "ionicToast", "$modal", function ($http, $scope, $state, locals, ionicToast, $modal) {
    var selt = this;
    $scope.goBackPage = function () {
        history.back();
    }
    var user = locals.getObject("user");
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showFloatImg = false;
    var carInfo = locals.getObject("carInfo");
    $scope.carInfo = carInfo;
    var jsdId = locals.get("jsd_id");

    $scope.ticheTime = (locals.get("ticheTime") == null || locals.get("ticheTime") == "undefined") ? "" : locals.get("ticheTime");
    $scope.gonglishu = (locals.get("gonglishu") == null || locals.get("gonglishu") == "undefined") ? "" : locals.get("gonglishu"); //locals.get("gonglishu");
    $scope.guzhangDes = (locals.get("guzhangDes") == null || locals.get("guzhangDes") == "undefined") ? "" : locals.get("guzhangDes");//locals.get("guzhangDes");
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    };

    $scope.djztUnable = 0;
    $scope.djzt = "派工";
    var jsdInfo = new Object();
    $scope.getJsdStatu = function () {
        var jsd_id = locals.get("jsd_id");
        $scope.jsd_id = jsd_id;
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_list_main",
            jsd_id: jsd_id
        };
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
            if (state == 'ok') {
                var gdDataList = data.data;
                if (gdDataList != null && gdDataList.length > 0) {
                    carInfo = $scope.carInfo;
                    gdData = gdDataList[0];
                    jsdInfo = gdData;
                    $scope.memo = jsdInfo.memo;
                    if (gdData.djzt == '已派工' || gdData.djzt == '修理中') {
                        $scope.djzt = '全部完工';
                    } else if (gdData.djzt == '处理中') {
                        $scope.djzt = '派工';
                    } else if (gdData.djzt == '审核已结算') {
                        $scope.showFloatImg = true;
                        $scope.djzt = '取消完工';
                        $scope.djztUnable = 1;
                    }
                }

            }
        });

    }
    $scope.getJsdStatu();
    $scope.showInputGls = false;
    $scope.showKell = function (showInputGls) {
        $scope.showInputGls = !showInputGls;
        locals.set("gonglishu", $scope.gonglishu);
        var carInfo = locals.getObject("carInfo");
        carInfo.gls = $scope.showInputGls;
        locals.setObject("carInfo", carInfo);
        $scope.updateCarForOne('jclc', showInputGls);


    }


    $scope.updateCarForOne = function (columnName, valueData) {
        var jsd_id = locals.get("jsd_id");
        $scope.jsd_id = jsd_id;
        var params = {
            db: "mycon1",
            function: "sp_fun_upload_repair_list_main_other",
            column_name: columnName,
            data: valueData,
            jsd_id: jsd_id
        };
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
            if (state == 'ok') {


            }
        });
    }
    $scope.showTicheTime = false;
    $scope.showTiche = function (showTicheTime) {
        $scope.showTicheTime = !showTicheTime;
        locals.set("ticheTime", $scope.ticheTime);
        var carInfo = locals.getObject("carInfo");
        carInfo.ticheTime = $scope.ticheTime;
        locals.setObject("carInfo", carInfo);
        // $scope.uploadCarBean();
        $scope.updateCarForOne('ywg_date', ticheTime);
    }

    $scope.showBeizhu = false;
    $scope.memo = "";
    $scope.showBeizhuT = function (showBeizhu) {
        $scope.showBeizhu = !showBeizhu;
        if (showBeizhu) {
            $scope.updateCarForOne("memo", $scope.memo ? $scope.memo : "");
        }
    }
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


    $scope.showGuzhang = true;
    $scope.showGuzhangT = function (showGuzhang) {
        $scope.showGuzhang = !showGuzhang;
        var carInfo2 = $scope.carInfo;

        var params = {
            db: "mycon1",
            function: "sp_fun_update_fault_info",
            customer_id: carInfo.customer_id,
            car_fault: $scope.guzhangDes,
            days: $scope.getDateTime()
        };
        var jsonStr5 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr5
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'ok') {
                carInfo2.gzms = $scope.guzhangDes;
                locals.set("guzhangDes", $scope.guzhangDes);
                locals.setObject("carInfo", carInfo2);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });
    }


    $scope.toPjkSelect = function () {
        $state.go("TenderSay");
    }
    $scope.goBack = function () {
        window.history.back();
    }

    if (carInfo == null || jsdId == null || jsdId == "") {
        $state.go("home");
        return;
    }
    $scope.toProjectFactory = function () {
        $state.go("TenderDtail");
    }
    $scope.repairDataList = new Array();
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


                var repairDataListNew = locals.getObject("repairDataList");
                if (repairDataListNew != null && repairDataListNew.length > 0) {
                    for (var j = 0; j < repairDataList.length; j++) {
                        var oldRepairData = repairDataList[j];
                        if (repairDataList != null && repairDataList.length != 0) {
                            for (var i = 0; i < repairDataListNew.length; i++) {
                                var repairNewData = repairDataListNew[i];
                                if (repairNewData.xh == oldRepairData.xh) {
                                    repairDataList.splice(j, 1, repairNewData);
                                }
                            }
                        }

                    }

                }
                $scope.repairDataList = repairDataList;
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
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
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
            var jsonStr3 = angular.toJson(params);
            $scope.xlfTotal = 0;
            $scope.numZk = 0;
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr3
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    $scope.repairDataList.splice(index, 1);

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }, function () {

        });
    }

    //获取配件列表
    $scope.pjDataList = [];
    $scope.pjTotal = 0;
    $scope.numPj = 0;
    $scope.getPjData = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_pjclmx",
            jsd_id: jsdId
        }
        var jsonStr4 = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr4
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
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
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
            var jsonStr5 = angular.toJson(params);
            $scope.xlfTotal = 0;
            $scope.numZk = 0;
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr5
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    $scope.pjDataList.splice(index, 1);

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }, function () {

        });
    }

    $scope.editProjectForXm = function (index, item) {
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

            var jsd_id = locals.get("jsd_id");
            var params = {

                db: "mycon1",
                function: "sp_fun_upload_maintenance_project_detail",
                jsd_id: jsd_id,
                zk: item.xlf - resData.xlf,
                xlxm: resData.xlxm,
                wxgz: resData.wxgz,
                xlf: resData.xlf,
                pgzje: "",
                pgzgs: "",
                xh: item.xh
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
                    $state.go("Winbding");
                    // locals.setObject("carInfo",upLoadInfo);
                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });

            if (resData.isNewPrice) {
                var params = {
                    db: "mycon1",
                    function: "sp_fun_upload_maintenance_project_library",
                    xlxm: resData.xlxm,
                    wxgz: resData.wxgz,
                    xlf: resData.xlf
                }
                var jsonStr6 = angular.toJson(params);
                $scope.xlfTotal = 0;
                $scope.numZk = 0;
                $http({
                    method: 'post',
                    url: '/restful/pro',
                    dataType: "json",
                    data: jsonStr6
                }).success(function (data, status, headers, config) {
                    var state = data.state;
                    if (state == 'ok') {
                        item.xlf = resData.xlf;
                        item.wxgz = resData.wxgz;
                        item.xlxm = resData.xlxm;
                        $scope.repairDataList.splice(index, 1, item);
                        locals.setObject("repairDataList", $scope.repairDataList);

                    } else {
                        ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                    }
                }).error(function (data) {
                    ionicToast.show("服务异常","middle",2000);
                });

            } else {
                var params = {
                    db: "mycon1",
                    function: "sp_fun_upload_maintenance_project_library",
                    xlxm: resData.xlxm,
                    wxgz: resData.wxgz,
                    xlf: resData.xlf
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
                        item.xlf = resData.xlf;
                        item.wxgz = resData.wxgz;
                        item.xlxm = resData.xlxm;
                        $scope.pjDataList.splice(index, 1, item);
                        locals.setObject("repairDataList", $scope.pjDataList);

                    } else {
                        ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                    }
                }).error(function (data) {
                    ionicToast.show("服务异常","middle",2000);
                });

            }

        }, function () {

        });
    }



    $scope.judgeToStatu = function (djzt) {
        if ($scope.djztUnable == 1) {
            return;
        }
        if (djzt == "派工") {
            $state.go("TendList");
        } else if (djzt == "全部完工") {

            var params = {
                db: "mycon1",
                function: "sp_fun_update_repair_list_state",
                jsd_id: jsdId,
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
                    $scope.djzt = "取消完工";
                    $scope.showFloatImg = true;

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        } else if (djzt == "取消完工") {

            var params = {
                db: "mycon1",
                function: "sp_fun_update_repair_list_state",
                jsd_id: jsdId,
                states: "修理中",
                xm_state: "待质检"
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
                    $scope.djzt = "派工";
                    $scope.showFloatImg = false;

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }
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
            var jsonStr8 = angular.toJson(params);
            $http({
                method: 'post',
                url: '/restful/pro',
                dataType: "json",
                data: jsonStr8
            }).success(function (data, status, headers, config) {
                var state = data.state;
                if (state == 'ok') {
                    $state.go("Winbding");
                    // locals.setObject("carInfo",upLoadInfo);
                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }, function () {

        });


    }

    //当离开工单页面时，比较数据
    $scope.$on('$stateChangeStart', function (event, toState, fromState) {
        var pjDataListT = $scope.pjDataList;
        var pjTotalCb = 0;
        if (pjDataListT != null && pjDataListT.length > 0) {
            for (var i = 0; i < pjDataListT.length; i++) {
                var pjData = pjDataListT[i];
                pjTotalCb += Number(pjData.cb);
            }
        }
        if (Number(jsdInfo.clcb) != pjTotalCb ||
            Number(jsdInfo.clfzj) != Number($scope.pjTotal) ||
            Number(jsdInfo.wxfzj) != Number($scope.xlfTotal) ||
            (Number($scope.pjTotal) + Number(jsdInfo.wxfzj)) != Number(jsdInfo.zje)) {


            var jsd_id = locals.get("jsd_id");
            var params = {
                db: "mycon1",
                function: "sp_fun_update_repair_main_money",
                jsd_id: jsd_id,
                zje: Number($scope.pjTotal) + Number(jsdInfo.wxfzj) + '',
                wxfzj: jsdInfo.wxfzj,
                clfzj: $scope.pjTotal,
                clcb: pjTotalCb + ''

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

                } else {
                    ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
                }
            }).error(function (data) {
                ionicToast.show("服务异常","middle",2000);
            });
        }


    });
}]);


//模态框对应的Controller
app.controller('modalAddTempCtrl', function ($scope, $state, $modalInstance, locals, data) {
    $scope.firstIconArr = data;


    var tempData = new Object();
    tempData.mc = "";
    tempData.wxcb = "";
    tempData.xmjg = "";
    tempData.xmlb = "";
    $scope.goBackPage = function () {
        history.back();
    }
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
    $scope.isNewPrice = true;
    //在这里处理要进行的操作
    $scope.ok = function (xlxm, wxgz, xlf, isNewPrice) {
        var resData = new Object();
        resData.xlxm = xlxm;
        resData.wxgz = wxgz;
        resData.xlf = xlf;
        resData.isNewPrice = $scope.isNewPrice;
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
    $scope.goBackPage = function () {
        history.back();
    }
    $scope.showSelectMore = 0;
    var params = {
        db: "mycon1",
        function: "sp_fun_down_stock",
        comp_code: user.company_code,
        pjbm: "",
        cd: "",
        ck: ""
    }
    var pjKucun = locals.getObject("pjKucun");
    $scope.dataList = pjKucun;
    if (pjKucun == null || pjKucun.length == null || pjKucun.length == 0) {
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params)
        }).success(function (data, status, headers, config) {
            console.log("data   " + angular.toJson(data));

            var state = data.state;
            if (state == 'ok') {
                var pjKucun = data.data;
                $scope.dataList = pjKucun;
                locals.setObject("pjKucun", pjKucun);
                locals.setObject("newPjDataList", pjKucun);
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });
    }
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
    $scope.pjName = "";
    $scope.selectFromRes = false;
    $scope.searchPjName = function (pjName) {
        var pjKucun = locals.getObject("pjKucun");
        if ($scope.selectFromRes) {
            pjKucun = locals.getObject("newPjDataList");
        }
        var newPjList = new Array();
        for (var i = 0; i < pjKucun.length; i++) {
            var pjItem = pjKucun[i];
            if (pjItem.pjmc != null && pjItem.pjmc.indexOf(pjName) != -1) {
                newPjList.push(pjItem);
            }
        }
        locals.setObject("newPjDataList", newPjList);
        $scope.dataList = newPjList;
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
            ionicToast.show("服务异常","middle",2000);
        });
    }
    var oData = new Object();
    $scope.oData = oData;
    $scope.tempAddDataList = [];
    $scope.addTempPj = function () {
        var item = new Object();
        item.pjmc = "";
        item.cb = "";
        item.ssj = "";
        item.sl = "";
        $scope.tempAddDataList.push(item);
    }


    var postPjTempSize = 0;
    var postTempPjNum = 0;
    $scope.makeSureTempPei = function () {
        var oData = $scope.oData;
        $scope.tempAddDataList.push(oData);
        var tempAddDataList = $scope.tempAddDataList;

        postPjTempSize = tempAddDataList.length;
        angular.forEach(tempAddDataList, function (value) {
            postTempPjNum++;
            $scope.addToTempGdServer(value);
        })
    }


    $scope.addToTempGdServer = function (item) {


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
            zt: "急件销售",
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

            if (postTempPjNum == postPjTempSize) {
                $state.go("Winbding");
            }
            console.log(data);
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });
    }


    var zdPjData = new Object();
    $scope.zdPjData = zdPjData;
    $scope.zdPeijianList = [];

    $scope.addZdPj = function () {
        var item = new Object();
        item.pjmc = "";
        item.sl = "";
        $scope.zdPeijianList.push(item);
    }

    $scope.makeSureZdPei = function () {
        postTempPjNum = 0;
        var oData = $scope.zdPjData;
        $scope.zdPeijianList.push(oData);
        var tempAddDataList = $scope.zdPeijianList;

        postPjTempSize = tempAddDataList.length;
        angular.forEach(tempAddDataList, function (value) {
            postTempPjNum++;
            $scope.addToTempGdServer(value);
        })

    }


}]);


app.controller('TendListCtrl', ['$http', '$scope', '$state', "ionicToast", "locals", "$modal", "$window", function ($http, $scope, $state, ionicToast, locals, $modal, $window) {
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
    $scope.goBackPage = function () {
        history.back();
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
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
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
                $window.location.reload();
                // locals.setObject("carInfo",upLoadInfo);
            } else {

            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
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
    $scope.goBackPage = function () {
        history.back();
    }
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
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常","middle",2000);
        });
    }
    $scope.getWxHistory();


}]);
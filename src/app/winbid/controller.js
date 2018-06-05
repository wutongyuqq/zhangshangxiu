app.controller('WinBidCtrl', ['$http', '$scope', '$state', 'locals', 'ionicToast', function ($http, $scope, $state, locals, ionicToast) {
    var carInfo = locals.getObject("carInfo");

    $scope.carInfo = carInfo;
    var params = {
        db: "mycon1",
        function: "sp_fun_down_poundage"
    };
    var jsToBean = new Object();
    jsToBean.wxFl = 0;
    jsToBean.zfbFl = 0;
    jsToBean.yhkFl = 0;
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
            if (dataArray != null && dataArray.length > 0) {
                var jsdBean = jsToBean;
                var selectList = new Array();
                for (var i = 0; i < dataArray.length; i++) {
                    var bean = dataArray[i];
                    if (bean.name == "微信") {
                        jsdBean.wxFl = Number(bean.setup2);
                    } else if (bean.name == "支付宝") {
                        jsdBean.zfbFl = Number(bean.setup2);
                    }
                    if(bean.name!="微信"&&bean.name!="支付宝"){
                        selectList.push(bean);
                    }
                }
                $scope.selectList = selectList;
                jsdBean.yhkFl = Number(selectList[0].setup2);
                $scope.shuaKaStr = selectList[0].setup1;
                jsToBean.yskDkNum = selectList[0].Pre_payment;
                $scope.jsToBean = jsdBean;
            }

        }
    }).error(function (data) {
        ionicToast.show("服务异常", "middle", 2000);
        pre_row_number = 'end';
    });
    var shouyinBean = locals.getObject("shouyinBean");
    $scope.shouyinBean = shouyinBean;
    $scope.isShowAll = false;


    $scope.selectItem=function(item){
        var jsdBean = $scope.jsdBean;
        jsdBean.yhkFl = item.setup2;
        $scope.jsToBean = jsdBean;
        $scope.shuaKaStr = item.setup1;

    }
    $scope.showAllMoney = function () {
        var vipcard_no = Number($scope.vipcard_no?$scope.vipcard_no:"0");
        if(vipcard_no==0){
            ionicToast.show("请输入会员卡卡号", 'middle', false, 2000);
            return;
        }

        var params2 = {
            db: "mycon1",
            function: "sp_fun_get_vipcard_money",
            vipcard_no: $scope.vipcard_no+""
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
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });


    }

    $scope.weifenpeiNum = shouyinBean.ysje;

    $scope.xianjinPay = function () {

        $scope.xianjinNum = Number(shouyinBean.ysje) -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.weixinNum ? $scope.weixinNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0');
        $scope.weifenpeiNum = 0;
    }
    $scope.goBackPage = function () {

        history.back();
    }


    $scope.shuakaPay = function () {

        $scope.shuakaNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.weixinNum ? $scope.weixinNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0');
        $scope.weifenpeiNum = 0;
    }


    $scope.zhuanzhangPay = function () {

        $scope.zhuanzhangNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.weixinNum ? $scope.weixinNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0');
        $scope.weifenpeiNum = 0;
    }


    $scope.guazhangPay = function () {

        $scope.guazhangNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.weixinNum ? $scope.weixinNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0');
        $scope.weifenpeiNum = 0;
    }

    $scope.weixinPay = function () {

        $scope.weixinNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0');
        $scope.weifenpeiNum = 0;
    }

    $scope.getWfpMoney = function () {
        $scope.weifenpeiNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.zfbNum ? $scope.zfbNum : '0') - Number($scope.weixinNum ? $scope.weixinNum : '0') ;

    }
    $scope.zfbPay = function () {

        $scope.zfbNum = Number(shouyinBean.ysje) -
            Number($scope.xianjinNum ? $scope.xianjinNum : '0') -
            Number($scope.shuakaNum ? $scope.shuakaNum : '0') -
            Number($scope.zhuanzhangNum ? $scope.zhuanzhangNum : '0') -
            Number($scope.guazhangNum ? $scope.guazhangNum : '0') -
            Number($scope.weixinNum ? $scope.weixinNum : '0');
        $scope.weifenpeiNum = 0;
    }
    $scope.shouYin = function () {
        var carInfo = locals.getObject("carInfo");
        var user = locals.getObject("user");
        var jsd_id = locals.get("jsd_id");
        $scope.carInfo = carInfo;

        var checkNum =0;

        var ysje;

        var sxf;
        var ssje;
        var skfs='';
        var skfs1='';
        var sxf1;
        var skje1;


        var skfs2='';
        var sxf2;
        var skje2;

        var Pre_payment = $scope.shouyinBean.Pre_payment;



        var xianjinNum = $scope.xianjinNum?Number($scope.xianjinNum):0;//现金
        var shuakaNum = $scope.shuakaNum?Number($scope.shuakaNum):0;//刷卡

        var zhuanzhangNum = $scope.zhuanzhangNum?Number($scope.zhuanzhangNum):0;//转账

        var kcVipMoney = $scope.kcVipMoney?Number($scope.kcVipMoney):0;//扣除会员卡


        var guazhangNum = $scope.guazhangNum?Number($scope.guazhangNum):0;//挂账

        var weixinNum = $scope.weixinNum?Number($scope.weixinNum):0;//微信

        var zfbNum = $scope.zfbNum?Number($scope.zfbNum):0;//支付宝




        var yhkFl = (Number)($scope.jsToBean&&$scope.jsToBean.yhkFl?((Number)($scope.jsToBean.yhkFl)):0);

        var yskDkNum = $scope.jsToBean.yskDkNum?Number($scope.jsToBean.yskDkNum):0;//预收款抵扣

        var bit_compute = $scope.shouyinBean.bit_compute?Number($scope.shouyinBean.bit_compute):0;//养车币

        var wxFl = $scope.jsToBean.wxFl?Number($scope.jsToBean.wxFl):0;//微信费率

        var zfbFl = $scope.jsToBean.zfbFl?Number($scope.jsToBean.zfbFl):0;//支付宝费率


        var yhje=Number($scope.shouyinBean.yhje?$scope.shouyinBean.yhje:'0');

        var ysje=Number(shouyinBean.ysje ? shouyinBean.ysje : "0");


        var moneyDescArr = ['现金','刷卡','转账','会员卡','挂账','微信','支付宝','预收款','养车币'];
        var moneyArr =[xianjinNum,shuakaNum,zhuanzhangNum,kcVipMoney,guazhangNum,weixinNum,zfbNum,yskDkNum,bit_compute];



        var moneySxf = [0,shuakaNum*yhkFl,0,0,0,weixinNum*wxFl,zfbNum*zfbFl,0,0];

        var newMoneyArr = new Array();

        var moneyTotal = 0;
        var sxfTotal = 0;
        for(var i=0;i<moneyArr.length;i++){
            var moneyNum = Number(moneyArr[i]?moneyArr[i]:0);
            if(moneyNum>0) {
                var moneyBean = new Object();
                moneyBean.money = moneyArr[i];
                moneyBean.sxf = Number(moneySxf[i]).toFixed(2);
                moneyBean.moneyDesc = moneyDescArr[i];
                moneyTotal+=moneyArr[i];
                sxfTotal+=moneySxf[i];
                newMoneyArr.push(moneyBean);
            }
        }
        if(newMoneyArr.length>3){
            ionicToast.show("结算方式超过3种，请重新选择", 'middle', false, 2000);
            return;
        }else if(newMoneyArr.length==0){
            ionicToast.show("您还未填写付款金额", 'middle', false, 2000);
            return;
        }
        if(moneyTotal<(ysje-yhje).toFixed(0)){
            ionicToast.show("您填写的金额不正确", 'middle', false, 2000);
            return;
        }

        if(newMoneyArr!=null && newMoneyArr.length>0){
            if(newMoneyArr.length>2){
                skfs = newMoneyArr[0].moneyDesc;
                ysje = newMoneyArr[0].money;
                ssje = newMoneyArr[0].money - yhje - newMoneyArr[0].sxf;

                skfs1= newMoneyArr[1].moneyDesc;
                skje1 =  newMoneyArr[1].money;
                sxf1=newMoneyArr[1].money - newMoneyArr[1].sxf;

                skfs2= newMoneyArr[2].moneyDesc;
                skje2 =  newMoneyArr[12].money;
                sxf2=newMoneyArr[2].money - newMoneyArr[2].sxf;

            }else if(newMoneyArr.length==2){
                skfs = newMoneyArr[0].moneyDesc;
                ysje = newMoneyArr[0].money;
                ssje = newMoneyArr[0].money - yhje - newMoneyArr[0].sxf;

                skfs1= newMoneyArr[1].moneyDesc;
                skje1 =  newMoneyArr[1].money;
                sxf1=newMoneyArr[1].money - newMoneyArr[1].sxf;

                skfs2= 0;
                skje2 =  0;
                sxf2=0;


            }else if(newMoneyArr.length==1){
                skfs = newMoneyArr[0].moneyDesc;
                ysje = newMoneyArr[0].money;
                ssje = newMoneyArr[0].money - yhje - newMoneyArr[0].sxf;

                skfs1= 0;
                skje1 =  0;
                sxf1=0;

                skfs2=0;
                skje2 =  0;
                sxf2=0;

            }else if(newMoneyArr.length==0){
                ionicToast.show("请未填写付款方式或付款金额", 'middle', false, 2000);
                return;
            }
        }



      /*  if(xianjinNum>0){//现金有值
            checkNum++;
             skfs = "现金";
             yhje=Number($scope.shouyinBean.yhje?$scope.shouyinBean.yhje:'0');
             ysje = xianjinNum;
             ssje = Number($scope.xianjinNum) - yhje;

            if(shuakaNum>0){
                skfs1= $scope.shuaKaStr;
                skje1 = shuakaNum;
               sxf1=shuakaNum*yhkFl;
                if(weixinNum>0){
                    skfs2 = "微信";
                    skje2=weixinNum;
                    sxf2 = weixinNum * ($scope.jsToBean.wxFl?Number($scope.jsToBean.wxFl):0);
                }
                if(zfbNum>0){
                    skfs2 = "支付宝";
                    skje2=zfbNum;
                    sxf2 = zfbNum * ($scope.jsToBean.zfbFl?Number($scope.jsToBean.zfbFl):0);
                }
            }
            //"ysje":"300","yhje":"1","sxf":"0.00","ssje":"299","skfs":"现金","pre_payment":"200.00"
        }else if(xianjinNum==0&&shuakaNum>0){//现金无，刷卡有数据

            skfs = $scope.shuaKaStr;
            yhje=Number($scope.shouyinBean.yhje?$scope.shouyinBean.yhje:'0');
            ysje = shuakaNum;
            sxf = shuakaNum - shuakaNum*yhkFl;
            ssje = shuakaNum - yhje - sxf;
            if(weixinNum>0){
                skfs1 = "微信";
                skje1=weixinNum;
                sxf1 = weixinNum * ($scope.jsToBean.wxFl?Number($scope.jsToBean.wxFl):0);
                if(zfbNum>0){
                    skfs2 = "支付宝";
                    skje2=zfbNum;
                    sxf2 = zfbNum * ($scope.jsToBean.zfbFl?Number($scope.jsToBean.zfbFl):0)
                }
            }
        }
        if($scope.shuakaNum&&Number($scope.shuakaNum)>0){
            checkNum++;

        }
        if($scope.guazhangNum&&Number($scope.guazhangNum)>0){
            checkNum++;

        }
        if($scope.weixinNum&&Number($scope.weixinNum)>0){
            checkNum++;

        }
        if($scope.zfbNum&&Number($scope.zfbNum)>0){
            checkNum++;

        }
        if($scope.zhuanzhangNum&&Number($scope.zhuanzhangNum)>0){
            checkNum++;

        }


        if(checkNum>3){
            ionicToast.show("结算方式超过3种，请重新选择", 'middle', false, 2000);
            return;
        }*/
        var sxf = (Number($scope.weixinNum ? $scope.weixinNum : "0") * Number($scope.jsToBean.wxFl ? $scope.jsToBean.wxFl : "0") + Number($scope.shuakaNum ? $scope.shuakaNum : "0") * Number($scope.jsToBean.yhkFl ? $scope.jsToBean.yhkFl : "0")).toFixed(2);
        var sxf1 = (Number($scope.weixinNum ? $scope.weixinNum : "0") * Number($scope.jsToBean.wxFl ? $scope.jsToBean.wxFl : "0")).toFixed(2);
        var sxf2 = (Number($scope.jsToBean.yhkFl ? $scope.jsToBean.yhkFl : "0") * Number($scope.shuakaNum ? $scope.shuakaNum : "0")).toFixed(2);
        var ssje = (Number(shouyinBean.ysje ? shouyinBean.ysje : "0") - Number(shouyinBean.yhje ? shouyinBean.yhje + "" : "0") - Number(sxf ? sxf : "0") - Number(shouyinBean.bit_use ? shouyinBean.bit_use : "0")).toFixed(2);

        var params = {
            db: "mycon1",
            function: "sp_fun_upload_receivables_data",
            company_code: user.company_code,
            customer_id: carInfo.customer_id,
            plate_number: carInfo.cardName + "",
            jsd_id: jsd_id,
            czy: user.userName,
            ysje: shouyinBean.ysje ? shouyinBean.ysje + "" : '0',
            yhje: shouyinBean.yhje ? shouyinBean.yhje + "" : '0',
            sxf: sxf ? sxf + "" : '0',
            ssje: ssje ? ssje + "" : '0',
            skfs: "现金",
            bit_compute: shouyinBean.bit_compute ? shouyinBean.bit_compute + "" : '0',
            bit_use: shouyinBean.bit_use ? shouyinBean.bit_use + "" : '0',
            skfs1: "微信",
            skje1: $scope.weixinNum ? $scope.weixinNum + "" : '0',
            sxf1: sxf1 ? sxf1 + "" : '0',
            skfs2: "中行刷卡",
            skje2: $scope.shuakaNum ? $scope.shuakaNum + "" : '0',
            sxf2: sxf2 ? sxf2 + "" : '0',
            pre_payment: "0.00",
            vipcard_no: $scope.vipcard_no ? $scope.vipcard_no + "" : ''
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
                ionicToast.show("提交成功", 'middle', false, 2000);
                $state.go("Winbding");
            } else {
                ionicToast.show("错误：" + data.msg, 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });
    }
}]);
app.controller('WinTotalCtrl', ['$http', '$scope', '$state', 'locals', 'ionicToast', function ($http, $scope, $state, locals, ionicToast) {
    var carInfo = locals.getObject("carInfo");
    var user = locals.getObject("user");
    $scope.factoryName = user.factoryName;
    var jsd_id = locals.get("jsd_id");
    var ticheTime = locals.get("ticheTime");
    $scope.carInfo = carInfo;
    $scope.jsd_id = jsd_id;
    $scope.ticheTime = ticheTime;
    var jsdInfo = new Object();
    $scope.syType == 0;
    $scope.getBaseData = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_down_repair_list_main",
            jsd_id: jsd_id
        };
        var jsonStr = angular.toJson(params);
        var gdData = new Object();
        $scope.gdData = gdData;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var gdDataList = data.data;
                if (gdDataList != null && gdDataList.length > 0) {
                    gdData = gdDataList[0];
                    jsdInfo = gdData;
                    $scope.gdData = gdData;


                }
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });

    }
    $scope.getBaseData();

    $scope.pjDataList = new Array();
    var totalCb = 0;
    var jsdInfo = new Object();
    $scope.getPjListData = function () {
        var params2 = {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_pjclmx",
            jsd_id: jsd_id
        };
        var jsonStr2 = angular.toJson(params2);
        var pjData = new Object();
        $scope.pjData = pjData;
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr2
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var gdDataList = data.data;
                if (gdDataList != null && gdDataList.length > 0) {
                    $scope.pjDataList = gdDataList;
                    if (gdDataList != null && gdDataList.length > 0) {
                        var totalsl = 0;
                        var totalMoney = 0;
                        for (var i = 0; i < gdDataList.length; i++) {
                            var bean = gdDataList[i];
                            totalsl += Number(bean.sl);
                            totalMoney += Number(bean.ssj) * Number(bean.sl);
                            totalCb += Number(bean.cb);
                        }
                        $scope.totalsl = totalsl;
                        $scope.totalMoney = totalMoney;
                    }
                }
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });
    }
    $scope.getPjListData();
    $scope.getProjListData = function () {
        var params2 = {
            db: "mycon1",
            function: "sp_fun_down_jsdmx_xlxm",
            jsd_id: jsd_id
        };
        var jsonStr3 = angular.toJson(params2);
        var pjData = new Object();
        $scope.pjData = pjData;
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
                    $scope.xmDataList = gdDataList;
                    if (gdDataList != null && gdDataList.length > 0) {
                        var totalXlf = 0;
                        var totalZk = 0;
                        for (var i = 0; i < gdDataList.length; i++) {
                            var bean = gdDataList[i];
                            totalXlf += Number(bean.xlf);
                            totalZk += Number(bean.zk);
                        }
                        $scope.totalXlf = totalXlf;
                        $scope.totalZk = totalZk;
                    }

                }
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });
    }
    $scope.getProjListData();

    $scope.goBackPage = function () {
        history.back();
    }


    $scope.getCompanyData = function () {
        var params2 = {
            db: "mycon1",
            function: "sp_fun_get_company_info",
            company_code: user.company_code
        };
        var jsonStr3 = angular.toJson(params2);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr3
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            if (state == 'ok') {
                var dataList = data.data;
                if (dataList != null && dataList.length > 0) {
                    var dataBean = dataList[0];
                    $scope.company_name = dataBean.company_name;
                    $scope.telphone = dataBean.telphone;
                    $scope.address = dataBean.address;
                }

            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
            pre_row_number = 'end';
        });


    }
    $scope.getCompanyData();


    $scope.getDataInfo = function () {
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
                    var carToInfo = gdData;
                    var jcDataStr = gdData.ywg_date;
                    if (jcDataStr.length > 10) {
                        jcDataStr = jcDataStr.substring(0, 10);
                    }
                    $scope.ticheTime = jcDataStr;
                    $scope.memo = gdData.memo;//备注
                    $scope.cx = gdData.cx;//备注
                    $scope.car_fault = gdData.car_fault;//备注

                }

            }
        });

    }


    $scope.getDataInfo();
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

    $scope.dyTime = $scope.getDateTime();
    $scope.toJieSuanDetail = function () {
        //totalXlf+totalMoney
        if ($scope.gdData.djzt == '审核已结算') {
            return;
        }

        if (Number(jsdInfo.clcb) != totalCb ||
            Number(jsdInfo.clfzj) != Number($scope.totalMoney) ||
            Number(jsdInfo.wxfzj) != Number($scope.totalXlf) ||
            (Number($scope.totalMoney) + Number(jsdInfo.totalXlf)) != Number(jsdInfo.zje)) {

            $scope.judgeIsSendData();
        } else {
            $scope.uploadMoney();
        }


    }


    $scope.judgeIsSendData = function () {
        var jsd_id = locals.get("jsd_id");
        var params = {
            db: "mycon1",
            function: "sp_fun_update_repair_main_money",
            jsd_id: jsd_id,
            zje: Number($scope.totalXlf == null ? '0' : $scope.totalXlf) + Number($scope.totalMoney == null ? '0' : $scope.totalMoney) + '',
            wxfzj: $scope.totalXlf == null ? '0' : $scope.totalXlf,
            clfzj: $scope.totalMoney == null ? '0' : $scope.totalMoney,
            clcb: totalCb == null ? '0' : totalCb + ''

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
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });
    }

    $scope.uploadMoney = function () {
        var jsd_id = locals.get("jsd_id");
        var params = {
            db: "mycon1",
            function: "sp_fun_get_settle_accounts_info",
            jsd_id: jsd_id
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
                var dataBean = dataArray[0];
                shouyinBean.ysje = Number($scope.totalXlf + $scope.totalMoney);
                shouyinBean.yhje = Number($scope.totalZk);
                shouyinBean.bit_compute = Number(dataBean.bit_compute);
                shouyinBean.bit_use = Number(dataBean.bit_amount);
                shouyinBean.ysje = Number(dataBean.zje);
                shouyinBean.Pre_payment = Number(dataBean.Pre_payment);
                locals.setObject("shouyinBean", shouyinBean);
                $state.go("WinBid");
            } else {
                ionicToast.show("错误：" + data.msg ? data.msg : "", 'middle', false, 2000);
            }
        }).error(function (data) {
            ionicToast.show("服务异常", "middle", 2000);
        });

    }

}]);

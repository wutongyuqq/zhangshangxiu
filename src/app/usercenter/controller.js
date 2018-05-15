app.controller('userCenterCtrl', ['$http','$uibModal','$log','$scope','$document','utils','$anchorScroll',"$location",function($http,$uibModal, $log, $scope,$document,utils,$anchorScroll,$location) {
	var selt = this;
    $location.hash();
    $anchorScroll();
	this.keywork = "";
	var keyword = utils.getUrlVar('keyword');
	if(keyword){
	    selt.keywork = decodeURI(keyword);
    }
    this.initRegion = function(){
        $http.get("/company/filter").success(function (result) {
            if(result.code==1){
                var arr1 = [];
                var arr2 = [];
                selt.areaList = result.data.area;
                for(var i=0;i<result.data.area.length;i++){
                    var areaArr = result.data.area;
                    if(i<12){
                        arr1.push(areaArr[i]);
                    }else{
                        arr2.push(areaArr[i]);
                    }
                }
                selt.areaList = arr1;
                console.log(arr1);
                selt.areaList2 = arr2;
                console.log(arr2);
            }else{
                alert(result.msg);
            }
        });
    }

    this.initData = function(){
        var params = {
            linkName: selt.keywork,
            pageSize:200
        }
        $http.post("/foundation/links",angular.toJson(params)).success(function (result) {
            console.log(result);
            if(result.code == 1){
                selt.linkList = result.data;
            }else {
                alert(result.msg);
            }
        });
    }

    //----初始话地区和全部链接信息----
    this.initRegion();
    this.initData();

    this.isCity = false;
    this.regisAddress = "";
    this.province = "";
    //----省市----
    this.clickProvince = function (area) {
        selt.province = area.name;
        selt.isCity = true;
        if(area.list.length <= 0){
            this.clickCity(area);
        }else{
            selt.cityList = area.list;
        }
        this.findLinks(selt.province);
    };
    this.clickCity = function (city) {
        selt.regisAddress = selt.province+"||"+city;
        selt.city = city;
        selt.isCity = true;
        this.findLinks(selt.regisAddress);
    };
    this.allArea = function () {
        this.province = "";
        this.city = "";
        this.isCity = false;
        this.findLinks(null);
    }

    this.cancleEmCity = function () {
        selt.regisAddress = selt.province+"||";
        selt.city="";
        this.findLinks(selt.regisAddress);
    };
    //---省市----end

    this.findLinks = function(region){
        var params = {
            region:region,
            pageSize:200,
            linkName:selt.keywork
        }
        $http.post("/foundation/links",angular.toJson(params)).success(function (result) {
            console.log(result);
            selt.linkList = result.data;
        });
    }

    this.morePro = false;
    this.moreProvince=function(morePro){
        selt.morePro = !morePro;
    };
    this.moreZz = false;
    this.moreSelectZz=function(moreZz){
        selt.moreZz = !moreZz;
    };

    /**
     * 常见链接
     */
    this.listCustomUrls = function () {
        var params = {
            pageNo : 1,
            pageSize : 6
        }

        $http.post("/foundation/customUrls", angular.toJson(params)).success(function (result) {
            console.log("********");
            console.log(result);
            if (result.code == "1") {
                selt.commonLinkList = result.data;
            }
        });
    }
    this.listCustomUrls();

}]);

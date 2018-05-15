
app.controller('TenderCtrl', ['$http', '$uibModal', '$log', '$scope', '$state', 'Demo','userTemp','$anchorScroll',"$location",function ($http, $uibModal, $log, $scope, $state,Demo,userTemp,$anchorScroll,$location) {

    var selt = this;

    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }
    $location.hash();
    $anchorScroll();
    $scope.demo = new Demo(0);
    var tenderType = 0;//Ĭ���б�
    var paramsPage = {
        pageNo: 1,
        pbModes: '',
        type: 0,
        kbDateStart: '',
        projSumStart: '',
        projSumEnd: '',
        pageSize: 20,
        kbDateEnd: '',
        regions: '',
        zzType: '',
        projectType: ''
    };

    $http.post("/notice/queryList", angular.toJson(paramsPage),
        {headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}}).success(function (result) {

        $scope.dataList = result.data;

    });
    $scope.isTender = true;

    $scope.toDetail = function (id) {
        if(tenderType==0) {
            $state.go('TenderDtail', {id: id});
        }else{
            $state.go('Winbding', {id: id});
        }
    }
    $scope.chageToTender = function(){
        paramsPage.type=0;
        tenderType = 0;
        $scope.demo = new Demo(tenderType);
        $scope.isTender = true;
        $http.post("/notice/queryList", angular.toJson(paramsPage),
            {headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}}).success(function (result) {

            $scope.dataList = result.data;

        });

    }

    $scope.chageToWinBid = function(){
        tenderType = 2;
        $scope.demo = new Demo(tenderType);
        paramsPage.type=2;

        $scope.isTender = false;
        $http.post("/notice/queryList", angular.toJson(paramsPage),
            {headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}}).success(function (result) {

            $scope.dataList = result.data;

        });

    }
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

}]);




app.factory('Demo', function ($http) {
    var paramsPage = {
        pageNo: 1,
        pbModes: '',
        type: 0,
        kbDateStart: '',
        projSumStart: '',
        projSumEnd: '',
        pageSize: 20,
        kbDateEnd: '',
        regions: '',
        zzType: '',
        projectType: ''
    };
    var Demo = function (tenderType) {
        this.dataList = [];
        this.busy = false;
        this.after = '';
        this.page = 0;
        this.tenderType = tenderType;
    };

    Demo.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;

        paramsPage.pageNo = this.page;
        paramsPage.type = this.tenderType;
        $http.post("/notice/queryList", angular.toJson(paramsPage),
            {headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}}).success(function (result) {
            var dataList = result.data;
            if(dataList!=null){
                for (var i = 0; i < dataList.length; i++) {
                    this.dataList.push(dataList[i]);
                }
                this.after = "t3_" + this.dataList[this.dataList.length - 1].id;
                this.busy = false;
                this.page += 1;
            }
        }.bind(this));

    };

    return Demo;
});


app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;

    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }
    $location.hash();
    $anchorScroll();
    var id = $stateParams.id;
    var dataArray = [];
    var resArray = [];
    $scope.currentNum = 0;
    $scope.bdSize = 0;

    var paramsPage = {
        type: 0
    }
    $http.post("/notice/queryRelNotice/" + id, angular.toJson(paramsPage)).success(function (result) {
        //console.log(result);
        dataArray = result.data;
        $scope.tenderArrayData = dataArray;
        $scope.firstTender = dataArray[0];

    })
    $http.post("/notice/detail/" + id, angular.toJson(paramsPage), {
        headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}
    }).success(function (result) {
        console.log(result);

        $scope.projSum = result.projSum;
        $scope.mSize = result.data.length;
        $scope.dataArrayList = result.data;
        $scope.currentTender = result.data[0];
        $scope.bdSize = result.data.length;
        $scope.fileCount = result.fileCount;
        $scope.relNoticeCount = result.relNoticeCount;
        if(result.data.length>0){
            $scope.currentNum =1;
        }

        $("#bdd_follow_info_one").html(result.data[0].content);
        $("#bdd_follow_info_two").html(result.data[0].content);
        resArray = result.data;
    })
    $http.post("/notice/queryCompanyList/" + id+'?pageSize=10&&pageNo=1', {
        headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}
    }).success(function (result) {
        console.log(result);
        $scope.copanyResultArr = result.data;

    })
    $scope.toCurrentTender = function (index) {
        $scope.currentTender = resArray[index];
        $scope.relNoticeCount = resArray[index].relNoticeCount;
        $("#bdd_follow_info_one").html(resArray[index].content);
        $scope.currentNum =index+1;
    }
    $scope.toTenderSayList = function (id, type) {
        $state.go('TenderSay', {id: id, type: type});
    }
    <!--分享-->
    $scope.isShow = false;
    $scope.share = function (type) {
        var url=document.location.href;
        var sharesinastring;
        var title = this.currentTender.title;
        switch (type) {
            case 'xinlang':
                sharesinastring = 'http://v.t.sina.com.cn/share/share.php?url='+url+'&title='+title+'&content=utf-8'
                break;
            case 'qq':
                sharesinastring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+title+'&url='+url+'&desc='+title+'&title='+title;
                break;
            case 'wechat':
                sharesinastring='http://pan.baidu.com/share/qrcode?w=150&h=150&url='+url;
                $scope.imgCodeUrl = sharesinastring;
                $scope.isShow = true;
                return;
        }
        $scope.isShow = false;
        window.open(sharesinastring);
    }

    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

    <!--关注-->
    $scope.addConcern = function (id,type) {
       var params ={
           noticeid:id,
           type:type
       };
       console.log(params);
       $http.post("/userCenter/collectionNotice",angular.toJson(params)).success(function (result) {
           console.log(result);
           if(result.code == 1){
               alert('收藏成功');
               $scope.currentTender.collected = true;
           }else {
               alert(result.msg);
           }
       })
    }

    <!--取消关注-->
    $scope.cancelConcern = function (id) {
        var params = {
            noticeid:id
        };
        console.log(params);
        $http.post("/userCenter/cancelCollectionNotice",angular.toJson(params)).success(function (result) {
            console.log(result);
            if(result.code == 1){
                alert('取消收藏成功');
                $scope.currentTender.collected = false;
            }else{
                alert(result.msg);
            }
        })
    }
}]);


//�б깫����ļ�����ҳ��???
app.controller('TenderSayCtrl', ['$http', '$scope', 'utils', '$stateParams', 'userTemp','$state','$anchorScroll',"$location",function ($http, $scope, utils, $stateParams,userTemp,$state,$anchorScroll,$location) {
    var selt = this;

    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }
    $location.hash();
    $anchorScroll();
    var id = $stateParams.id;
    var showType = $stateParams.type;
    $scope.showType = showType;
    $scope.dataArraySize = 1;
    $scope.fileDataArraySize = 1;
    var paramsPage = {
        type: 0
    }
    if (showType == 0) {
        paramsPage.type = 0;
        $http.post("/notice/queryRelNotice/" + id, angular.toJson(paramsPage)).success(function (result) {

            var dataArray = result.data;
            $scope.tenderArrayData = dataArray;
            if(dataArray==null||dataArray.length == 0){
                $scope.dataArraySize = 0;
                $scope.showDataType = 0;
            }
            $scope.firstTender = dataArray[0];
        })
    } else if(showType == 1){
        paramsPage.type = 0;
        $http.post("/notice/queryNoticeFile/" + id, angular.toJson(paramsPage)).success(function (result) {

            var fileDataArray = result.data;
            if(fileDataArray==null||fileDataArray.length == 0){
                $scope.fileDataArraySize = 0;
                $scope.fileDataArrayType = 0;
            }
            $scope.fileDataArr = fileDataArray;
            $scope.fileSize = fileDataArray.length;
        });
    }else if(showType == 2){
        paramsPage.type = 2;
        $http.post("/notice/queryRelNotice/" + id, angular.toJson(paramsPage)).success(function (result) {

            var dataArray = result.data;
            if(dataArray==null||dataArray.length == 0){
                $scope.dataArraySize = 0;
                $scope.showDataType =2;
            }
            $scope.tenderArrayData = dataArray;
            $scope.firstTender = dataArray[0];
        })
    }else if(showType == 3){
        paramsPage.type = 2;
        $http.post("/notice/queryNoticeFile/" + id, angular.toJson(paramsPage)).success(function (result) {
            var fileDataArray = result.data;
            if(fileDataArray==null||fileDataArray.length == 0){
                $scope.fileDataArraySize = 0;
                $scope.fileDataArrayType = 0;
            }
            $scope.fileDataArr = fileDataArray;
            $scope.fileSize = fileDataArray.length;
        });
    }
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

    $scope.toTenderDetail=function(id,type){
        if(type!=null&&type==0){
            $state.go("TenderDtail",{id:id});
        }else{
            $state.go("Winbding",{id:id});
        }
    }
}])

app.controller('WinbdingCtrl', ['$http', '$scope', 'utils', '$stateParams','$state','userTemp', '$anchorScroll',"$location",function ($http, $scope, utils, $stateParams,$state,userTemp,$anchorScroll,$location) {
    var selt = this;

    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }
    $location.hash();
    $anchorScroll();
    var id = $stateParams.id;
    var dataArray = [];
    var resArray = [];
    $scope.currentNum = 0;
    $scope.bdSize = 0;
    var paramsPage = {
        type: 2
    }
    $http.post("/notice/queryRelNotice/" + id, angular.toJson(paramsPage)).success(function (result) {
        //console.log(result);
        dataArray = result.data;
        $scope.tenderArrayData = dataArray;
        $scope.firstTender = dataArray[0];

    })
    $http.post("/notice/detail/" + id, angular.toJson(paramsPage), {
        headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}
    }).success(function (result) {
        //console.log(result);
        $scope.mSize = result.data.length;
        $scope.dataArrayList = result.data;
        resArray =  result.data;
        $scope.currentTender = result.data[0];
        $scope.bdSize = result.data.length;
        $scope.fileCount = result.fileCount;
        $scope.relNoticeCount = result.relNoticeCount;
        if(result.data.length>0){
            $scope.currentNum =1;
        }
        $("#bdd_follow_info_one").html(result.data[0].content);
        console.log($scope.currentTender);
    })
    $http.post("/notice/queryCompanyList/" + id, {
        headers: {'X-TOKEN':  sessionStorage.getItem('X-TOKEN')}
    }).success(function (result) {
        console.log(result);
        $scope.copanyResultArr = result.data;

    })
    $scope.toCurrentTender = function (index) {
        $scope.currentTender = resArray[index];
        $scope.relNoticeCount = resArray[index].relNoticeCount;
        $("#bdd_follow_info_one").html(resArray[index].content);
        $scope.currentNum =index+1;
    }
    $scope.toTenderSayList = function (id, type) {
        $state.go('TenderSay', {id: id, type: type});
    }
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

    <!--分享-->
    $scope.isShow = false;
    $scope.share = function (type) {
        var url=document.location.href;
        var sharesinastring;
        var title = this.currentTender.title;
        switch (type) {
            case 'xinlang':
                sharesinastring = 'http://v.t.sina.com.cn/share/share.php?url='+url+'&title='+title+'&content=utf-8'
                break;
            case 'qq':
                sharesinastring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+title+'&url='+url+'&desc='+title+'&title='+title;
                break;
            case 'wechat':
                sharesinastring='http://pan.baidu.com/share/qrcode?w=150&h=150&url='+url;
                $scope.imgCodeUrlWin = sharesinastring;
                $scope.isShow = true;
                return;
        }
        $scope.isShow = false;
        window.open(sharesinastring);
    }

    <!--关注-->
    $scope.addConcernWin = function (id,type) {
        var params ={
            noticeid:id,
            type:type
        };
        console.log(params);
        $http.post("/userCenter/collectionNotice",angular.toJson(params)).success(function (result) {
            console.log(result);
            if(result.code == 1){
                alert('收藏成功');
                $scope.currentTender.collected = true;
            }else{
                alert(result.msg);
            }
        })
    }
    <!--取消关注-->
    $scope.cancelConcernWin = function (id) {
        var params = {
            noticeid:id
        };
        console.log(params);
        $http.post("/userCenter/cancelCollectionNotice",angular.toJson(params)).success(function (result) {
            console.log(result);
            if(result.code == 1){
                alert('取消收藏成功');
                $scope.currentTender.collected = false;
            }else{
                alert(result.msg);
            }
        })
    }
}]);

app.controller('TendListDetailCtrl', ['$http', '$scope', 'utils', '$stateParams','$state','userTemp','locals','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams,$state,userTemp,locals,$anchorScroll,$location) {
    var selt = this;
    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }
    $location.hash();
    $anchorScroll();
    $scope.company = locals.getObject("companyData");
    console.log( $scope.company);
    //------------翻页----end
}]);



app.controller('TendListCtrl', ['$http', '$scope', 'utils', '$stateParams','$state','userTemp','locals','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams,$state,userTemp,locals,$anchorScroll,$location) {
    var selt = this;
    $location.hash();
    $anchorScroll();
    this.init = function () {
        selt.setPage2();
    }

    this.companyList = [];
    this.busy = false;
    this.page = 1;
    this.setPage2 = function () {
        selt.companyList = [];
        selt.busy = false;
        selt.page = 1;
        selt.nextPage2();
    };

    this.nextPage2 = function () {
        if (selt.busy) return;
        selt.busy = true;
        var paramsPage2 = {
            pageNo: selt.page,
            pageSize: 5
        };
        console.log(paramsPage2);
        var id = $stateParams.id;

        $http.post("/notice/queryCompanyList/" + id, angular.toJson(paramsPage2)).success(function (result) {
            var companyList = result.data;
            if(companyList!=null){
            if (companyList != null &&
                selt.page == result.pageNo) {
                angular.forEach(companyList, function (company) {
                    selt.companyList.push(company);
                });
                selt.companySize = result.total;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
                selt.busy = false;
                selt.page += 1;
            }
            }
        });
    }

    this.toTendListDetail=function(companyData){
        console.log(companyData);
        locals.setObject("companyData",companyData);
        $state.go("TendListDetail");
    }

    this.setContentHeight = function (dataList) {
        var bdd_adver_header = document.getElementById("bdd_adver_header");
        if (dataList.length > 2) {
            bdd_adver_header.style.height = "auto";
        } else {
            bdd_adver_header.style.height = "500px";
        }
    };
}]);



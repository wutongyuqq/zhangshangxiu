app.controller('WorkMoreCtrl', ['$http','$scope','$state','locals','userTemp', '$anchorScroll',"$location","ionicToast",function($http, $scope,$state,locals,userTemp,$anchorScroll,$location,ionicToast) {

    $scope.exitLogin = function(){
        var user = locals.getObject("user");
        var params = {
            db:"mycon1",
            function:"sp_fun_user_logout",
            operater_code:user.userName,
            operater_ip:returnCitySN.cip
        };
        var jsonStr = angular.toJson(params);
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: jsonStr,
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            var endDateStr = data.service_end_date;
            if (state == 'true') {
                console.log(data.msg);
                locals.setObject("user","");
                $state.go("Login");

            }
        });
    }

    $scope.checkVersion=function(){
        ionicToast.show('当前已经是最新版本', 'middle',false, 2000);

    }


}]);






app.controller('WorkMoreDetailCtrl', ['$http','$uibModal','$log','$scope','$state','$stateParams','userTemp',function($http,$uibModal, $log, $scope,$state,$stateParams,userTemp) {
    var selt = this;

    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }

    var id = parseInt($stateParams.id);
    $http.post("/notice/queryArticleDetail",{id:id}).success(function (result) {
        console.log(result);
        $scope.dataRes = result.data;
        $("#bdd_adver_header_content").html(result.data.content);
    });
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

}]);
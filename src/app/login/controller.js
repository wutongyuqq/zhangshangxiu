app.controller('LoginCtrl', ['$http', '$log', '$scope', '$document', 'userTemp', '$state','locals',"ionicToast", function ($http, $log, $scope, $document, userTemp, $state,locals,ionicToast) {
    var selt = this;
    var user = locals.getObject("user");
    if(user!=null){
        user.factoryName = locals.getObject("user").factoryName;
        user.userName = locals.getObject("user").userName;
        user.password = locals.getObject("user").password;
    }else{
        user=new Object();
        user.factoryName = "";
        user.userName =  "";
        user.password =  "";
    }

    $scope.user = user;
    /**
     * 登录
     */
    $scope.checkDate = function () {
        user = $scope.user;
        var params = {
            db: "sjsoft_SQL",
            function: "sp_fun_check_service_validity",
            data_source: user.factoryName,
            operater_code: user.userName
        };
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params),
        }).success(function (data, status, headers, config) {
            console.log(data);
            var state = data.state;
            var endDateStr = data.service_end_date;
            if (state == 'true') {
                var endDate = new Date(endDateStr.replace(/\-/g, "\/"));
                var nowDate = new Date();

                if (endDate < nowDate) {
                    ionicToast.show("服务有效期限已经过了，请联系首佳软件进行续费。 过期时间：" + (endDate.length > 10 ? endDate.substr(0, 10) : endDate), 'middle',false, 2000);
                } else {
                    $scope.checkOtherService();
                }
            } else {
                ionicToast.show(data.msg ? data.msg : "服务异常", 'middle',false, 2000);
            }


        }).error(function (data, status, headers, config) {
            console.log(data);
        });


    }


    $scope.checkOtherService = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_check_user_state",
            operater_code: user.userName,
            operater_ip: returnCitySN.cip
        };
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params),
        }).success(function (data, status, headers, config) {
            var state = data.state;
            if (state == 'true') {
                $scope.login();
            }
            console.log(data);
        }).error(function (data, status, headers, config) {
            console.log(data);
        });


    };

    $scope.login = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_check_user_state_login",
            operater_code: user.userName,
            operater_ip: returnCitySN.cip,
            password: user.password
        };
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params),
        }).success(function (data, status, headers, config) {
            var state = data.state;
            user.company_code = data.comp_code;
            locals.setObject("user",user);

            if(state=='true'){
                $state.go("home");
            }
        });
    }


    var data = "通过modal传递的数据";
    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl : 'modal.html',//script标签中定义的id
            controller : 'modalCtrl',//modal对应的Controller
            resolve : {
                data : function() {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        })
    }

}]);




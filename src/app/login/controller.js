app.controller('LoginCtrl', ['$http', '$log', '$scope', '$document', 'userTemp', '$state', function ($http, $log, $scope, $document, userTemp, $state) {
    var selt = this;

    /**
     * 登录
     */
    $scope.checkDate = function () {
        var params = {
            db: "sjsoft_SQL",
            function: "sp_fun_check_service_validity",
            data_source: "首佳软件ASA",
            operater_code: "superuser"
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
                    alert("服务有效期限已经过了，请联系首佳软件进行续费。 过期时间：" + (endDate.length > 10 ? endDate.substr(0, 10) : endDate));
                } else {
                    $scope.checkOtherService();
                }
            } else {
                alert(data.msg ? date.msg : "服务异常");
            }


        }).error(function (data, status, headers, config) {
            console.log(data);
        });


    }


    $scope.checkOtherService = function () {
        var params = {
            db: "mycon1",
            function: "sp_fun_check_user_state",
            operater_code: "superuser",
            operater_ip: "192.168.0.101"
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
            operater_code: "superuser",
            operater_ip: "192.168.0.101",
            password: "123456"
        };
        $http({
            method: 'post',
            url: '/restful/pro',
            dataType: "json",
            data: angular.toJson(params),
        }).success(function (data, status, headers, config) {
            var state = data.state;
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




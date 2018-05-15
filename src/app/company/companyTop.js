app.controller('CompanyTopCtrl', ['$http','$uibModal','$log','$scope','$document', 'userTemp',function($http,$uibModal, $log, $scope,$document,userTemp) {
    var selt = this;
    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }

    var paramsPage = {
        pageNo:1,
        pageSize:6
    };
    $http.post("/company/query/filter", angular.toJson(paramsPage)).success(function (result) {
        selt.companyList = result.data;
    });



    $http.post("/company/person", angular.toJson(paramsPage)).success(function (result) {
        selt.personList = result.data;
    });


    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };
}]);
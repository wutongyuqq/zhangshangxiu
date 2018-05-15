app.controller('SocietyCtrl', ['$http','$uibModal','$log','$scope','$state','$stateParams', 'username',function($http,$uibModal, $log, $scope,$state,$stateParams,username) {
    var selt = this;

    if(username != null && username != '') {
        selt.user = {
            username : username
        };
    } else {
        selt.user = null;
    }
    this.logout = function() {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("username");
        username = "";
        selt.user = null;
        window.location.href="index.html#/home";
    };
}]);

app.controller('tenderIndex', ['$http', '$scope', 'utils', '$stateParams', '$state', 'userTemp', '$anchorScroll',"$location", "utils",function ($http, $scope, utils, $stateParams, $state, userTemp,$anchorScroll,$location, utils) {


    $scope.toProjectSelect=function(){
        $state.go("TenderDtail");
    }
    $scope.toHistoryRecord=function(){
        $state.go("TendListDetail");
    }
}]);


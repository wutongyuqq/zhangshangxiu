app.controller('tenderDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
    $scope.toGdListPage=function(){
        $state.go("Winbding");
    }
}]);



app.controller('WinbdingCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
    $scope.toPjkSelect=function(){
        $state.go("TenderSay");
    }
}]);
app.controller('TenderSayCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);


app.controller('TendListCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);

app.controller('TendListDetailCtrl', ['$http', '$scope', 'utils', '$stateParams', '$state','userTemp','$anchorScroll',"$location", function ($http, $scope, utils, $stateParams, $state,userTemp,$anchorScroll,$location) {
    var selt = this;
    $scope.showMore = 0;
    $scope.showSelectMore = 0;
    $scope.showMoreView = function (showMore) {
        $scope.showMore = showMore;
        $scope.showSelectMore = showMore;
    }
    $scope.showDetailPro = function () {
        $scope.showMore = 2;
    }
}]);
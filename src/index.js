app.controller('IndexCtrl', ['$http','$scope','$rootScope',function($http,$scope,$rootScope) {

        $scope.busy = true;

    //·�ɼ����¼�
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $scope.busy = true;
        });
    // stateChangeSuccess  ��ģ�������ɺ󴥷�
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.busy = false;
    })
    // $stateChangeError  ��ģ����������з�������ʱ����
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        $scope.busy = false;
    })
}]);

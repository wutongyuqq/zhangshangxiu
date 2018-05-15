app.controller('IndexCtrl', ['$http','$uibModal','$log','$document',function($http,$uibModal, $log, $document) {
	var selt = this;

	this.title = 'INDEX';
	this.content = 'This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.';

	this.getTest = function (comId){
		var params = {};
		$http.post("/company/"+comId,angular.toJson(params)).success(function (result) {
			selt.company=result.data;
			console.log("11111:"+result);
		});

	};

	this.setPage = function (pageNo) {
		var paramsPage = {
			keyWord:'湖南',
			pageNo:pageNo,
			pageSize:5
		};
		$http.post("/company/query",angular.toJson(paramsPage)).success(function (result) {
			console.log(result);//已经获取数据，在这里渲染啊
			selt.testList = result.data;
			selt.totalCount = result.total;
			selt.pageSize = result.pageSize;;
			selt.pageNo = result.pageNum;
		});
		$http.get("/company/filter",angular.toJson(paramsPage)).success(function (result) {
			selt.pbMode=result.pbMode;
			selt.companyQual=result.companyQual;
			selt.indestry=result.indestry;
			console.log(result);
		});
	};

	this.pageChanged = function() {
		var paramsPage = {
			keyWord:'湖南',
			pageNo:this.pageNo,
			pageSize:15
		};
		$log.log('Page changed to: ' + this.pageNo);
		$http.post("/company/query",angular.toJson(paramsPage)).success(function (result) {
			selt.testList = result.data;
			selt.totalCount = result.total;
			selt.pageSize = result.pageSize;;
			selt.pageNo = result.pageNum;
			console.log("22222:"+result);
		});


	};

	this.maxSize = 3;
	this.setPage(1);

	//1----------------------------------------------
	this.items = ['item1', 'item2', 'item3'];

	this.animationsEnabled = true;

	this.open = function (size, parentSelector) {
		var parentElem = parentSelector ?
			angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
			animation: selt.animationsEnabled,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceCtrl',
			controllerAs: '$ctrl',
			size: size,
			appendTo: parentElem,
			resolve: {
				items: function () {
					return selt.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			selt.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

}]);

app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
	var $ctrl = this;
	$ctrl.items = items;
	$ctrl.selected = {
		item: $ctrl.items[0]
	};

	$ctrl.ok = function () {
		$uibModalInstance.close($ctrl.selected.item);
		//window.location.reload();
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

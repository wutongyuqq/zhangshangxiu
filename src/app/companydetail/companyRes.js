app.controller('CompanyResCtrl', ['$http','$uibModal','$log','$scope','$document', 'userTemp','utils',function($http,$uibModal, $log, $scope,$document,userTemp,utils) {
	var self = this;
    if (userTemp != null) {
        self.user = angular.fromJson(userTemp);
    } else {
        self.user = null;
    }

    this.keyword =  "";
    var keyword = utils.getUrlVar('keyword');
    if(keyword){
        self.keyword = decodeURI(keyword);
    }

    this.projectList = [];
    this.busy = false;
    this.page = 1;

	$http.get("/company/filter").success(function (result) {
		var arr1 = [];
		var arr2 = [];
		if(result.code==1){
			for(var i=0;i<result.data.area.length;i++){
				var areaArr = result.data.area;
				if(i<18){
					arr1.push(areaArr[i]);
				}else{
					arr2.push(areaArr[i]);
				}
			}
			self.areaList = arr1;
			self.areaList2 = arr2;
			var arr1=[];
			var arr2=[];
			var companyQualList= result.data.companyQual;

			if(companyQualList!=null &&companyQualList.length>0){
				for(var i=0;i<companyQualList.length;i++){
					if(i<8){
						arr1.push(companyQualList[i]);
					}else{
						arr2.push(companyQualList[i]);
					}
				}
			}
			self.companyQualList = arr1;
			self.companyQualList2 = arr2;
		}
	});

	this.regisAddress = "";
    this.cancelFilter = function () {
        this.regisAddress = null;
        this.province = null;
        self.showProType = null;
        self.proType = null;
        self.setPage();
    };



	//----省市----
	this.clickProvince = function (area) {
		self.regisAddress = area.name;
		self.province = self.regisAddress
		self.setPage();
	};
	this.cancelArea = function () {
		this.regisAddress = "";
		this.province = "";
		self.setPage();
	};
    //---省市----end

    //更多
	this.morePro = false;
	this.moreProvince=function(morePro){
	    if(morePro){
            self.isCity = false;
        }else if(self.city!=""){
	        self.isCity = true;
        }
        self.morePro = !morePro;
	};

    self.showProType;
	//点击项目类别
    this.clickProType = function (proType) {
        self.proType = proType;
        self.showProType = self.proType;
        self.setPage();
    };


    this.cancleProType = function () {
        self.showProType = null;
        self.proType = null;
        self.setPage();
    }
	//--翻页---
	this.setPage = function () {
        self.projectList = [];
        self.busy = false;
        self.page = 1;
        self.nextPage();
	};

	this.nextPage = function () {
        if (self.busy) return;
        self.busy = true;
        var paramsPage = {
            proName:self.keyword == "" ? null : self.keyword,
            area:self.regisAddress == "" ? null : self.regisAddress,
            pageNo:self.page,
            proType:self.proType,
            pageSize:6,
            tabType:"project"
        };

        $http.post("/project/query", angular.toJson(paramsPage)).success(function (result) {
            var projectList = result.data;
            if(projectList!=null&&projectList.length>0){
                if(self.page==result.pageNum){
                    angular.forEach(projectList,function(project){
                        self.projectList.push(project);
                    });
                    self.totalCount = result.total;
                    self.pageSize = result.pageSize;;
                    self.pageNo = result.pageNum;
                    self.busy = false;
                    self.page += 1;
                    setContentHeight(result.data);
                }
            }else{
                self.totalCount = 0;
			}
        });
    };
	//------------翻页----end
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        self.user = null;
        window.location.href = "index.html#/home";
    };
}]);

function setContentHeight(dataList){
	var bdd_adver_header = document.getElementById("bdd_adver_header");
	if(dataList.length>2){
		bdd_adver_header.style.height="auto";
	}else{
		bdd_adver_header.style.height="500px";
	}

}





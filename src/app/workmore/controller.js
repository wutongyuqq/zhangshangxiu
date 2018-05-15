app.controller('WorkMoreCtrl', ['$http','$uibModal','$log','$scope','$state','locals','userTemp', '$anchorScroll',"$location",function($http,$uibModal, $log, $scope,$state,locals,userTemp,$anchorScroll,$location) {

    var selt = this;
    $location.hash();
    $anchorScroll();
    if (userTemp != null) {
        selt.user = angular.fromJson(userTemp);
    } else {
        selt.user = null;
    }

    this.type = '0';
    this.dataArray = [];
    this.busy = false;
    this.page = 1;

    this.nextPage = function () {
        if (selt.busy) return;
        selt.busy = true;
        var params = {
            pageNo:selt.page,
            pageSize:20,
            time:'',
            title:'',
            type:selt.type
        };

        $http.post("/notice/queryArticleList",angular.toJson(params)).success(function (result) {
            var dataArray = result.data;
            if(dataArray!=null&&selt.page==result.pageNum){
                angular.forEach(dataArray,function(item){
                    selt.dataArray.push(item);
                });
                selt.busy = false;
                selt.page += 1;
            }


        });
    };

    this.isCompany = true;

    this.toDiffMsg = function(type){
        selt.type=type;
        if(type=='0'){
            selt.isCompany = true;
        }else{
            selt.isCompany = false;
        }
        selt.dataArray = [];
        selt.busy = false;
        selt.page = 1;
        selt.nextPage();
    }
    this.toDetail = function(id){
        $state.go('workmoreDetail',{id:id});

    }
    this.logout = function () {
        sessionStorage.removeItem("X-TOKEN");
        sessionStorage.removeItem("userTemp");
        userTemp = null;
        selt.user = null;
        window.location.href = "index.html#/home";
    };

    $http.post("/foundation/listBannerImage",{type:0,showType:3}).success(function (result) {
        var imageList = result.data;
        selt.imageArr = imageList;
        initImage(imageList);
    });
}]);



function initImage(imageArr){
    setInterval(playImage(imageArr), 3000);//自动播放
}
//手写轮播图
function playImage(imageArr){
    //需求 实现一个 完整的轮播图
    //找人
    var box = document.getElementById("box");
    var screen = box.children[0];
    var ul = screen.children[0];
    var ol = screen.children[1];

    var imgWidth = screen.offsetWidth;
    //alert(imgWidth);
    //箭头
    var arr = document.getElementById("arr");
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    //1.动态生成结构
    //1.1根据图片数量动态生成按钮
    for (var i = 0; i < imageArr.length; i++) {
        var elem = imageArr[i];
        var ulLi = document.createElement("li");
        ulLi.innerHTML = '<li><a><img src="'+elem.imagesrc+'" width="1200" height="500"/></a></li>';
        ul.appendChild(ulLi);
        var li = document.createElement("li");
        li.innerHTML = i + 1;
        ol.appendChild(li);
    }
    var ulLis = ul.children;//所有的广告
    var olLis = ol.children;//所有的按钮
    olLis[0].className = "current";
    //1.2克隆第一张广告 放到最后
    var firstImg = ulLis[0].cloneNode(true);
    ul.appendChild(firstImg);
    //2.鼠标经过按钮
    //鼠标经过按钮 按钮排他 以动画的形式把ul移动到指定的位置
    for (var j = 0; j < olLis.length; j++) {
        olLis[j].index = j;
        olLis[j].onmouseover = function () {
            //排他
            //干掉所有人
            for (var k = 0; k < olLis.length; k++) {
                olLis[k].className = "";
            }
            //留下我自己
            this.className = "current";
            //以动画的形式把ul移动到指定的位置
            //目标 和 按钮索引有关 和 图片宽度有关 而且是负数
            var target = -this.index * imgWidth;
            animate(ul, target);
        };
    }
    //3.鼠标点击箭头
    //3.1鼠标经过盒子 显示箭头 鼠标离开盒子 隐藏箭头
    box.onmouseover = function () {
        arr.style.display = "block";
    };
    box.onmouseout = function () {
        arr.style.display = "none";
    };
    //3.2点击右箭头 以动画的形式把ul移动到指定的位置
    var pic = 0;//记录当前正在显示的图片的索引
    var square = 0;//记录当前正在亮起的按钮的索引
    right.onclick = function () {
        //先判断 如果是最后一个图片 先让ul瞬间跳会开始位置 然后索引也要归零
        if (pic === ulLis.length - 1) {
            ul.style.left = 0 + "px";
            pic = 0;//索引也要归零
        }
        pic++;//计算出将要显示的图片的索引
        //目标 和pic有关 和 图片宽度有关 而且是负数
        var target = -pic * imgWidth;
        animate(ul, target);
        //按钮也要跟着走
        if (square < olLis.length - 1) {
            square++;
        } else {
            square = 0;
        }
        //干掉所有人
        for (var i = 0; i < olLis.length; i++) {
            olLis[i].className = "";
        }
        //留下对应的
        olLis[square].className = "current";
    };
    left.onclick = function () {
        //先判断 如果是第一个图片 先让ul瞬间跳到最后的位置 然后索引也要到最后
        if (pic === 0) {
            ul.style.left = -(ulLis.length - 1) * imgWidth + "px";
            pic = ulLis.length - 1;//索引也要归零
        }
        pic--;//计算出将要显示的图片的索引
        //目标 和pic有关 和 图片宽度有关 而且是负数
        var target = -pic * imgWidth;
        animate(ul, target);
        //按钮也要跟着走
        if (square > 0) {
            square--;
        } else {
            square = olLis.length - 1;
        }
        //干掉所有人
        for (var i = 0; i < olLis.length; i++) {
            olLis[i].className = "";
        }
        //留下对应的
        olLis[square].className = "current";
    };

    setInterval(right.onclick, 4500);//自动播放

    function animate(obj, target) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var leader = obj.offsetLeft;
            var step = 15;
            step = leader < target ? step : -step;//step有了正负
            if (Math.abs(leader - target) >= Math.abs(step)) {
                leader = leader + step;
                obj.style.left = leader + "px";
            } else {
                obj.style.left = target + "px";//手动放到终点
                clearInterval(obj.timer);
            }
        }, 1);
    }
}






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
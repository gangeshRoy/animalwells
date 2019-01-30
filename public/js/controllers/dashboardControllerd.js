app.controller("animalTransportDashboard",
 function 
 (
     $rootScope,
     $scope,
     $http,
     $timeout,
     dataFactory,
     httpService,
     pendingRequests,
     $q,
     $sce
) {
    $scope.mainCategory = [];
    $scope.subCategory = [];
    $scope.activeText = 'Category Name';
    $scope.editCatg = false;
    $scope.editScatg = false;
    $scope.init();
    $scope.getTrevlingList = function(){
        alert();
        var dt ={};
        var url='http://localhost:8080/getListAnimal';
        console.log(url);
        dataFactory.getPostData(url, dt)
        .then(function (res) {
            console.log(res);
            res = res.data;
            if (res.error.errCode == 0) {
                $scope.mainCategory=res.result;
                console.log($scope.mainCategory);
            }
            else {
                common.msg(0, res.error.errMsg);
                $scope.getTrevlingList();
            }
        },
        function (error) {
            common.msg(0, common.getMsg(0));
            $scope.getTrevlingList();
        });

    };
    $scope.init = function(){
        $scope.getTrevlingList();
    };
});


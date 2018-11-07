'use strict';

angular.module('app')
.controller('equipmentForecastCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('equipmentForecastCtrl')
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getTrouble=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_trouble/troubleRemoval.json",
			async:true,
			success:function(result){
				console.log('成功:',result);
				$scope.trouble=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getTrouble();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.trouble.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
}]);
'use strict';
//设备控制节能
angular.module('app')
.controller('remoteSavingCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	console.log('remoteSavingCtrl');
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getRemoteSaving=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_powerSave/remoteSaving.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.remoteSaving=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
				
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getRemoteSaving();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.remoteSaving.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		console.log($scope.pageInfo.data);
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	
}]);
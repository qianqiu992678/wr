'use strict';

angular.module('app')
.controller('switchCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('switchCtrl');
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getSwitch=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_assessment/switch.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.switch=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
				
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getSwitch();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.switch.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
}]);
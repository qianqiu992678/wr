'use strict';

angular.module('app')
.controller('DNEventReportCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('DNEventReportCtrl');
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	
	$scope.getDNEventReport=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_power/DNEventReport.json",
			async:true,
			success:function(result){
				console.log(result);
				$scope.DNEventReport=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
			},
			error:function(result){
				toaster.pop('error','','获取DNEventReport.json失败！')
			}
		});
	}
	$scope.getDNEventReport();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.DNEventReport.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
}]);
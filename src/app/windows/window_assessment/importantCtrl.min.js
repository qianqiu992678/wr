'use strict';

angular.module('app')
.controller('importantCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('importantCtrl');
	
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getImportant=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_assessment/important.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.important=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getImportant();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.important.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
}]);
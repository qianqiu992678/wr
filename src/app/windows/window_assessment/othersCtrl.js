'use strict';

angular.module('app')
.controller('othersCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('othersCtrl');
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getOthers=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_assessment/others.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.others=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
			},
			error:function(data){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getOthers();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.others.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
}]);
'use strict';

angular.module('app')
.controller('allDataCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	
	$scope.yaoceDisplayFun=function(pageNum){
		$scope.yaoceDisplay=$rootScope.newCurrentData.yaoce.slice((pageNum-1)*10,pageNum*10+10);
	}
	$scope.yaoxinDisplayFun=function(pageNum){
		$scope.yaoxinDisplay=$rootScope.newCurrentData.yaoxin.slice((pageNum-1)*10,pageNum*10+10);
	}
	$scope.yaomaiDisplayFun=function(pageNum){
		$scope.yaomaiDisplay=$rootScope.newCurrentData.yaomai.slice((pageNum-1)*10,pageNum*10+10);
	}
	$scope.yaocePageNum=0;
	$scope.$watch('newCurrentData', function() {
        if($rootScope.newCurrentData){
        	//$scope.yaomaiDisplayFun(++$scope.yaocePageNum)
        	//$scope.yaoxinDisplayFun(1);
        	//$scope.yaomaiDisplayFun(1);
        }
    });
	
	$scope.mouseWheelFun=function(e){
		let scrollPosition={};
		scrollPosition.top=$(e.target).parents('tbody.yaoceTbody').scrollTop()
		scrollPosition.bottom=($(e.target).height()+3)*($(e.target).parents('tbody.yaoceTbody').children('tr').length)-scrollPosition.top-$(e.target).parents('.yaoceTbody').height();
		
	}
}]);
'use strict';

angular.module('app')
.controller('equipmentSelectItemCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('equipmentSelectItemCtrl');
	$.ajax({
		type:"get",
		url:"src/app/windows/window_assessment/others.json",
		async:true,
		success:function(result){
			$scope.others=result;
		},
		error:function(data){
			toaster.pop('error','','失败')
		}
	});
	$.ajax({
		type:"get",
		url:"src/app/windows/window_assessment/important.json",
		async:true,
		success:function(result){
			$scope.important=result;
		},
		error:function(data){
			toaster.pop('error','','失败')
		}
	});
	$.ajax({
		type:"get",
		url:"src/app/windows/window_assessment/switch.json",
		async:true,
		success:function(result){
			$scope.switch=result;
		},
		error:function(data){
			toaster.pop('error','','失败')
		}
	});
}]);
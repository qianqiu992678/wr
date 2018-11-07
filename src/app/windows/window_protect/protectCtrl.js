'use strict';

angular.module('app')
.controller('protectCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	
	if(global_level>7){
		console.log('protectCtrl');
				}
	//$scope.currentUrl=$location.url().slice(9);
	$scope.urlChange=function(url){
		//$scope.currentUrl=url;
		$state.go('main.protect.'+url);
	}
}]);
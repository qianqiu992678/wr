'use strict';

angular.module('app')
.controller('diagramCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	//$scope.currentUrl=$location.url().slice(9);
	$scope.urlChange=function(url){
		//$scope.currentUrl=url;
		$state.go('main.diagram.'+url);
	}
	
}]);
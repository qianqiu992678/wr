'use strict';

angular.module('app')
.controller('yaokongCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('yaokongCtrl');
	$scope.yaokongOpt=function(str,address){
		yxRequest.send('post',yxIp.requestIp+'sc/set_controller',
			{address:address,type:str},
			function(result){
				toaster.pop('success','','操作成功');
			},function(data){
				toaster.pop('error','',data.msg)
			}
		);
	}
}]);
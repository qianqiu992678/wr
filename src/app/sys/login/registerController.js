'use strict';

angular.module('app')
	.controller('registerController',[ '$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
        $scope.user = {};
        $("[data-toggle='tooltip']").tooltip();
		$scope.login = function () {
			$.ajax({
				type: (qson ? 'GET' : 'POST'),
				url : (qson ? 'test/json/login.json': '/login'),
				data: $scope.user
			}).then(function(result) {
				if (result.httpCode == 200) {
					//$state.go('main.sys.user.list');
					$state.go("main.cms.routeManage.orderRoute");
					
				} else {
					$scope.msg = result.msg;
					$rootScope.$apply();
				}
			});
		}
} ]);
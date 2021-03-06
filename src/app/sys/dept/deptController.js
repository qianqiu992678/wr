'use strict';

angular.module('app')
	.controller('deptController', [ '$rootScope', '$scope', '$http', '$state',
	                                function($rootScope, $scope, $http, $state) {
		$scope.title = '部门管理';
        $scope.param = { };
        $scope.loading = false;
        
		$scope.search = function () {
	        $scope.loading = true;
			$.ajax({
				url : '/dept/read/list',
				data: $scope.param
			}).then(function(result) {
		        $scope.loading = false;
				if (result.httpCode == 200) {
					$scope.pageInfo = result.data;
				} else {
					$scope.msg = result.msg;
				}
				$scope.$apply();
			});
		}
		
		$scope.search();
		$scope.clearSearch = function() {
			$scope.param.keyword= null;
			$scope.search();
		}
		
		$scope.disableItem = function(id, enable) {
			
		}
		
		// 翻页
        $scope.pagination = function (page) {
            $scope.param.pageNum=page;
            $scope.search();
        };
} ]);
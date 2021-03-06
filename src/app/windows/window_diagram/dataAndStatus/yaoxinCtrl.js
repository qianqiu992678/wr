'use strict';

angular.module('app')
.controller('yaoxinCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	if(!$rootScope.newCurrentData){
		$state.go('main.diagram.SJYZT.allData');return;
	}
	
	$rootScope.classname=$stateParams.classname;
	$scope.classname=$stateParams.classname;
	$scope.openItems={}
	$rootScope.yaoxin=function(){
		switch ($stateParams.classname){
			case 'yaoce':
			$scope.classList=$rootScope.newCurrentData.YaoCe;
				break;
			case 'yaoxin':
			$scope.classList=$rootScope.newCurrentData.YaoXin;
				break;
			case 'yaomai':
			$scope.classList=$rootScope.newCurrentData.YaoMai;
				break;
			default:
				break;
		}
		//$rootScope.listSort($rootScope.sortKey,$scope.classList,1);
		if(global_level>4){
				console.log('$scope.classList:',$scope.classList);	
		}
		angular.forEach($scope.classList,function(v){
			v.show=$scope.openItems[v.title]
		})
		if($scope.sortKey){
			//$scope.listSort($scope.sortKey,$scope.classList,1);
			
			//$scope.sortKey=sortKey;
			if($scope.sortKey=='title'){
				$rootScope.listSort($scope.sortKey,$scope.classList,1)
			}else{
				for(let i=0;i<$scope.classList.length;i++){
					$rootScope.listSort($scope.sortKey,$scope.classList[i].data,1);
					if(global_level>4){
						console.log($scope.classList[i]);
					}
					
				}
			}
		}
	}
	$rootScope.yaoxin();
	
	$scope.openItemRecord=function(item){
		
		$scope.openItems[item.title]=!$scope.openItems[item.title];
		item.show=$scope.openItems[item.title];
	}
	//排序
	$scope.listSort=function(sortKey,arr,autoSort){
		$scope.sortKey=sortKey;
		if(sortKey=='title'){
			$rootScope.listSort(sortKey,arr,autoSort)
		}else{
			angular.forEach($scope.classList,function(v){
				$rootScope.listSort(sortKey,v.data,autoSort);
			})
		}
	}
}]);
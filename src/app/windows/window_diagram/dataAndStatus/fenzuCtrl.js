'use strict';

angular.module('app')
.controller('fenzuCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	if(global_level>7){
		console.log('fenzuCtrl')			
				}
	if(global_level>4){
		console.log('参数：',$stateParams.title,$stateParams.classname);			
			}
	$rootScope.classname=$stateParams.classname;
	$rootScope.fenzu=function(){
		switch ($stateParams.classname){
			case 'yaoce':
				$scope.groupList=$rootScope.newCurrentData.YaoCe.filter(function(v){
					return v.title==$stateParams.title
				});
				break;
			case 'yaoxin':
				$scope.groupList=$rootScope.newCurrentData.YaoXin.filter(function(v){
					return v.title==$stateParams.title
				});
				break;
			case 'yaomai':
				$scope.groupList=$rootScope.newCurrentData.YaoMai.filter(function(v){
					return v.title==$stateParams.title
				});
				break;
			default:
				break;
		}
	}
	$rootScope.fenzu()
	if(global_level>4){
		console.log($scope.groupList)			
				}
	
	$scope.sortNum=1;
	$rootScope.fenzuListSort=function(key,autoSort){
		if(!key)return;
		$rootScope.sortKey=key;
		if(!autoSort)$scope.sortNum*=-1;
		$scope.groupList.sort($scope.cmp);
	}	
	$scope.cmp=function(obj1,obj2){
		if(obj2.data[0][$scope.sortKey]>obj1.data[0][$scope.sortKey]){
			return 1*$scope.sortNum
		}else if(obj2.data[0][$scope.sortKey]<obj1.data[0][$scope.sortKey]){
			return -1*$scope.sortNum
		}else{
			return 0
		}
	}
}]);
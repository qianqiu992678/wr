'use strict';

angular.module('app')
.controller('dz_switchListCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	//获取开关量监测点列表
	$scope.getSwitchList=function(){
		yxRequest.send('get',yxIp.requestIp+'dz/kpoint',
			{},
			function(result){
				if(global_level>4){console.log('获取开关量监测点列表成功',result);}
				//$scope.dzSwitchList=result.data;
				$rootScope.dzMsgObj.kpoint=result.data;
				$scope.pageInfo.total=result.data.length;
				$scope.pagination(1);
				
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:'获取开关量监测点定值列表失败：'+JSON.stringify(data),time:new Date()})
				if(global_level>1){
					console.log('获取开关量监测点列表失败',data);	
					}
				
				toaster.pop('error','',data.msg)
			}
		);
	}
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$rootScope.dzMsgObj.kpoint.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	$rootScope.getSwitchListMsgFun=function(){
		if($rootScope.dzMsgObj.kpoint.length==0){
			$scope.getSwitchList();
		}else{
			$scope.pageInfo.total=$rootScope.dzMsgObj.kpoint.length;
			$scope.pagination(1);
		}
	}
	$rootScope.getSwitchListMsgFun();	
	
	
	$scope.dzSwitchItemConfirm=function(item){
		for(let i=0;i<$rootScope.dzUpdateMsg.kpoint.length;i++){
			if($rootScope.dzUpdateMsg.kpoint[i].DigitalID==item.DigitalID){
				item.changed=true;
				$rootScope.dzUpdateMsg.kpoint[i]=item;
				return;
			}
		}
		item.changed=true;
		$rootScope.dzUpdateMsg.kpoint.push(item)
	}
}]);
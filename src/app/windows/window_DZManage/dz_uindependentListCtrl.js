'use strict';
angular.module('app')
.controller('dz_uindependentListCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	//获取独立监测点列表
	$scope.getIndependentList=function(){
		yxRequest.send('get',yxIp.requestIp+'dz/iUpoint',
			{},
			function(result){
				//$scope.dzIndependentList=result;
				angular.forEach(result.data,function(item){
					for(var k in item){
						if(typeof item[k] == 'number'){
							if(item[k]<0.00001){
								item[k]=0;
							}
						}
					}
				})
				$rootScope.dzMsgObj.iupoint=result.data;
				$scope.pageInfo.total=result.data.length;
				$scope.pagination(1);
			},function(data){
				console.log(data)
				
				if(global_level>1){console.log('获取独立监测点列表失败',data);}
				
				toaster.pop('error','',data.msg);
				yxLocalStorage.arrAdd({type:'error',msg:'获取独立监测点列表失败'+JSON.stringify(data),time:new Date()})
			}
		);
	}
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$rootScope.dzMsgObj.iupoint.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	$rootScope.getIndependentListMsgFun=function(){
		if($rootScope.dzMsgObj.iupoint.length==0){
			$scope.getIndependentList();
		}else{
			$scope.pageInfo.total=$rootScope.dzMsgObj.iupoint.length;
			$scope.pagination(1);
		}
	}
	$rootScope.getIndependentListMsgFun();
		
	
	//独立监测点单项保存
	$scope.dzIndepedentConfirm=function(item){
		for(let i=0;i<$rootScope.dzUpdateMsg.iupoint.length;i++){
			if($rootScope.dzUpdateMsg.iupoint[i].AnalogID==item.AnalogID){
				item.changed=true;
				$rootScope.dzUpdateMsg.iupoint[i]=item;
				return;
			}
		}
		item.changed=true;
		$rootScope.dzUpdateMsg.iupoint.push(item);
	}
	
}]);



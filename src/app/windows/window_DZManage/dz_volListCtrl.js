'use strict';

angular.module('app')
.controller('dz_volListCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	$scope.getVolDZList=function(){
		yxRequest.send('get',yxIp.requestIp+'dz/upoint',
			{},
			function(result){
				if(global_level>4){console.log('电压定值列表成功',result);}
				$rootScope.dzMsgObj.upoint=result.data;
				//$scope.dz_volList=result;
				$scope.pageInfo.total=result.data.length;
				$scope.pagination(1);
				$rootScope.volPosIDs=result.data;
			},function(result){
				yxLocalStorage.arrAdd({type:'error',msg:'获取电压监测点列表定值失败：'+JSON.stringify(result),time:new Date()})
				if(global_level>1){console.log('获取电压监测点列表失败',result);}
				toaster.pop('error','',result.msg)
			}
		);
	}
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$rootScope.dzMsgObj.upoint.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	$rootScope.getVolListMsgFun=function(){
		if($rootScope.dzMsgObj.upoint.length==0){
			$scope.getVolDZList();
		}else{
			$scope.pageInfo.total=$rootScope.dzMsgObj.upoint.length;
			$scope.pagination(1);
		}
	}
	$rootScope.getVolListMsgFun();
		
	
	//电压定值详情
	$scope.dz_vol_get=function(item){
		if(!item.data){
			$scope.PosID=item.PosID;
			yxRequest.send('post',yxIp.requestIp+'dz/get_upoint_info',
				{data:{PosID:item.PosID}},
				function(result){
					$scope.volDZEdit=true;
					for(var k in result.data){
						if(typeof result.data[k] == 'number'){
							if(result.data[k]<0.00001){
								result.data[k]=0;
							}
						}
					}
					//$scope.volZDDetail=result.data;
					item.data=result.data;
					$scope.volZDDetail=item;
				},function(data){
					yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
					if(global_level>1){console.log('获取电压监定值失败',data);}
					toaster.pop('error','',data.msg)
				}
			);
		}else{
			$scope.volDZEdit=true;
			$scope.volZDDetail=item;
		}
	}
	//电压详情保存
	$scope.volMsgConfirm=function(){
		for(let i=0;i<$rootScope.dzUpdateMsg.upoint.length;i++){
			if($rootScope.dzUpdateMsg.upoint[i].PosID==$scope.volZDDetail.data.PosID){
				$scope.volZDDetail.changed=true;
				$rootScope.dzUpdateMsg.upoint[i]=$scope.volZDDetail.data;
				$scope.volDZEdit=false;
				return;
			}
		}
		$scope.volZDDetail.changed=true;
		$rootScope.dzUpdateMsg.upoint.push($scope.volZDDetail.data);
		$scope.volDZEdit=false;
	}
	
}]);
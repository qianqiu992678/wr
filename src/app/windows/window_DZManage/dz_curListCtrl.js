'use strict';

angular.module('app')
.controller('dz_curListCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
$scope.pageInfo={};
$scope.pageInfo.row=10;
$scope.getCurDZList=function(){
	yxRequest.send('get',yxIp.requestIp+'dz/cpoint',
		{},
		function(result){
			if(global_level>4){console.log('获取电流监测点列表成功',result);}
			$rootScope.dzMsgObj.cpoint=result.data;
			$scope.pageInfo.total=result.data.length;
			//$scope.dz_curList=result;
			$rootScope.curPosIDs=result.data;
			$scope.pagination(1);
		},function(data){
			yxLocalStorage.arrAdd({type:'error',msg:'获取电流监测点定值失败'+JSON.stringify(data),time:new Date()})
			if(global_level>1){console.log('获取电流监测点列表失败',data);}
			toaster.pop('error','',data.msg)
		}
	);
}
$scope.pagination=function(pageNum){
	$scope.pageInfo.data=$rootScope.dzMsgObj.cpoint.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
	$scope.pageInfo.pageNum=pageNum;
	$scope.pageInfo.size=$scope.pageInfo.data.length;
}
$rootScope.getCurListMsgFun=function(){
	if($rootScope.dzMsgObj.cpoint.length==0){
		$scope.getCurDZList();
	}else{
		$scope.pageInfo.total=$rootScope.dzMsgObj.cpoint.length;
		$scope.pagination(1);
	}
}
$rootScope.getCurListMsgFun();




$scope.curDZEditFun=function(item){
	if(!item.data){
		$scope.PosID=item.PosID;
		yxRequest.send('post',yxIp.requestIp+'dz/get_cpoint_info',
			{data: {PosID:$scope.PosID}},
			function(result){
				$scope.curDZEdit=true;
				for(var k in result.data){
					if(typeof result.data[k] == 'number'){
						if(result.data[k]<0.00001){
							result.data[k]=0;
						}
					}
				}
				item.data=result.data;
				$scope.curZDDetail=item;
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:'获取电流监测点定值失败：'+JSON.stringify(data),time:new Date()})
				if(global_level>1){
						console.log('获取电流监测点信息失败',data);
					}
				
				toaster.pop('error','',data.msg)
			}
		);
	}else{
		$scope.curDZEdit=true;
		$scope.curZDDetail=item;
	}	
}
//电流定值信息保存
$scope.dZCurConfirm=function(){
	for(let i=0;i<$rootScope.dzUpdateMsg.cpoint.length;i++){
		if($rootScope.dzUpdateMsg.cpoint[i].PosID==$scope.curZDDetail.data.PosID){
			$scope.curZDDetail.changed=true;
			$rootScope.dzUpdateMsg.cpoint[i]=$scope.curZDDetail.data;
			$scope.curDZEdit=false;
			return;
		}
	}
	$scope.curZDDetail.changed=true;
	$rootScope.dzUpdateMsg.cpoint.push($scope.curZDDetail.data);
	$scope.curDZEdit=false;
}

}]);
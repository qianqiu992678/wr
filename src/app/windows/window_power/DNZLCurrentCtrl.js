'use strict';

angular.module('app')
.controller('DNZLCurrentCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	
	if(global_level>7){
		console.log('DNZLCurrentCtrl');
				}
	//获取电能质量数据词典
	if(!$rootScope.dnzlDic){
		$.ajax({
			type:"get",
			url:"test/json/dnzlConnector.json",
			async:true,
			success:function(data){
				if(global_level>4){
		console.log(data);
				}
				
				$rootScope.dnzlDic=data;
			},
			error:function(data){
				if(global_level>1){
		console.log(data)
				}
				
			}
		});
	}
	$scope.param={};
	//获取当前电能质量数据
	$scope.getCurrentPowerQuality=function(){
		$scope.param.PosID=$scope.msg.PosID;
		if($scope.msg.unit=='V'){
			$scope.param.type=1;
		}else if($scope.msg.unit=='A'){
			$scope.param.type=2;
		}
		$scope.searching=true;
		$scope.currentDNData=[];
		yxRequest.send('post',yxIp.requestIp+'ce/get_ce_now',
			$scope.param,
			function(result){
				$scope.searching=false;
				if(global_level>4){
		console.log('获取当前电能质量数据成功',result);
				}
				
				
				angular.forEach(result.data,function(v,k){
					var obj={}
					if($scope.param.type==2){
						if(k!='m_XBA'&&k!='m_XBB'&&k!='m_XBC'&&k!='m_SumP'&&k!='m_SumQ'&&k!='m_QA'&&k!='m_QB'&&k!='m_QC'&&k!='m_PA'&&k!='m_PB'&&k!='m_PC'){
							obj.key=$rootScope.dnzlDic.cur.filter(function(v1){
								return v1.en==k 
							})[0].ch;
							
							obj.value=v;
						}else{
							for(let i=0;i<v.length;i++){
								obj={}
								switch (k){
									case 'm_XBA':
									obj.value=v[i];
									if(i==0){
										obj.key=`A相基波`;
									}else{
										obj.key=`A相${i+1}次谐波`;
									}
									break;
									case 'm_XBB':
									obj.value=v[i];
									if(i==0){
										obj.key=`B相基波`;
									}else{
										obj.key=`B相${i+1}次谐波`;
									}
									break;
									case 'm_XBC':
									obj.value=v[i];
									if(i==0){
										obj.key=`C相基波`;
									}else{
										obj.key=`C相${i+1}次谐波`;
									}
									break;
									
									
									case 'm_PA':
									obj.value=v[i];
									obj.key=`A相${i+1}次谐波有功功率`
									break;
									case 'm_PB':
									obj.value=v[i];
									obj.key=`B相${i+1}次谐波有功功率`
									break;
									case 'm_PC':
									obj.value=v[i];
									obj.key=`C相${i+1}次谐波有功功率`
									break;
									
									case 'm_QA':
									obj.value=v[i];
									obj.key=`A相${i+1}次谐波无功功率`
									break;
									case 'm_QB':
									obj.value=v[i];
									obj.key=`B相${i+1}次谐波无功功率`
									break;
									case 'm_QC':
									obj.value=v[i];
									obj.key=`C相${i+1}次谐波无功功率`
									break;
									
									case 'm_SumP':
									obj.value=v[i];
									obj.key=`三相谐波${i+1}次总有功功率`
									break;
									case 'm_SumQ':
									obj.value=v[i];
									obj.key=`三相谐波${i+1}次总无功功率`
									break;
									
									default:
									break;
								}
								if(!$.isEmptyObject(obj))$scope.currentDNData.push(obj);
								obj={}
							}
							
						}
						
					}else if($scope.param.type==1){
						if(k!='m_XBA'&&k!='m_XBB'&&k!='m_XBC'){
							let arr=$rootScope.dnzlDic.vol.filter(function(v1){
								return v1.en==k 
							});
							if(arr.length==1){
								obj.key=arr[0].ch;
								obj.value=v;
							}else{
								yxLocalStorage.arrAdd({type:'warning',msg:'电能质量当前数据有一个找不到的：'+k+'type:'+1,time:new Date()})
							}
							
						}else{
							for(let i=0;i<v.length;i++){
								obj.value=v[i];
								if(k=='m_XBA'){
									if(i==0){
										obj.key=`A相基波`
									}else{
										obj.key=`A相${i+1}次谐波`
									}
								}else if(k=='m_XBB'){
									if(i==0){
										obj.key=`B相基波`
									}else{
										obj.key=`B相${i+1}次谐波`
									}
								}else if(k=='m_XBC'){
									if(i==0){
										obj.key=`C相基波`
									}else{
										obj.key=`C相${i+1}次谐波`
									}
								}else{
									continue;
								}
								$scope.currentDNData.push(obj);
								obj={}
							}
						}
					}
					
					if(!$.isEmptyObject(obj))$scope.currentDNData.push(obj);
				})
//				for(let i=0;i<50;i++){
//					$scope.currentDNData.push({key:`B相${$scope.currentDNData}次谐波, [0]为基波`})
//				}
if(global_level>4){
		console.log($scope.currentDNData)
				}
				
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>1){
		console.log('获取当前电能质量数据失败',data);
				}
				
				toaster.pop('error','',data.msg)
			}
		)
	}
	//$scope.getCurrentPowerQuality();
	//获取posIDs
	if(!$rootScope.volPosIDs){
		$.ajax({
			type:"get",
			url:yxIp.requestIp+'dz/upoint',
			async:false,
			success:function(data){
				$rootScope.volPosIDs=data.data;
			},error:function(data){
				toaster.pop('error','',data.msg)
			}
		});
	}
	if(!$rootScope.curPosIDs){
		$.ajax({
			type:"get",
			url:yxIp.requestIp+'dz/cpoint',
			async:false,
			success:function(data){
				$rootScope.curPosIDs=data.data;
			},error:function(data){
				toaster.pop('error','',data.msg)
			}
		});
	}
	if($rootScope.volPosIDs){
		$rootScope.posIDs=$rootScope.volPosIDs.concat($rootScope.curPosIDs);
	}
	//导出
	$scope.listExport=function(){
		let obj={title:['名称','当前值'],data:[]};
		angular.forEach($scope.currentDNData,function(v,k){
			let subArr=[];
			subArr.push(v.key,v.value);
			obj.data.push(subArr)
		})
		$rootScope.listExport(obj)
	}
}]);
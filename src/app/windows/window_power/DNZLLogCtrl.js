'use strict';
angular.module('app')
.controller('DNZLLogCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {

	$('.superWidthTable.yx-table').on('scroll',function(e){
		$('.superWidthTable.yx-table tr>td:first-child').css({"left":$(e.target).context.scrollLeft});
	})
	//获取电能质量数据词典
	if(!$rootScope.dnzlDic){
		$.ajax({
			type:"get",
			url:"test/json/dnzlConnector.json",
			async:false,
			success:function(data){
				if(global_level>4){console.log(data);}
				$rootScope.dnzlDic=data;
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:JSON.stringify(data),time:new Date()})
				if(global_level>1){console.log(data)}
			}
		});
	}
	$(".dataPicker_startTime").datetimepicker({
		timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        secondText: '秒',
        currentText: '现在',
        closeText: '完成',
        showSecond: true, //显示秒 
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss' //格式化时间  
	});
	$(".dataPicker_endTime").datetimepicker({
		timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        secondText: '秒',
        currentText: '现在',
        closeText: '完成',
        showSecond: true, //显示秒 
        dateFormat: 'yy-mm-dd',
        timeFormat: 'HH:mm:ss' //格式化时间  
	});
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
		$scope.posIDs=$rootScope.volPosIDs.concat($rootScope.curPosIDs);
	}
	if($rootScope.dnzllogParam.posids){
		$scope.msg=$rootScope.dnzllogParam.posids;
	}
	
	if(!$scope.msg){$scope.msg=$scope.posIDs[0]};
	
	//默认查询24小时数据
	if($rootScope.dnzlLogStart){
		$rootScope.dnzllogParam.start_time=$rootScope.dnzlLogStart;
		$rootScope.dnzllogParam.end_time=$rootScope.dnzlLogEnd;
	}else{
		$rootScope.defaultTime($rootScope.dnzllogParam,1);
	}
	$scope.pageInfo={};
	$scope.pageInfo.row=10;
	//获取电能质量历史数据
	$scope.getPowerQualityLog=function(){
		if(typeof $scope.msg == 'string'){$scope.msg=JSON.parse($scope.msg);}
		if(global_level>4){console.log($scope.msg)};
		//if(!$scope.msg){$scope.msg=$scope.posIDs[0]};
		if(!$scope.msg)return;
		$rootScope.dnzllogParam.PosID=$scope.msg.PosID;
		$rootScope.dnzllogParam.posids=$scope.msg;
		if($scope.msg.unit=='V'){
			$rootScope.dnzllogParam.type=1;
			//$scope.dataDic=$rootScope.dnzlDic.vol;
			$scope.titleListParam=$rootScope.dnzlDic.vol
		}else if($scope.msg.unit=='A'){
			$rootScope.dnzllogParam.type=2;
			$scope.titleListParam=$rootScope.dnzlDic.cur;
		}
		$scope.searching=true;
		yxRequest.send('post',yxIp.requestIp+'dn/get_zl_history',
			$rootScope.dnzllogParam,
			function(result){
				$rootScope.dnzlLogStart=$rootScope.dnzllogParam.start_time;
				$rootScope.dnzlLogEnd=$rootScope.dnzllogParam.end_time;
				$scope.searching=false;
				if(global_level>4){console.log('获取电能质量历史数据成功',result);}
				
				
				$rootScope.titleList=$scope.titleListParam.filter(function(v){
					return v.en!='m_XBA'&&v.en!='m_XBB'&&v.en!='m_XBC'&&v.en!='m_PA'&&v.en!='m_PB'&&v.en!='m_PC'&&v.en!='m_QA'&&v.en!='m_QB'&&v.en!='m_QC'&&v.en!='m_SumP'&&v.en!='m_SumQ'
				});
				if($rootScope.dnzllogParam.type==2){
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_PA'+i,ch:`A相${i}次谐波有功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_PB'+i,ch:`B相${i}次谐波有功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_PC'+i,ch:`C相${i}次谐波有功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_QA'+i,ch:`A相${i}次谐波无功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_QB'+i,ch:`A相${i}次谐波无功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_QC'+i,ch:`A相${i}次谐波无功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_SumP'+i,ch:`三相${i}次谐波总有功功率`});
					}
					for(let i=1;i<6;i++){
						$rootScope.titleList.push({en:'m_SumQ'+i,ch:`三相${i}次谐波总无功功率`});
					}
				}
				for(let i=1;i<51;i++){
					$rootScope.titleList.push({en:'m_XBA'+i,ch:`A相${i}次谐波`});/*, [0]为基波*/
				}
				for(let i=1;i<51;i++){
					$rootScope.titleList.push({en:'m_XBB'+i,ch:`B相${i}次谐波`});/*, [0]为基波*/
				}
				for(let i=1;i<51;i++){
					$rootScope.titleList.push({en:'m_XBC'+i,ch:`C相${i}次谐波`});/*, [0]为基波*/
				}
				
				$rootScope.dnzlLogData=[];
				angular.forEach(result.data,function(v,k){
					let arr=[];
					angular.forEach($rootScope.titleList,function(v1,k1){
						let obj={};
						let str4=v1.en.substring(0,4);
						let str5=v1.en.substring(0,5);
						let str6=v1.en.substring(0,6);
						if(str4!='m_XB'&&str4!='m_PA'&&str4!='m_PB'&&str4!='m_PC'&&str4!='m_QA'&&str4!='m_QB'&&str4!='m_QC'&&str6!='m_SumP'&&str6!='m_SumQ'){
							obj.value=v[v1.en];
							obj.cName=v1.ch
							arr.push(obj)
						}else{
							if(str5=='m_XBA'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(5,v1.length))-1;
								obj.value=v['m_XBA'][n];
								arr.push(obj)
							}
							if(str5=='m_XBB'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(5,v1.length))-1;
								obj.value=v['m_XBB'][n];
								arr.push(obj)
							}
							if(str5=='m_XBC'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(5,v1.length))-1;
								obj.value=v['m_XBC'][n];
								arr.push(obj)
							}
							
							if(str4=='m_PA'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_PA'][n];
								arr.push(obj)
							}
							if(str4=='m_PB'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_PB'][n];
								arr.push(obj)
							}
							if(str4=='m_PC'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_PC'][n];
								arr.push(obj)
							}
							
							if(str4=='m_QA'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_QA'][n];
								arr.push(obj)
							}
							if(str4=='m_QB'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_QB'][n];
								arr.push(obj)
							}
							if(str4=='m_QC'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(4,v1.length))-1;
								obj.value=v['m_QC'][n];
								arr.push(obj)
							}
							
							if(str6=='m_SumP'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(6,v1.length))-1;
								obj.value=v['m_SumP'][n];
								arr.push(obj)
							}
							if(str6=='m_SumQ'){
								obj.cName=v1.ch;
								let n=parseInt(v1.en.substring(6,v1.length))-1;
								obj.value=v['m_SumQ'][n];
								arr.push(obj)
							}
							
						}
					})
					if(arr.length>0)$rootScope.dnzlLogData.push(arr)
				})
				if(global_level>4){console.log('处理后的数据：',$rootScope.dnzlLogData.toString());}
				
				$scope.pageInfo.total=$rootScope.dnzlLogData.length;
				$scope.pagination(1);
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:'获取电能质量历史数据失败：'+JSON.stringify(data),time:new Date()})
				if(global_level>1){console.log('获取电能质量历史数据失败',data);}
				
				toaster.pop('error','',data.msg)
			}
		)
	}
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.dnzlLogData.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	if(!$rootScope.dnzlLogData){
		$scope.getPowerQualityLog();
	}else{
		$scope.pageInfo.total=$rootScope.dnzlLogData.length;
		$scope.pagination(1);
	}
		
	
	
	//快速查询
//	$scope.quickSearch=function(){
//		$rootScope.defaultTime($rootScope.dnzllogParam,$scope.days);
//	}
	//导出
	$scope.listExport=function(){
		let titleArr=[];
		angular.forEach($rootScope.titleList,function(v){
			titleArr.push(v.ch)
		})
		let obj={title:titleArr,data:[]};
		angular.forEach($rootScope.dnzlLogData,function(v,k){
			let subArr=[];
			for(let i=0;i<v.length;i++){
				subArr.push(v[i].value);
			}
			obj.data.push(subArr)
		})
		$rootScope.listExport(obj)
	}
}]);
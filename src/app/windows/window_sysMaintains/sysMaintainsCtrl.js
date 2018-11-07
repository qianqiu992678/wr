'use strict';
angular.module('app')
.controller('sysMaintainsCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('sysMaintainsCtrl')
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
	
	$scope.param={};
	//默认查询24小时数据
	$rootScope.defaultTime($scope.param,1);
	//获取告警管理列表
	$scope.getAlarmList=function(){
		$scope.searching=true;
		yxRequest.send('post',yxIp.requestIp+'gl/get_alarm',
			$scope.param,
			function(result){
				$scope.searching=false;
				if(global_level>4){
					console.log('获取告警管理列表成功',result);
				}
				$scope.alarmList=result;
				angular.forEach($scope.alarmList.data,function(v,k){
					let res=$rootScope.dictionaryMsg.YaoXin.filter(function(v1,k1){
						return v1.Address==v.Address
					});
					
					if(res.length==1){
						v.alarmPoint=res[0].Description
					}else{
						yxLocalStorage.arrAdd({type:'error',msg:'告警管理列表获取的address与点表不对应或对应多个，address:'+v.Address,time:new Date()});
						//console.log('点表不对应',v.Address,$rootScope.dictionaryMsg.YaoXin)
					}
					let troubleArr = $scope.troubleModal.filter(function(v1){
						return v1.address==v.Address;
					});
					v.recommendType = troubleArr.length?troubleArr[0].dealType:"暂无推荐";
					
				})
				$scope.pageInfo={};
				$scope.pageInfo.row=10;
				$scope.pageInfo.total=$scope.alarmList.data.length;
				$scope.pagination(1)
				if($scope.alarmList.data.length==1000){
					toaster.pop('warning','','最多查询1000条数据，可能会有数据丢失，请缩小日期区间！')
				}
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>1){
					console.log('获取告警管理列表失败',data);
				}
				toaster.pop('error','',data.msg)
			}
		);
	}
	$scope.getAlarmList();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.alarmList.data.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	//快速查询
	$scope.quickSearch=function(){
		$rootScope.defaultTime($scope.param,$scope.days);
		$('.dataPicker_startTime').datetimepicker('setDate', ($scope.param.start_time));
		$('.dataPicker_endTime').datetimepicker('setDate', ($scope.param.end_time) );
	}
	//报警批量处理
	$scope.alarmManageFun=function(){}
	//导出
	$scope.listExport=function(){
		let obj={title:['动作时间','事件信息','状态','时长（ms）','数值'],data:[]};
		angular.forEach($scope.alarmList.data,function(v,k){
			let subArr=[];
			subArr.push(v.Time,v.alarmPoint,v.State,v.Duration,v.WarnValue);
			obj.data.push(subArr)
		})
		$rootScope.listExport(obj)
	}
	/**
	 * 请求事故模型
	 * 
	 * */
	$scope.getTroubleModal=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_sysMaintains/sysMaintains.json",
			async:true,
			success:function(result){
				$scope.troubleModal = result;
				
			},
			error:function(result){
				toaster.pop('error','','error')
			},
		});
	}
	$scope.getTroubleModal();
}]);
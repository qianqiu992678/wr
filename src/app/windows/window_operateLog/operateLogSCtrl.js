'use strict';

angular.module('app')
.controller('operateLogSCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {

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
	//$scope.param.end_time=$scope.param.end_time||new Date().format('yyyy-MM-dd hh:mm:ss');
	//$scope.param.start_time=$scope.param.start_time||(new Date(new Date().getTime()-24*3600*1000)).format('yyyy-MM-dd hh:mm:ss')
	//默认时间
	$scope.param=$rootScope.defaultTime($scope.param,1)
	$scope.getOperateLog=function(){
		if($scope.searching)return;
		$scope.searching=true;
		yxRequest.send('post',yxIp.requestIp+'operate',
			$scope.param,
			function(result){
				$scope.searching=false;
				if(global_level>4){console.log('获取操作记录成功',result);}
				
				$scope.operateLog=result;
				angular.forEach($scope.operateLog.data,function(v){
					v.time=new Date(v.OperateTime).format('yyyy-MM-dd hh:mm:ss')//toLocaleString("zh")
				})
				$scope.pageInfo={};
				$scope.pageInfo.row=10;
				$scope.pageInfo.total=$scope.operateLog.data.length;
				$scope.pagination(1);
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:JSON.stringify(data),time:new Date()})
				if(global_level>1){console.log('获取操作记录失败',data);}
				
				toaster.pop('error','',data.msg)
			}
		)
	}
	$scope.getOperateLog();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.operateLog.data.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	$scope.quickSearch=function(){
		$scope.param=$rootScope.defaultTime($scope.param,$scope.days);
		$('.dataPicker_startTime').datetimepicker('setDate', ($scope.param.start_time));
		$('.dataPicker_endTime').datetimepicker('setDate', ($scope.param.end_time) );
	}
	//导出
	$scope.listExport=function(){
		let obj={title:['纪录ID','操作时间','操作信息','操作人'],data:[]};
		angular.forEach($scope.operateLog.data,function(v,k){
			let subArr=[];
			subArr.push(v.InfoID,v.OperateTime,v.OperateInfo,v.UserName||'--');
			obj.data.push(subArr)
		})
		$rootScope.listExport(obj)
	}
}]);
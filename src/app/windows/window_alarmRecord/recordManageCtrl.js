'use strict';

angular.module('app')
.controller('recordManageCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
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
	$rootScope.defaultTime($scope.param,1);
	//获取录波管理列表
	$scope.getRecordList=function(){
		$scope.searching=true;
		yxRequest.send('post',yxIp.requestIp+'gl/get_record',
			$scope.param,
			function(result){
				$scope.searching=false;
				if(global_level>4){console.log('获取录波管理列表成功',result);	}
				$scope.recordList=result;
				$scope.pageInfo={};
				$scope.pageInfo.row=10;
				$scope.pageInfo.total=$scope.recordList.data.length;
				$scope.pagination(1);
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>1){
					console.log('获取录波管理列表失败',data);	
					}
				
				toaster.pop('error','',data.msg)
			}
		)
	}
	$scope.getRecordList();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.recordList.data.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	//快速查询
	$scope.quickSearch=function(){
		$rootScope.defaultTime($scope.param,$scope.days);
		$('.dataPicker_startTime').datetimepicker('setDate', ($scope.param.start_time));
		$('.dataPicker_endTime').datetimepicker('setDate', ($scope.param.end_time) );
	}
	//导出
	$scope.listExport=function(){
		let obj={title:['文件名','信息'],data:[]};
		angular.forEach($scope.recordList.data,function(v,k){
			let subArr=[];
			subArr.push(v.Name,v.Info);
			obj.data.push(subArr)
		})
		$rootScope.listExport(obj)
	}

}]);
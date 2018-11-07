'use strict';

angular.module('app')
.controller('LSSJCXCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxWebsocket','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxWebsocket,yxLocalStorage) {
	$('.superWidthTable.yx-table').on('scroll',function(e){
		$('.superWidthTable.yx-table tr>td:first-child').css({"left":$(e.target).context.scrollLeft});
	})
	$(".dataPicker_startTime").datetimepicker({
		timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        secondText: '秒',
        millisecText:'毫秒',
        currentText: '现在',
        closeText: '完成',
        showSecond: true, //显示秒 
        dateFormat: 'yy-mm-dd',
        //timeFormat: 'HH:mm:ss', //格式化时间  
		showSecond: true,
	   	showMillisec: true,
	   	timeFormat: 'HH:mm:ss:l'
	});
	$scope.param={};
	//获取历史数据
	$scope.getDataHistory=function(){
		$scope.param.msec=$scope.startTime.substring(20,23);
		$scope.param.time=$scope.startTime.substring(0,19);
		$scope.searching=true;
		yxRequest.send('post',yxIp.requestIp+'sc/get_history',
			$scope.param,
			function(result){
				$scope.searching=false;
				if(global_level>4){console.log('获取历史数据成功',result);	}
				$rootScope.openFile(result.url)
			},function(data){
				$scope.searching=false;
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>1){
					console.log('获取历史数据失败',data);	
					}
				
				toaster.pop('error','',data.msg)
			}
		);
	}
	
	
}]);
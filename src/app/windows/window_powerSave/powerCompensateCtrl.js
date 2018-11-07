'use strict';

angular.module('app')
.controller('powerCompensateCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	
	console.log('powerCompensateCtrl');
	
	$scope.getChartDataFun=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_powerSave/powerCompensateMonth.json",
			async:false,
			success:function(result){
				//console.log(result);
				let chartData=[{name:"改造前",data:[]},{name:"改造后",data:[]}];
				angular.forEach(result,function(v,k){
					let val=0;
					if((k+1)%6==0){
						val+=v.time;
						chartData[0].data.push(val*2);
						chartData[1].data.push(val*1.8);
						val=0;
					}else{
						val+=v.time
					}
				})
				//console.log(chartData)
				Highcharts.chart('chartBox1', {
					chart: {
						alignTicks: false,
						type:'column'
					},
					rangeSelector:false,
					title: {
						text: '功率补偿节能'
					},
					yAxis:{
						title:{
					       text:'能耗'
					   	},
						opposite:false
					},
					 xAxis: {
					        categories: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
					        crosshair: true
					    },
					series: chartData
				});
				let chartData1=[{name:"改造前",data:[]},{name:"改造后",data:[]}];
				angular.forEach(result,function(v,k){
					let val=0;
					if((k+1)%6==0){
						val+=v.time;
						chartData1[0].data.push(val/6000);
						chartData1[1].data.push(val/6000*0.7);
						val=0;
					}else{
						val+=v.time
					}
				})
				Highcharts.chart('chartBox2', {
					chart: {
						alignTicks: false,
						type:'column'
					},
					rangeSelector:false,
					title: {
						text: '功率补偿降损'
					},
					yAxis:{
						title:{
					       text:'损耗'
					   	},
						opposite:false
					},
					 xAxis: {
					        categories: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
					        crosshair: true
					    },
					series: chartData1
				});
			},
			error:function(result){
				console.log('err')
				toaster.pop('error','','失败')
			}
		});
		
			
		
	}
	$scope.getChartDataFun();
	//获取表格数据，按日期
	$scope.getTableData=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_powerSave/powerCompensateDate.json",
			async:true,
			success:function(result){
				$scope.pageInfo = result;
			},
			error:function(result){
				
			}
		});
	}
	$scope.getTableData();
}]);
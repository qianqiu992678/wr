'use strict';

angular.module('app')
.controller('peakLoadShiftingCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	console.log('peakLoadShiftCtrl');
	$scope.getPeakLoadShifting=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_powerSave/peakLoadShifting.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.peakLoadShifting=result;
			},
			error:function(data){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getPeakLoadShifting();
	//获取柱状图数据
	$scope.getChartData=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_powerSave/peakLoadChartData.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				let chartData=[{name:'储能量',data:[]},{name:'耗能量',data:[]}];
				let categories=[];
				angular.forEach(result,function(v,k){
					chartData[0].data.push(v.storage);
					chartData[1].data.push(v.consume);
					categories.push(v.month);
				})
				console.log(chartData)
				Highcharts.chart('chartBox', {
					chart: {
						alignTicks: false,
						type:'column'
					},
					rangeSelector:false,
					title: {
						text: ''
					},
					yAxis:{
						title:{
					       text:'耗能（kw）'
					   	},
						opposite:false
					},
					 xAxis: {
					        categories: categories,
					        crosshair: true
				    },
					series: chartData
				});
			},
			error:function(data){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getChartData()
}]);
'use strict';
//设备控制节能
angular.module('app')
.controller('equipSavingCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	//画图
	
	$scope.equipment=$scope.equipmentList[0];
	$scope.years="1";
	$scope.categories=
		[ '2017','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
	$scope.equipChanged=function(){
		//第一组
		$.ajax({
			type:"get",
			url:'src/app/windows/window_energyEfficiency/equipSavingData1.json',
			async:true,
			success:function(result){
				let category=angular.copy($scope.categories);
				result[0].name=$scope.equipment;
				result[0].data=result[0].data.slice(0,$scope.years*12);
				for(let i=0;i<$scope.years;i++){
					$scope.categories[0]=2017-i;
					category=$scope.categories.concat(category)
				}
				Highcharts.chart('linechart1Container', {
					chart: {
						alignTicks: false,
						type: 'column'
					},
					rangeSelector:false,
					title: {
						text: '节能前能耗情况'
					},
					xAxis: {
				        categories: category,
				        crosshair: true
				    },
					yAxis:{
						title:{
					       text:'能耗'
					   	},
						opposite:false
					},
					series: result
				});
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
		//第二组
		$.ajax({
			type:"get",
			url:'src/app/windows/window_energyEfficiency/equipSavingData2.json',
			async:true,
			success:function(result){
				Highcharts.chart('linechart2Container', {
					chart: {
						alignTicks: false,
						type: 'column'
					},
					rangeSelector:false,
					title: {
						text: '能耗模型'
					},
					xAxis: {
				        categories: [
				           '周一','周二','周三','周四','周五','周六','周日'
				        ],
				        crosshair: true
				    },
					yAxis:{
						title:{
					       text:'能耗'
					   	},
						opposite:false
					},
					series: result
				});
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
		//第三组
		$.ajax({
			type:"get",
			url:'src/app/windows/window_energyEfficiency/equipSavingData3.json',
			async:true,
			success:function(result){
				let category=angular.copy($scope.categories);
				result[0].name=$scope.equipment;
				result[0].data=result[0].data.slice(0,$scope.years*12);
				for(let i=0;i<$scope.years;i++){
					$scope.categories[0]=$scope.categories[0]-i;
					category=$scope.categories.concat(category)
				}
				Highcharts.chart('linechart3Container', {
					chart: {
						alignTicks: false,
						type: 'column'
					},
					rangeSelector:false,
					title: {
						text: '设备更换后能耗预期'
					},
					xAxis: {
				        categories: category,
				        crosshair: true
				    },
					yAxis:{
						title:{
					       text:'能耗'
					   	},
						opposite:false
					},
					series: result
				});
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
		//第四组
		$.ajax({
			type:"get",
			url:'src/app/windows/window_energyEfficiency/equipSavingData4.json',
			async:true,
			success:function(result){
				Highcharts.chart('linechart4Container', {
					chart: {
						alignTicks: false,
						type: 'column'
					},
					rangeSelector:false,
					title: {
						text: '节能模型'
					},
					xAxis: {
				        categories: [
				            '周一','周二','周三','周四','周五','周六','周日'
				        ],
				        crosshair: true
				    },
					yAxis:{
						title:{
					       text:'能耗'
					   	},
						opposite:false
					},
					series: result
				});
			},
			error:function(result){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.equipChanged();
	//$('.equip-select').Tdrag({});
}]);
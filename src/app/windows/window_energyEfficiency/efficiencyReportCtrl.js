'use strict';
angular.module('app')
.controller('efficiencyReportCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	//console.log('efficiencyReportCtrl');
	$scope.bt1Data=[
		['无功补偿',30],
		['智能状态控制',62],
		['智能自动控制',8]
	]
	//画饼图1
	Highcharts.chart('bingtu1', {
		title: {
			text: '耗能评估'
		},
		tooltip: {
			headerFormat: '{series.name}<br>',
			pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
						enabled: false
				},
				//showInLegend: true, // 设置饼图是否在图例中显示
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			type: 'pie',
			name: '耗能评估',
			data: $scope.bt1Data
		}]
	});
	//柱形图_1
	$scope.createZZT1=function(title,domId,data){
		Highcharts.chart(domId, {
			chart: {
				alignTicks: false,
				type:'column'
			},
			rangeSelector:false,
			title: {
				text: title
			},
			yAxis:{
				title:{
			       text:'费用'
			   	},
				opposite:false
			},
			 xAxis: {
			        categories:[title],
			        crosshair: true
			    },
			series: data
		});
	}
	$timeout(function(){
		$scope.createZZT1('削峰填谷','zzt1_1',[{name:'改造前',data:[100]},{name:'改造后',data:[82]}]);
		$scope.createZZT1('节能降耗','zzt1_2',[{name:'改造前',data:[100]},{name:'改造后',data:[80]}]);
	},200)
		
	//饼图_2	
	$scope.createBingtu2=function(domId,data,title){
		var chart = Highcharts.chart(domId, {
			title: {
					text: title
			},
			tooltip: {
					headerFormat: '{series.name}<br>',
					pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
							enabled: false
					},
					//showInLegend: true, // 设置饼图是否在图例中显示
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: '节能数据分析',
				data: data
			}]
		});
	}
	/**
	 * 饼图
	 * */
	$scope.equipSaved=[
		['加油机',11],
		['灯箱',22],
		['照明',13],
		['其他',20]
	]
	$scope.overall=[
		['加油机',11],
		['灯箱',22],
		['照明',13],
		['其他',30]
	]
	$timeout(function(){
		$scope.createBingtu2('bingtu2_1',$scope.equipSaved,'各设备节能情况');
		$scope.createBingtu2('bingtu2_2',$scope.overall,'总体节能情况');
	},200)	
	//zzt2
	$scope.createZZT2=function(domId,title,data){
		Highcharts.chart(domId, {
			chart: {
				alignTicks: false,
				type:'column'
			},
			rangeSelector:false,
			title: {
				text: title
			},
			yAxis:{
				title:{
			       text:'能耗'
			   	},
				opposite:false
			},
			 xAxis: {
			        categories: ['周一','周二','周三','周四','周五','周六','周日'],
			        crosshair: true
			    },
			series: data
		});
	}
	$timeout(function(){
		$scope.createZZT2('zzt2_1','冬季能耗模型',[{name:'改造前',data:[33,36,29,34,31,37,25]},{name:'改造后',data:[28,31,24,29,26,32,20]}]);
		$scope.createZZT2('zzt2_2','夏季能耗模型',[{name:'改造前',data:[33,36,29,34,31,37,25]},{name:'改造后',data:[28,31,24,29,26,32,20]}]);
	},200)
}]);
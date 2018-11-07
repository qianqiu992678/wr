'use strict';
//设备控制节能
angular.module('app')
.controller('savingAnalysisCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	console.log('savingAnalysisCtrl');
	$scope.dataList=['chartData1.json','chartData2.json'];
	$scope.pageInfo={};
	$scope.pageInfo.row=5;
	$scope.getSavingAnalysis=function(){
		$.ajax({
			type:"get",
			url:"src/app/windows/window_energyEfficiency/savingAnalysis.json",
			async:true,
			success:function(result){
				//console.log('成功:',result);
				$scope.savingAnalysis=result;
				$scope.pageInfo.total=result.length;
				$scope.pagination(1);
			},
			error:function(data){
				toaster.pop('error','','失败')
			}
		});
	}
	$scope.getSavingAnalysis();
	$scope.pagination=function(pageNum){
		$scope.pageInfo.data=$scope.savingAnalysis.slice($scope.pageInfo.row*(pageNum-1),$scope.pageInfo.row*pageNum);
		$scope.pageInfo.pageNum=pageNum;
		$scope.pageInfo.size=$scope.pageInfo.data.length;
	}
	
	$scope.equipSaved=[
		['加油系统',22],
		['便利店',42],
		['餐厅',41],
		['值班室',11],
		['财务室',15],
		['其他',52]
	]
	$scope.overall=[
		['远程控制节能',11],
		['管理控制节能',22],
		['设备控制节能',13],
		['其他',10]
	]
	//画图
	$scope.createChart=function(domId,data,title){
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
	$timeout(function(){
		$scope.createChart('chart1',$scope.equipSaved,'各设备节能情况');
		$scope.createChart('chart2',$scope.overall,'总体节能情况');
	},200)	
	
}]);
'use strict';

angular.module('app')
.controller('loadStructureCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('loadStructureCtrl');
	$scope.allLoad=[
		['加油系统',22],
		['便利店',42],
		['餐厅',41],
		['值班室',11],
		['财务室',15],
		['其他',52]
	]
	$scope.heavyLoad=[
		['加油机',11],
		['灯箱',22],
		['照明',13],
		['其他',10]
	]
	$scope.allLoadArr=angular.copy($scope.allLoad);
	$scope.heavyLoadArr=angular.copy($scope.heavyLoad);
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
				name: '浏览器访问量占比',
				data: data
			}]
		});
	}
	$timeout(function(){
		$scope.createChart('chartContainer1',$scope.allLoad,'总能耗结构');
		$scope.createChart('chartContainer2',$scope.heavyLoad,'重负荷能耗结构');
	},200)
		
}]);
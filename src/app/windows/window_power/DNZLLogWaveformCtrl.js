'use strict';

angular.module('app')
	.controller('DNZLLogWaveformCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', '$compile', 'yxWebsocket',
		function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, $compile, yxWebsocket) {

			$scope.series = [];
			$scope.seriesOptions = [];
			if(!$rootScope.dnzlLogData) {
				$state.go('main.power.DNZLZHCX.DNZLLog');
				return;
			}
			angular.forEach($rootScope.dnzlLogData[0], function(v, k) {
				let data = [];
				angular.forEach($rootScope.dnzlLogData, function(v1, k1) {
					let time1 = v1.filter(function(v2) {
						return v2.cName == '时间'
					})[0].value;
					let time = new Date(time1).getTime();
					data.push([time, v1.filter(function(v2) {
						return v2.cName == v.cName
					})[0].value])
				})
				if(v.cName != 'PosID') {
					$scope.series.push({
						name: v.cName,
						data: data
					})
				}
			});
			$scope.createChart = function() {
				$('#highstockcontainer').highcharts('StockChart', {
					chart: {
						zoomType: null,
					},
					rangeSelector: {
						selected: 4
					},
					yAxis: $scope.yAxis,
					plotOptions: {
						series: {
							//compare: 'percent',
							showInNavigator: true
						}
					},
					tooltip: {
						shared: true
					},
					series: $scope.seriesOptions
				});
			}
			$scope.seriesChange = function() {

				$scope.seriesOptions = $scope.series.filter(function(v) {
					return v.checked
				})

				$scope.yAxis = [];

				angular.forEach($scope.seriesOptions, function(v, k) {
					v.yAxis = k;
					v.colorIndex = k;
					$scope.yAxis.push({
						labels: {
							format: '{value}',
						},
						title: {
							text: v.name,
						},
						opposite: true
					})
				})
				//console.log($scope.seriesOptions)
				//console.log(Highcharts.getOptions().colors)
				$scope.createChart();
			}
			//返回上一页
			//$scope.backLoading=false;
			$scope.urlBackFun = function(url) {
				//$scope.backLoading=true;
				$state.go(url);
			}
		}
	]);
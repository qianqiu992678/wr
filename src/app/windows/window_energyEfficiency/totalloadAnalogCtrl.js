'use strict';

angular.module('app')
.controller('totalloadAnalogCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('totalloadAnalogCtrl');
	Highcharts.setOptions({ global: { useUTC: false } });   
	var seriesOptions = [],seriesCounter = 0,names = [{name:'改造前',en:'test3'}, {name:'改造后',en:'test2'}];
		// create the chart when all data is loaded
	$scope.createChart = function () {
		Highcharts.stockChart('linechartContainer', {
		//Highcharts.chart('linechartContainer', {
			rangeSelector: {
					selected: 4
			},
			yAxis: {
//					labels: {
//							formatter: function () {
//								return (this.value > 0 ? ' + ' : '') + this.value + '%';
//							}
//					},
					plotLines: [{
							value: 0,
							width: 2,
							color: 'silver'
					}],
					opposite:false
			},
			legend: {
			　　align: "right", //程度标的目标地位
			　　verticalAlign: "top", //垂直标的目标地位
			　　x: 0, //间隔x轴的间隔
			　　y: 100 //间隔Y轴的间隔
			},
			plotOptions: {
					series: {
						compare: 'arearange',
						showInNavigator: true
					}
			},
			legend: {
		        enabled: true,
		        align: 'center',
		        backgroundColor: '#FCFFC5',
		        borderColor: 'black',
		        borderWidth: 2,
		        layout: 'horizontal',
		        verticalAlign: 'top',
		        y: 10,
		        shadow: true
		    },
			rangeSelector:false,
			tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',//({point.change}%)
						valueDecimals: 2,
						shared: true
				},
				series: seriesOptions
		});
	};
	$.each(names, function (i, name) {
		$.getJSON('test/json/' + name.en+ '.json',    
		function (data) {
			$scope.data=[];
			$scope.ld=Date.parse(new Date(new Date().setHours(0,0,0,0)));
			for(let i=0;i<data.length;i++){
				if($scope.ld+1.8*100000*i>Date.parse(new Date())){
					$scope.maxValue_time= $filter('date')($scope.ld+1.8*100000*(i-1), "yyyy-MM-dd hh:mm:ss");
					break;
				}
				$scope.data.push([1.8*100000*i+$scope.ld,data[i][1]]);
			}
			seriesOptions[i] = {
				name: name.name,
				data: $scope.data
			};
			seriesCounter += 1;
			if (seriesCounter === names.length) {
				$scope.createChart();
			}
		});
	});

}]);
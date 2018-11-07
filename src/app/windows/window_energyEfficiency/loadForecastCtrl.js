'use strict';

angular.module('app')
.controller('loadForecastCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {
	console.log('loadForecastCtrl');
	Highcharts.setOptions({ global: { useUTC: false } });  
	
	// create the chart when all data is loaded
	$scope.createChart = function (domId,title,data) {
		Highcharts.stockChart(domId, {
				rangeSelector: {
						selected: 4
				},
				yAxis: {
//							labels: {
//									formatter: function () {
//											return (this.value > 0 ? ' + ' : '') + this.value + '%';
//									}
//							},
						plotLines: [{
								value: 0,
								width: 2,
								color: 'silver'
						}],
						opposite:false
				},
				xAxis: {  
                  type: 'datetime'
              	},
				title:{
					text:title
				},
				legend: {
			        enabled: true,
			        align: 'center',
			        backgroundColor: '#FCFFC5',
			        borderColor: 'black',
			        borderWidth: 2,
			        layout: 'horizontal',
			        verticalAlign: 'top',
			        y: 0,
			        shadow: true
			    },
				plotOptions: {
					series: {
						compare: 'arearange',
						showInNavigator: true
					},
					line: {  
				        gapSize: 1  
				    } 
				}, 
				rangeSelector:false,
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',//({point.change}%)
					valueDecimals: 2,
					shared: true
				},
				series: data
		});
	};
	//获取  加油机
	$.ajax({
		type:"get",
		url:"src/app/windows/window_energyEfficiency/jiayouji.json",
		async:true,
		success:function(result){
			$scope.createChart('linechart1Container','加油机',result);
		},
		error:function(result){
			
		}
	});
	//获取  空调
	$.ajax({
		type:"get",
		url:"src/app/windows/window_energyEfficiency/kongtiao.json",
		async:true,
		success:function(result){
			$scope.createChart('linechart2Container','空调',result);
		},
		error:function(result){
			
		}
	});
	//获取  照明
	$.ajax({
		type:"get",
		url:"src/app/windows/window_energyEfficiency/zhaoming.json",
		async:true,
		success:function(result){
			$scope.createChart('linechart3Container','照明',result);
		},
		error:function(result){
			
		}
	});
	//获取  其他
	$.ajax({
		type:"get",
		url:"src/app/windows/window_energyEfficiency/qita.json",
		async:true,
		success:function(result){
			$scope.createChart('linechart4Container','其他',result);
		},
		error:function(result){
			
		}
	});
	
	$.each(names, function (i, name) {
			$.getJSON('test/json/' + name.en+ '.json',
			function (data) {
				$scope.data=[];
				$scope.ld=Date.parse(new Date(new Date().setHours(0,0,0,0)));
				for(let i=0;i<data.length;i++){
					//if(name.en=='test2'&&$scope.ld+1.8*100000*i>Date.parse(new Date())){
						//break;
					//}
					$scope.data.push([1.8*100000*i+$scope.ld,data[i][1]]);
				}
					seriesOptions[i] = {
							name: name.name,
							data: $scope.data
					};
					// As we're loading the data asynchronously, we don't know what order it will arrive. So
					// we keep a counter and create the chart when all the data is loaded.
					seriesCounter += 1;
					if (seriesCounter === names.length) {
							$scope.createChart('linechart1Container','加油机');
							$scope.createChart('linechart2Container','空调');
							$scope.createChart('linechart3Container','照明');
							$scope.createChart('linechart4Container','其他类');
					}
			});
	});
}]);
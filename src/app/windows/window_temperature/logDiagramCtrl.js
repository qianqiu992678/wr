'use strict';

angular.module('app')
.controller('logDiagramCtrl', ['$filter','$location','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin',
function($filter,$location,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin) {
	
	if(global_level>7){
		console.log('logDiagramCtrl')
				}
	$scope.series=[];
	$scope.seriesOptions = [],
	$.ajax({
		type:"get",
		url:"test/json/test1.json",
		async:false,
		success:function(data){
			if(global_level>4){
		console.log(data);
				}
			
			$scope.series.push({name:'s1',data:data})
		},
		error:function(data){
			if(global_level>1){
		console.log(data)
				}
			
			
		}
	});
	$.ajax({
		type:"get",
		url:"test/json/test2.json",
		async:false,
		success:function(data){
			if(global_level>4){
		console.log(data);
				}
			
			$scope.series.push({name:'s2',data:data})
		},
		error:function(data){
			if(global_level>1){
		console.log(data);
				}
		}
	});
	$.ajax({
		type:"get",
		url:"test/json/test3.json",
		async:false,
		success:function(data){
			if(global_level>4){
		console.log(data);
				}
			$scope.series.push({name:'s3',data:data})
		},
		error:function(data){
			if(global_level>1){
		console.log(data);
				}
		}
	});
	if(global_level>4){
		console.log($scope.seriesOptions);
				}
	
	
	$scope.createChart=function() {
        $('#highstockcontainer').highcharts('StockChart', {
            chart: {
                zoomType: null,
            },
            rangeSelector: {
                selected: 4
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                followTouchMove: false,
                split: true
            },
            series: $scope.seriesOptions
        });
    }
	$scope.seriesChange=function(){
		
		$scope.seriesOptions=$scope.series.filter(function(v){
			return v.checked
		})
		if(global_level>4){
		console.log($scope.seriesOptions)
				}
		
		$scope.createChart();
		
	}













}]);
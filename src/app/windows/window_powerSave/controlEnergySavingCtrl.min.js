'use strict';

angular.module('app')
.controller('controlEnergySavingCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	console.log('controlEnergySavingCtrl');
	$scope.getControlEnergySaving = function() {
		$.ajax({
			type: "get",
			url: "src/app/windows/window_powerSave/controlEnergySaving.json",
			async: true,
			success: function(result) {
				console.log('成功:',result);
				$scope.controlEnergySaving = result;
				$scope.date=$scope.controlEnergySaving[0];
				$scope.dateSelectFun();
			},
			error: function(result) {
				toaster.pop('error', '', '失败')
			}
		});
	}
	$scope.getControlEnergySaving();
	$scope.dateSelectFun=function(){
		$scope.pageInfo=$scope.controlEnergySaving.filter(function(v){
			return v.date==$scope.date.date;
		})
		//console.log($scope.pageInfo);
		
		let result=[{name:'节能前',data:[]},{name:'节能后',data:[]}]
		angular.forEach($scope.pageInfo[0].list,function(v,k){
			result[1].data.push((1-v.percent/100)*24)
		})
		for(let i=0;i<18;i++){
			result[0].data.push(24)
		}
		console.log(result)
		Highcharts.chart('chartBox', {
			chart: {
				alignTicks: false,
				type:'column'
			},
			rangeSelector:false,
			title: {
				text: '智能状态控制'
			},
			yAxis:{
				title:{
			       text:'投运时长'
			   	},
				opposite:false
			},
			 xAxis: {
			        categories: $scope.equipmentList,
			        crosshair: true
			    },
			series: result
		});
		
		
	}

		
	
}]);
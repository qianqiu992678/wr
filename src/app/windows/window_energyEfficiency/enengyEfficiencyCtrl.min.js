'use strict';
//设备控制节能
angular.module('app')
.controller('enengyEfficiencyCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', 'yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, yxLocalStorage) {
	console.log('enengyEfficiencyCtrl');
	$scope.equipmentList=['罩棚照明1','罩棚照明2','罩棚应急灯开关','罩棚照明3','罩棚照明4','灯箱1','灯箱2','灯箱3','油品灯箱','路灯照明',
	'便利店等照明1','便利店等照明2','其他照明','应急照明','配电间插座等','便利店插座等','便利店冷藏饮料插座','自住餐台插座','财务室插座',
	'监控机柜电源','一层风机盘管','发光灯带','发光店招','出入口灯箱','品牌柱','地源热泵','二层照明','餐厅插座','值班室插座','淋浴间插座',
	'二层风机盘管','淋浴间照明','便利店微机电源等','财务室微机电源等','管控机柜电源','液位计主电源LIC','检漏仪报警电源LA01',
	'检漏仪报警电源LA02','1#加油机','2#加油机','3#加油机','便利店急停按钮','加油机急停按钮'];
}]);
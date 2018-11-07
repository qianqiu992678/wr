'use strict';
var app = angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		// 默认地址 

		//服务器数据
		//本地数据
		$urlRouterProvider.otherwise('/diagram/DQMX');

		// 状态配置
		$stateProvider
			.state('main', {
				abstract: true,
				url: '',
				templateUrl: 'src/tpl/app.html',
				controller: 'appCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/appCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//测试
			.state('main.test', {
				url: '/test',
				template:'<div ui-view><div>'
			})
			.state('main.test.test1', {
				url: '/test1',
				templateUrl: 'src/app/windows/window_test/test1.html',
				controller: 'test1Ctrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_test/test1Ctrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			.state('main.test.test2', {
				url: '/test2',
				templateUrl: 'src/app/windows/window_test/test2_svgTest.html',
				controller: 'test2_svgTestCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_test/test2_svgTestCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			.state('main.test.test3', {
				url: '/test3',
				templateUrl: 'src/app/windows/window_test/test3_svgShow.html',
				controller: 'test3_svgShowCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_test/test3_svgShowCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//节能管理
			.state('main.powerSave', {
				url: '/powerSave',
				//template: '<div ui-view></div>',
				templateUrl:'src/app/windows/window_powerSave/powerSave.html',
				controller: 'powerSaveCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_powerSave/powerSaveCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//节能管理--削峰填谷
			.state('main.powerSave.peakLoadShifting', {
				url: '/peakLoadShifting',
				templateUrl: 'src/app/windows/window_powerSave/peakLoadShifting.html',
				controller: 'peakLoadShiftingCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_powerSave/peakLoadShiftingCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//节能管理--功率补偿
			.state('main.powerSave.powerCompensate', {
				url: '/powerCompensate',
				templateUrl: 'src/app/windows/window_powerSave/powerCompensate.html',
				controller: 'powerCompensateCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_powerSave/powerCompensateCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//节能管理--智能状态控制
			.state('main.powerSave.controlEnergySaving', {
				url: '/controlEnergySaving',
				templateUrl: 'src/app/windows/window_powerSave/controlEnergySaving.html',
				controller: 'controlEnergySavingCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_powerSave/controlEnergySavingCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//节能管理--智能自动控制
			.state('main.powerSave.remoteSaving', {
				url: '/remoteSaving',
				templateUrl: 'src/app/windows/window_powerSave/remoteSaving.html',
				controller: 'remoteSavingCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_powerSave/remoteSavingCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型
			.state('main.diagram', {
				url: '/diagram',
				templateUrl: 'src/app/windows/window_diagram/diagram.html',
				controller: 'diagramCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/diagramCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———电气模型
			.state('main.diagram.DQMX', {
				url: '/DQMX',
				templateUrl: 'src/app/windows/window_diagram/DQMX.html',
				controller: 'DQMXCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/DQMXCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//矢量模型———数据与状态
			.state('main.diagram.SJYZT', {
				url: '/SJYZT',
				templateUrl: 'src/app/windows/window_diagram/SJYZT.html',
				controller: 'SJYZTCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/SJYZTCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———数据与状态——所有数据
			.state('main.diagram.SJYZT.allData', {
				url: '/allData',
				templateUrl: 'src/app/windows/window_diagram/dataAndStatus/allData.html',
				controller: 'allDataCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/dataAndStatus/allDataCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———遥控
			.state('main.diagram.yaokong', {
				url: '/yaokong',
				templateUrl: 'src/app/windows/window_diagram/yaokong.html',
				controller: 'yaokongCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/yaokongCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———数据与状态——遥信
			.state('main.diagram.SJYZT.yaoxin', {
				url: '/yaoxin?classname',
				templateUrl: 'src/app/windows/window_diagram/dataAndStatus/yaoxin.html',
				controller: 'yaoxinCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/dataAndStatus/yaoxinCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———数据与状态——遥信、遥测、遥脉——分组
			.state('main.diagram.SJYZT.fenzu', {
				url: '/fenzu?title&classname',
				templateUrl: 'src/app/windows/window_diagram/dataAndStatus/fenzu.html',
				controller: 'fenzuCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_diagram/dataAndStatus/fenzuCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//电能与电能质量
			.state('main.power', {
				url: '/power',
				template:'<div ui-view></div>'
			})
			//电能与电能质量——电能综合查询
			.state('main.power.DNZHCX', {
				url: '/DNZHCX',
				templateUrl: 'src/app/windows/window_power/DNZHCX.html',
				controller: 'DNZHCXCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNZHCXCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询——当前数据
			.state('main.power.DNZHCX.DNCurrent', {
				url: '/DNCurrent',
				templateUrl: 'src/app/windows/window_power/DNCurrent.html',
				controller: 'DNCurrentCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNCurrentCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询——历史数据数据
			.state('main.power.DNZHCX.DNLog', {
				url: '/DNLog',
				templateUrl: 'src/app/windows/window_power/DNLog.html',
				controller: 'DNLogCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNLogCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询——历史数据数据——图形显示
			.state('main.power.DNZHCX.DNLogWaveform', {
				url: '/DNLogWaveform',
				templateUrl: 'src/app/windows/window_power/DNLogWaveform.html',
				controller: 'DNLogWaveformCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNLogWaveformCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询
			.state('main.power.DNZLZHCX', {
				url: '/DNZLZHCX',
				templateUrl: 'src/app/windows/window_power/DNZLZHCX.html'
			})
			//电能与电能质量——电能质量综合查询——当前数据
			.state('main.power.DNZLZHCX.DNZLCurrent', {
				url: '/DNZLCurrent',
				templateUrl: 'src/app/windows/window_power/DNZLCurrent.html',
				controller: 'DNZLCurrentCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNZLCurrentCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询——历史数据数据
			.state('main.power.DNZLZHCX.DNZLLog', {
				url: '/DNZLLog',
				templateUrl: 'src/app/windows/window_power/DNZLLog.html',
				controller: 'DNZLLogCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNZLLogCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//电能与电能质量——电能质量综合查询——历史数据数据——波形显示
			.state('main.power.DNZLZHCX.DNZLLogWaveform', {
				url: '/DNZLLogWaveform',
				templateUrl: 'src/app/windows/window_power/DNZLLogWaveform.html',
				controller: 'DNZLLogWaveformCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNZLLogWaveformCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//电能与电能质量——电能事件报告
			.state('main.power.DNEventReport', {
				url: '/DNEventReport',
				templateUrl: 'src/app/windows/window_power/DNEventReport.html',
				controller: 'DNEventReportCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNEventReportCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//电能与电能质量——电能质量评估
			.state('main.power.DNQualityAssess', {
				url: '/DNQualityAssess',
				templateUrl: 'src/app/windows/window_power/DNQualityAssess.html',
				controller: 'DNQualityAssessCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_power/DNQualityAssessCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//智能设备管理
			.state('main.equipmentManage',{
				url:'/equipmentManage',
				templateUrl:'src/app/windows/window_equipmentManage/equipmentManage.html',
				controller: 'equipmentManageCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_equipmentManage/equipmentManageCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//智能设备管理--设备分项管理
			.state('main.equipmentManage.equipmentSelectItem', {
				url: '/equipmentSelectItem',
				templateUrl: 'src/app/windows/window_equipmentManage/equipmentSelectItem.html',
				controller: 'equipmentSelectItemCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_equipmentManage/equipmentSelectItemCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//智能设备管理--设备事故预测
			.state('main.equipmentManage.equipmentForecast', {
				url: '/equipmentForecast',
				templateUrl: 'src/app/windows/window_equipmentManage/equipmentForecast.html',
				controller: 'equipmentForecastCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_equipmentManage/equipmentForecastCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//智能设备管理--设备安全评估
			.state('main.equipmentManage.equipmentSafe', {
				url: '/equipmentSafe',
				templateUrl: 'src/app/windows/window_equipmentManage/equipmentSafe.html',
				controller: 'equipmentSafeCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_equipmentManage/equipmentSafeCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			.state('main.assessment',{
				url:'/assessment',
				template:'<div ui-view></div>'
			})
			
			//智能评估预测--开关类
			.state('main.assessment.switch', {
				url: '/switch',
				templateUrl: 'src/app/windows/window_assessment/switch.html',
				controller: 'switchCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_assessment/switchCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//智能评估预测--重点设备
			.state('main.assessment.important', {
				url: '/important',
				templateUrl: 'src/app/windows/window_assessment/important.html',
				controller: 'importantCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_assessment/importantCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//智能评估预测--其他
			.state('main.assessment.others', {
				url: '/others',
				templateUrl: 'src/app/windows/window_assessment/others.html',
				controller: 'othersCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_assessment/othersCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//能效管理
			.state('main.energyEfficiency', {
				url: '/energyEfficiency',
				templateUrl: 'src/app/windows/window_energyEfficiency/enengyEfficiency.html',
				//template:'<div ui-view></div>',
				controller:'enengyEfficiencyCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/enengyEfficiencyCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//能效管理--总负荷分析
			.state('main.energyEfficiency.totalloadAnalog', {
				url: '/totalloadAnalog',
				templateUrl: 'src/app/windows/window_energyEfficiency/totalloadAnalog.html',
				controller: 'totalloadAnalogCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/totalloadAnalogCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//能效管理--负荷预测
			.state('main.energyEfficiency.loadForecast', {
				url: '/loadForecast',
				templateUrl: 'src/app/windows/window_energyEfficiency/loadForecast.html',
				controller: 'loadForecastCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/loadForecastCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//能效管理--设备能效分析
			.state('main.energyEfficiency.equipSaving', {
				url: '/equipSaving',
				templateUrl: 'src/app/windows/window_energyEfficiency/equipSaving.html',
				controller: 'equipSavingCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/equipSavingCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//能效管理--节能数据分析
			.state('main.energyEfficiency.savingAnalysis', {
				url: '/savingAnalysis',
				templateUrl: 'src/app/windows/window_energyEfficiency/savingAnalysis.html',
				controller: 'savingAnalysisCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/savingAnalysisCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//能效管理--能耗结构
			.state('main.energyEfficiency.loadStructure', {
				url: '/loadStructure',
				templateUrl: 'src/app/windows/window_energyEfficiency/loadStructure.html',
				controller: 'loadStructureCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/loadStructureCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//能效管理--设备能效报告
			.state('main.energyEfficiency.efficiencyReport', {
				url: '/efficiencyReport',
				templateUrl: 'src/app/windows/window_energyEfficiency/efficiencyReport.html',
				controller: 'efficiencyReportCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_energyEfficiency/efficiencyReportCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			
			//保护与控制
			.state('main.protect', {
				url: '/protect',
				templateUrl: 'src/app/windows/window_protect/protect.html',
				controller: 'protectCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_protect/protectCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//保护与控制——保护信息综合查询
			.state('main.protect.BHXXZHCX', {
				url: '/BHXXZHCX',
				templateUrl: 'src/app/windows/window_protect/BHXXZHCX.html',
				controller: 'BHXXZHCXCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_protect/BHXXZHCXCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//保护与控制——设备控制管理
			.state('main.protect.SBKZGL', {
				url: '/SBKZGL',
				templateUrl: 'src/app/windows/window_protect/SBKZGL.html',
				controller: 'SBKZGLCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_protect/SBKZGLCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//系统维护
			.state('main.sysMaintains', {
				url: '/sysMaintains',
				templateUrl: 'src/app/windows/window_sysMaintains/sysMaintains.html',
				controller: 'sysMaintainsCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_sysMaintains/sysMaintainsCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//保护与控制——设备控制管理——操作记录
			.state('main.protect.operateLog', {
				url: '/operateLog',
				templateUrl: 'src/app/windows/window_protect/operateLog.html',
				controller: 'operateLogCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_protect/operateLogCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//温度与设备分析
			.state('main.temperature', {
				url: '/temperature',
				templateUrl: 'src/app/windows/window_temperature/temperature.html',
				controller: 'temperatureCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_temperature/temperatureCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//温度与设备分析——当前温度数据
			.state('main.temperature.temperatureCurrent', {
				url: '/temperatureCurrent',
				templateUrl: 'src/app/windows/window_temperature/temperatureCurrent.html',
				controller: 'temperatureCurrentCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_temperature/temperatureCurrentCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//温度与设备分析——温度历史数据
			.state('main.temperature.temperatureLog', {
				url: '/temperatureLog',
				templateUrl: 'src/app/windows/window_temperature/temperatureLog.html',
				controller: 'temperatureLogCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_temperature/temperatureLogCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//温度与设备分析——温度历史数据曲线图
			.state('main.temperature.logDiagram', {
				url: '/logDiagram',
				templateUrl: 'src/app/windows/window_temperature/logDiagram.html',
				controller: 'logDiagramCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_temperature/logDiagramCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//事故处理
			.state('main.troubleRemoval', {
				url: '/troubleRemoval',
				templateUrl: 'src/app/windows/window_trouble/troubleRemoval.html',
				controller: 'troubleRemovalCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_trouble/troubleRemovalCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//操作记录——操作记录查询
			.state('main.operateLogS', {
				url: '/operateLogS',
				templateUrl: 'src/app/windows/window_operateLog/operateLogS.html',
				controller: 'operateLogSCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_operateLog/operateLogSCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型
			.state('main.system', {
				url: '/system',
				template:'<div ui-view></div>'
			})
			//系统设置页面
			.state('main.system.sysSetting', {
				url: '/sysSetting',
				templateUrl: 'src/app/windows/window_system/sysSetting.html',
				controller: 'sysSettingCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_system/sysSettingCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//矢量模型———文件管理
			.state('main.system.fileManage', {
				url: '/fileManage',
				templateUrl: 'src/app/windows/window_system/fileManage.html',
				controller: 'fileManageCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_system/fileManageCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理
			.state('main.dzManage', {
				url: '/dzManage',
				templateUrl: 'src/app/windows/window_DZManage/dzManage.html',
				//template:'<div ui-view class="yx-appContainer"></div>',
				controller: 'dzManageCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dzManageCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			
			//定值管理——电压监测点列表
			.state('main.dzManage.dz_volList', {
				url: '/dz_volList',
				templateUrl: 'src/app/windows/window_DZManage/dz_volList.html',
				controller: 'dz_volListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_volListCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——电流监测点列表
			.state('main.dzManage.dz_curList', {
				url: '/dz_curList',
				templateUrl: 'src/app/windows/window_DZManage/dz_curList.html',
				controller: 'dz_curListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_curListCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——电流独立监测点列表
			.state('main.dzManage.dz_cindependentList', {
				url: '/dz_cindependentList',
				templateUrl: 'src/app/windows/window_DZManage/dz_cindependentList.html',
				controller: 'dz_cindependentListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_cindependentListCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——电压独立监测点列表
			.state('main.dzManage.dz_uindependentList', {
				url: '/dz_uindependentList',
				templateUrl: 'src/app/windows/window_DZManage/dz_uindependentList.html',
				controller: 'dz_uindependentListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_uindependentListCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——开关量列表
			.state('main.dzManage.dz_switchList', {
				url: '/dz_switchList',
				templateUrl: 'src/app/windows/window_DZManage/dz_switchList.html',
				controller: 'dz_switchListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_switchListCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——保护定值
			.state('main.dzManage.dz_protectList', {
				url: '/dz_protectList',
				templateUrl: 'src/app/windows/window_DZManage/dz_protectList.html',
				controller: 'dz_protectListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_protectListCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——系统定值
			.state('main.dzManage.dz_systemList', {
				url: '/dz_systemList',
				templateUrl: 'src/app/windows/window_DZManage/dz_systemList.html',
				controller: 'dz_systemListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_systemListCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——告警定值
			.state('main.dzManage.dz_alarmList', {
				url: '/dz_alarmList',
				templateUrl: 'src/app/windows/window_DZManage/dz_alarmList.html',
				controller: 'dz_alarmListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_alarmListCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//定值管理——录波启动定值
			.state('main.dzManage.dz_recordStartList', {
				url: '/dz_recordStartList',
				templateUrl: 'src/app/windows/window_DZManage/dz_recordStartList.html',
				controller: 'dz_recordStartListCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_DZManage/dz_recordStartListCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理
			.state('main.alarmRecord', {
				url: '/alarmRecord',
				//template:'<div ui-view></div>',
				templateUrl:'src/app/windows/window_alarmRecord/alarmRecord.html',
				controller: 'alarmRecordCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/alarmRecordCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理——告警管理
			.state('main.alarmRecord.alarmManage', {
				url: '/alarmManage',
				templateUrl: 'src/app/windows/window_alarmRecord/alarmManage.html',
				controller: 'alarmManageCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/alarmManageCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理——录波管理
			.state('main.alarmRecord.recordManage', {
				url: '/recordManage',
				templateUrl: 'src/app/windows/window_alarmRecord/recordManage.html',
				controller: 'recordManageCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/recordManageCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理——事故模型
			.state('main.alarmRecord.troubleModal', {
				url: '/troubleModal',
				templateUrl: 'src/app/windows/window_alarmRecord/troubleModal.html',
				controller: 'troubleModalCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/troubleModalCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理——电气安全评估
			.state('main.alarmRecord.electricSafe', {
				url: '/electricSafe',
				templateUrl: 'src/app/windows/window_alarmRecord/electricSafe.html',
				controller: 'electricSafeCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/electricSafeCtrl.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理———历史数据查询
			.state('main.alarmRecord.LSSJCX', {
				url: '/LSSJCX',
				templateUrl: 'src/app/windows/window_alarmRecord/LSSJCX.html',
				controller: 'LSSJCXCtrl',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/windows/window_alarmRecord/LSSJCXCtrl.min.js').then(function() {
							return $ocLazyLoad.load('toaster')
						});
					}]
				}
			})
			//告警与录波管理———历史数据查询——波形显示
//			.state('main.alarmRecord.LSSJCXWaveform', {
//				url: '/LSSJCXWaveform',
//				templateUrl: 'src/app/windows/window_alarmRecord/LSSJCXWaveform.html',
//				controller: 'LSSJCXWaveformCtrl',
//				resolve: {
//					deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
//						return uiLoad.load('src/app/windows/window_alarmRecord/LSSJCXWaveformCtrl.js').then(function() {
//							return $ocLazyLoad.load('toaster')
//						});
//					}]
//				}
//			})
	}])
	//导航控制器
	.controller("navCtrl", function($rootScope, $scope, $state,yxLogin,yxLocalStorage) {
		//if(qson){$rootScope.userInfo={};$rootScope.userInfo.userType = 1}
		//$rootScope.showRight=true;
		//菜单栏锁定
		$scope.leftLockFun=function(){
			$rootScope.leftLock=!$rootScope.leftLock;
		}
	  	$.ajax({
			//服务器数据
			//本地数据
			type:( 'GET'),
			url :('test/json/navCtrl.json'),
			success:function(result) {
				if(global_level>5){
					console.log(result)
				}
              $rootScope.menuList = result.menus;
              $rootScope.nowTime = new Date();
              $rootScope.$apply();
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>2){
					console.log(data)
				}
			}
		});
		
		$scope.showHide = function(menu) {
			menu.isShow = !menu.isShow;
		}
		//选择显示模态框
		$scope.menuFun = function(modal) {
			modal.status=true;
			if(modal.command){
				switch(modal.command) {
					//录波启动模态框
					case 'luboStartModal':
						$rootScope.modals.luboStartModal = true;
						break;
					//系统管理——切换用户
					case 'systemLoginModal':
						yxLogin.logout();
						$rootScope.modals.systemLoginModal = true;
						break;
					//系统管理——退出系统
					case 'systemLogoutModal':
						$rootScope.modals.systemLogoutModal = true;
						break;
					//系统管理——显示中3区
					case 'showCenter3':
						$rootScope.showFooter();
						break;
					//系统管理——显示右侧
					case 'showRightArea':
						$rootScope.showRight();
						break;
					//系统管理——更新刷新时间	
					case 'refreshTimeModal':
						$rootScope.modals.refreshTimeModal = true;
						break;
					//系统管理——刷新数据
					case 'dataRefresh':
					
						if($rootScope.messageData){
							$rootScope.wsTablemsg($rootScope.messageData);
						}
						break;
					//定值更新确认
					case 'dzUpdateConfirmFun':
						$rootScope.dzUpdateSubmit();
						break;
					default:
						break;
				}
			}else{
				$state.go(modal.request)
			}
			
		}
		
	})
	//中三区控制器
	.controller("footerCtrl", function($rootScope, $scope, $state,$timeout) {
		$scope.item = 'gaojing';
		$timeout(function(){
			$('.app-center-footer').Tdrag({
				axis:'y',
				cbMove:function(el){
					let boxHeight=parseInt($(el).css('height'))
					$('.app-center-footer .footer-content .yx-list .yx-tableInfo tbody').css({'maxHeight':boxHeight-67+'px'})
				}
			});
		},1000)
		$scope.footTabSwitch = function(str) {
			$scope.item = str;
		}
		//$rootScope.c3Operate();
		//报警信息清空方法
		$scope.alarmsClear=function(){
			$rootScope.currentAlarms=[]
		}
		//报警信息处理
		$scope.alarmsDispose=function(){
			angular.forEach($rootScope.currentAlarms,function(v,k){
				if(v.checked){
					v.State=1;
				}
			})
		}
		//导出
		$scope.listExport=function(){
			let obj={title:['告警时间','告警信息','状态','时长（ms）','动作数值'],data:[]};
			angular.forEach($rootScope.currentAlarms,function(v,k){
				let subArr=[];
				subArr.push(v.Time,v.message,v.State,v.Duration,v.WarnValue);
				obj.data.push(subArr)
			})
			$rootScope.listExport(obj)
		}
		$scope.c3Start={};
		$scope.c3Start={};
//		$scope.mouseDown=function($e){
//			$scope.c3Start.x=$e.clientX;
//			$scope.c3Start.y=$e.clientY;
//		}
//		$scope.mouseUp=function($e){
//			$scope.c3Dif={x:$e.clientX-$scope.c3Start.x,y:$e.clientY-$scope.c3Start.y};
//			let w=parseInt($($e.target).parent('.app-center-footer').css('width'));
//			let h=parseInt($($e.target).parent('.app-center-footer').css('height'));
//			$($e.target).parent('.app-center-footer')
//				.css({'width':w+$scope.c3Dif.x+'px','height':h+$scope.c3Dif.y+'px'});
//			$('.footer-tbody').css({'maxHeight':h+$scope.c3Dif.y-92+'px'})
//		}
		//报警信息处理
		$scope.alarmsDispose=function(){
			angular.forEach($rootScope.currentAlarms,function(v){
				if(v.checked){
					v.webState=false
				}
			})
		}
	})
	//右侧控制器
	.controller("rightCtrl", function($rootScope, $scope, $state,yxRequest,toaster,$timeout) {
		//$rootScope.rtOperate();
		$timeout(function(){
			$('.app-right').Tdrag();
		},300)
		//获取当前刷新时间
		
		
		
	})
	
	//模态框控制器
	.controller("modalCtrl",function($rootScope,$scope,$state,yxLogin,toaster,yxRequest){
	
	})
	.run(['$rootScope', '$state', '$stateParams', '$timeout', '$templateCache',
		function($rootScope, $state, $stateParams, $timeout, $templateCache) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				var from = fromState.name,
					to = toState.name;
				if(from && to) { // 解决 相应模块从列表进入编辑后 状态丢失问题
					var s1 = from.substring(0, from.lastIndexOf(".")),
						g1 = from.substring(from.lastIndexOf(".") + 1),
						s2 = to.substring(0, to.lastIndexOf(".")),
						g2 = to.substring(to.lastIndexOf(".") + 1);
					if(s1 == s2) {
						if(g1 == 'list' && (g2 == 'update' || g2 == 'view')) { //进行编辑
							toParams['params'] = window.location.hash;
						}
						//返回列表
						if((g1 == "update" || g1 == 'view') && g2 == 'list') {
							var h = fromParams['params'];
							if(h) {
								$timeout(function() {
									window.location.hash = h;
								});
							}
						}
					}
				}
			});
		}

	]);
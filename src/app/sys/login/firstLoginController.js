'use strict';

angular.module('app')
	.controller('firstLoginController',[ '$rootScope', '$scope', '$http', '$state','$interval','$timeout', function($rootScope, $scope, $http, $state,$interval,$timeout) {
	
	$scope.regMobelNum = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
	$scope.newPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

	$scope.getSms = function () {
		$scope.submiting = true;
		$scope.msg = '';
		$scope.second = 60;
		$.ajax({
			//本地测试数据
			//服务器数据
			type: (qson?'POST':'POST'),
			url:(qson?testIp+"/sms/send":"/sms/send"),
			data:{mobile:$scope.telParamform.mobile}
		}).then(function(result) {
			if (result.httpCode == 200) {
				
				$scope.SMSID = result.data.id;
				$scope.step1=false;
				$scope.step2=true;
				$scope.step3=false;
				
				$scope.second = 60;
				var timer = $interval(function(){
					if($scope.second<2){$interval.cancel(timer)};
					$scope.second--;
					$scope.MsgTip = '重新获取验证码（'+$scope.second+'）';
				},1000)
				
			} else {
				$scope.msg = result.msg;
			}
			$scope.submiting = false;
			$scope.$apply();
		});
	};
	$scope.SMSconfirm = function(){
		$scope.confirming = true;
		$scope.msg = '';
		$.ajax({
			//本地测试数据
			//服务器数据
			type: (qson?'POST':'POST'),
			url:(qson?testIp+"/sms/confirm":"/sms/confirm"),
			data:{smsCode:$scope.smsCode,id:$scope.SMSID}
		}).then(function(result) {
			if (result.httpCode == 200) {

				$scope.step1=false;
				$scope.step2=false;
				$scope.step3=true;

			} else {
				$scope.msg = result.msg;
			}
			$scope.confirming = false;
			$scope.$apply();
		});
	}
	
	$scope.pwdReset = function(){
		$scope.submiting = true;
		$scope.msg = '';
		$.ajax({
			//本地测试数据
			//服务器数据
			type: (qson?'POST':'POST'),
			url:(qson?testIp+"/pwdReset":"/pwdReset"),
			data:{account:$scope.telParamform.mobile,smsCode:$scope.smsCode,id:$scope.SMSID,password:$scope.newPWD}
		}).then(function(result) {
			if (result.httpCode == 200) {
				$scope.sucessMsg = "密码修改成功，3秒后跳转到登录页";
				$timeout(function(){
					$state.go("access.login");
				},2000)
			} else {
				$scope.msg = result.msg;
			}
			$scope.submiting = false;
			$scope.$apply();
		});
	}
//		$scope.step1=false;
//		$scope.step2=false;
//		$scope.step3=true;

} ]);
'use strict';

angular.module('app')
	.controller('loginController',[ '$rootScope', '$scope', '$http', '$state','$timeout', function($rootScope, $scope, $http, $state,$timeout) {
        $scope.user = {};
        $("[data-toggle='tooltip']").tooltip();
     
        $scope.accountExamine = function(){
			if($.cookie("loginName")){
				$scope.user.account = $.cookie("loginName");
				$("#rememberUser").attr("checked","checked");
			}else{
				 
			}
		}	
		
		$scope.selectCompany = function (item) {
			if(item.flag == 1){					
				$('.selectModal').modal('hide');
					$timeout(function(){
						$state.go("main.cms.routeManage.orderRoute");
					},300); 
					return
			}
			$.ajax({
				type:'POST',
				url : (qson ? testIp+'/user/companySet':'/user/companySet'),
				data: {empId:item.employeeId,token:$scope.tokenSave}
			}).then(function(result) {
				if (result.httpCode == 200) {
					$('.selectModal').modal('hide');
					$timeout(function(){
						$state.go("main.cms.routeManage.orderRoute");
					},300)
				} else {
					$scope.msg = result.msg;
					alert($scope.msg)
				}
				$scope.$apply();
			});
		}
				
        $scope.accountExamine();
		$scope.getUserInfo = function(token){
			$scope.tokenSave = token;
			$.ajax({
				//本地测试数据
				//服务器数据l
				type: (qson?'POST':'POST'),
				url:(qson?testIp+"/user/selectPurseId":"/user/selectPurseId"),
				data:{'token':token},
			}).then(function(result) {
				if (result.httpCode == 200) {
					$scope.userInfo = result.car1UserInfo;
					if($scope.userInfo.userType == '1'){
						if($scope.empList.length == 1){
							$scope.selectCompany($scope.empList[0]);
							return;
						}
						$('.selectModal').modal('show');
					}else if($scope.userInfo.userType == '0'){
						$state.go('main.cms.YoilManage.oilTicketDistribute.distributeReview');
					}else{
						alert('你不是管理员')
					}
				} else {
					$scope.msg = result.msg;
				}
				$scope.$apply();
			});
		}
		
		$scope.login = function () {
			$scope.user.client = 'admin';
			if(qson){$state.go('main.test1');return}
			$.ajax({
				type:'POST',
				url : (qson ? testIp+'/login':'/login'),
				data: $scope.user
			}).then(function(result) {
				if (result.httpCode == 200) {
					 if($("#rememberUser").is(':checked')==true){
					 	$.cookie('loginName', $scope.user.account,{expires:7,path:'/'}); 
					 }else{
					 	$.cookie("loginName","",{expires:-1,path:'/'});
					 }
					sessionStorage.setItem("token", result.token); 	
					$scope.getUserInfo(result.token);
					$scope.empList = result.empList;
				} else {
					$scope.msg = result.msg;
//					toaster.pop('error', '', $scope.msg);
				}
				$scope.$apply();
			});
		}

		
		
} ]);  
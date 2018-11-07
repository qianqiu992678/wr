'use strict';

angular.module('app')
.controller('dzManageCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage) {

//	$.ajax({
//		type:( 'GET'),
//		url :('test/json/dzFieldName.json'),
//		success:function(result) {
//			if(global_level>4){console.log('定值数据词典：',result)}
//		  
//		},
//		error:function(data){
//			yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
//			if(global_level>1){console.log(data)}
//		}
//	});
	//定义定值信息对象
	$rootScope.dzMsgObj={upoint:[],cpoint:[],kpoint:[],icpoint:[],iupoint:[]};
	$rootScope.dzUpdateMsg={upoint:[],cpoint:[],kpoint:[],icpoint:[],iupoint:[]};
	
}]);
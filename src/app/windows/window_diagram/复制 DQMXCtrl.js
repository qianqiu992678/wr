'use strict';

angular.module('app')
.controller('DQMXCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', 'yxLogin', '$compile', 'yxWebsocket', 'Upload','yxLocalStorage',
function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, yxLogin, $compile, yxWebsocket, Upload,yxLocalStorage) {
//$rootScope.userInfo={user:1,pwd:1};
//if(!$rootScope.userInfo) {
//	$rootScope.modals.systemLoginModal = true;
//}
$rootScope.svgpageBrowsingHistory = [];
//根据url载入svg文件方法
$scope.getSvg = function(url, back) {
	$.ajax({
		type: "get",
		url: yxIp.requestIp + url,
		//url:'lib/svgFile/right.svg',
		dataType: 'text',
		success: function(data) {
			if(!back) {
				$rootScope.svgpageBrowsingHistory.push(url);
			}
			$rootScope.currentSvgUrl = url;
			if(url.split('/').length <= 3) {
				$scope.selectedFolderUrl = 'client';
			} else {
				$scope.selectedFolderUrl = url.substring(0, url.lastIndexOf('/'));
			}
			$scope.getSvgFileList();
			$scope.toSvg = url;
			if(global_level > 4) {console.log("成功：", arguments);}
			var str = $compile(data)($scope);
			var str2 = $compile(data)($scope);
			$scope.str = str;
			$('.diagram-dqmx .areaMap').html(str);
			$('.diagram-dqmx .dqmx-svgContainer').html(str2);
			
			var myDragScale = new dragScale($('.dqmx-svgContainer svg'), $('.radarArea'), $('.btn-positionReset'));
			if(!$rootScope.testdata_yaoceObj){
				$('[id^="isShowTime"]').attr({fill:'#ff0'});
			}else{
				$('[id^="isShowTime"]').attr({fill:'green'});
			}
			//console.log($rootScope.newCurrentData.yaoceObj)
			$rootScope.pipeXY={};
			$scope.lengths={};
			$rootScope.svgInitFun();
			
		},
		error: function(data) {
			yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
			if(global_level > 1) {
				console.log("失败：", arguments)
			}
			toaster.pop('error', '', '网络异常，请稍后再试...')
		}
	});
}
$timeout(function(){
	$('.radarArea').Tdrag({});
})
//根据文件夹获取文件列表
$scope.getSvgFileList = function() {
	if(!$scope.selectedFolderUrl){
		return;
	}
	if($scope.selectedFolderUrl.split('/').length <= 2) {
		$timeout(function() {
			$scope.svgFileList = angular.copy($rootScope.folderList);
		}, 500)

	} else {
		var path = $scope.selectedFolderUrl.split('/').pop();
		yxRequest.send('post', yxIp.requestIp + 'folder/files', {
				path: path
			},
			function(result) {
				$scope.svgFileList = [];
				angular.forEach(result.data, function(v) {
					$scope.svgFileList.push({
						url: v,
						isDirectory: false
					})
				})
			},
			function(data) {
				toaster.pop('error', '', data.msg)
			}, "access"
		);
	}
}
//svg画面跳转
$rootScope.svgPageGo = function(url) {
	if(!url){return;}
	if($rootScope.currentSvgUrl == url) {
		toaster.pop('warning', '', '当前页');
		return;
	}
	$scope.getSvg(url)
}
if($rootScope.currentSvgUrl) {
	$scope.getSvg($rootScope.currentSvgUrl)
} else {
	if($rootScope.userInfo) {
		$rootScope.svgPageGo('client/' + $rootScope.userInfo.user + '/index.svg');
	}
}
if($.cookie('access')&&$.cookie('username')){
	$scope.getFolderList();
	$rootScope.svgPageGo('client/'+$.cookie('username')+'/index.svg');
}else{
	$rootScope.modals.systemLoginModal = true;
}

//返回上一页
$scope.svgPageback = function() {
	if($rootScope.svgpageBrowsingHistory.length <= 1) {
		toaster.pop('warning', '', '已经是第一页了')
		return;
	}
	$rootScope.svgpageBrowsingHistory.pop();
	$scope.getSvg($rootScope.svgpageBrowsingHistory[$rootScope.svgpageBrowsingHistory.length - 1], 1)
}
/**********************************/
$interval(function(){
	$scope.interval1s=!$scope.interval1s;
},1000)
$scope.showRadar = false;
//$scope.$watch('showRadar', function() {
//  //console.log($scope.showRadar); 
//  if($scope.showRadar){
//  	console.log($scope.showRadar)
//  	$('.radarArea').css({'height':'150px'})
//  }else{
//  	$('.radarArea').css({'visibility':'0'})
//  }
//});
//获取二维数组测试数据
$scope.getTestData=function(str){
	if(str=='2dArr1'){
		$.ajax({
			type:"get",
			url:"src/testData/2dArr1.json",
			async:false,
			success:function(data){
				$scope.arr2d1=data;
			}
		});
	}else if(str=='2dArr2'){
		$.ajax({
			type:"get",
			url:"src/testData/2dArr2.json",
			async:false,
			success:function(data){
				$scope.arr2d1=data;
			}
		});
	}else if(str=='alarm_protect'){
		$.ajax({
			type:"get",
			url:"src/testData/alarm_protect.json",
			async:false,
			success:function(data){
				$scope.alarm_protect=data;
			}
		});
	}else if(str=='newCurrentData'){
		$.ajax({
			type:"get",
			url:"src/testData/newcurrentdata.json",
			async:false,
			success:function(data){		
				$rootScope.newCurrentData=data;
				for(let k in $rootScope.newCurrentData.yaoceObj){
					$rootScope.newCurrentData.yaoceObj[k].value.toFixed(2)
				}
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()});
			}
		});
	}
	$rootScope.svgInitFun();
}
//进入演示模式，设置服务器模式，不处理ws返回数据

$scope.showTimeCheck=function(){
	if($rootScope.testdata_yaoceObj){
		$rootScope.testdata_yaoceObj=null;
		$('[id^="isShowTime"]').attr({fill:'#ff0'});
	}else{
		$('[id^="isShowTime"]').attr({fill:'green'});
		//获取testdata_yaoce
		$.ajax({
			type:"get",
			url:"src/app/windows/testdata_yaoce.json",
			async:true,
			success:function(data){		
				$rootScope.testdata_yaoceObj=data;
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()});
			}
		});
	}
	if($rootScope.testdata_yaoxinObj){
		$rootScope.testdata_yaoxinObj=null
	}else{
		//获取testdata_yaoxin
		$.ajax({
			type:"get",
			url:"src/app/windows/testdata_yaoxin.json",
			async:true,
			success:function(data){		
				$rootScope.testdata_yaoxinObj=data;
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()});
			}
		});
	}	
}

$scope.itvs=[];

$rootScope.svgInitFun = function() {
	//对温度计组件的处理--wenduji
	angular.forEach($('[id^="wenduji"]'), function(v, k) {
		let dz1 = $(v).attr('dz1') || undefined;
		let dz2 = $(v).attr('dz2') || undefined;
		let wendujiObj = {}
		wendujiObj.x = parseFloat($(v).find('.tempBox').attr('x'));
		wendujiObj.y = parseFloat($(v).find('.tempBox').attr('y'));
		wendujiObj.width = parseFloat($(v).find('.tempBox').attr('width'));
		wendujiObj.height = parseFloat($(v).find('.tempBox').attr('height'));
		wendujiObj.Address = $(v).attr('address');
		let currentObj = {};
		let displayValue = $rootScope.newCurrentData.yaoceObj[wendujiObj.Address].value % 50;
		displayValue = displayValue >= 0 ? displayValue : displayValue + 50;
		$scope.originPosition = $rootScope.newCurrentData.yaoceObj[wendujiObj.Address].value - displayValue;
		if($scope.originPosition != 0 && displayValue == 0) {
			displayValue = 50;
			$scope.originPosition -= 50;
		}
		let value = displayValue * wendujiObj.height / 50;
		if($rootScope.newCurrentData.yaoceObj[wendujiObj.Address].value > dz2) {
			$(v).find('.currentTemp').attr('fill', 'red');
		} else if($rootScope.newCurrentData.yaoceObj[wendujiObj.Address].value < dz1) {

			$(v).find('.currentTemp').attr('fill', 'orange');
		} else {
			$(v).find('.currentTemp').attr('fill', 'green');
		}
		currentObj.x = wendujiObj.x;
		currentObj.y = wendujiObj.y + wendujiObj.height - value;
		currentObj.height = value;
		currentObj.width = wendujiObj.width;
		$(v).find('.currentTemp').attr(currentObj);
	})
	//对柱状图的处理 --zhuzhuangtu
	angular.forEach($('[id^="zhuzhuangtu"]'), function(v, k) {
		if(!$scope[$(v).attr('arrdata')]) {
			return
		};
		let histogramObj = {};
		histogramObj.data = $scope[$(v).attr('arrdata')]; //数据
		histogramObj.zzRange = {}; //数据中的最值
		histogramObj.zzRange.max = 100; //最大值
		histogramObj.zzRange.min = 0; //最小值
		histogramObj.range = {}; //纵轴量程范围
		histogramObj.range.min = 0;
		histogramObj.range.max = 100;
		histogramObj.items = null; //项目列表（jq对象）
		histogramObj.size = {}; //两轴长度
		histogramObj.size.x = $(v).find('[id^="hzZzt"]').attr('x2') - $(v).find('[id^="hzZzt"]').attr('x1')
		histogramObj.size.y = $(v).find('[id^="zzZzt"]').attr('y1') - $(v).find('[id^="zzZzt"]').attr('y2')
		//获取项目列表
		histogramObj.items = $(v).find('[class^="barZzt"]');
		//设置rect高度及位置
		angular.forEach(histogramObj.items, function(v1, k1) {
			angular.forEach($(v1).find('rect'), function(v2, k2) {
				let height = parseFloat(histogramObj.data[k2][k1 + 1].value / (histogramObj.range.max - histogramObj.range.min) * histogramObj.size.y);
				let y = parseFloat(v2.attributes.y.value) - height + parseFloat(v2.attributes.height.value);
				$(v2).attr({
					'height': height,
					'y': y
				});
			})
		})

		//找到最大值最小值
		for(let i = 0; i < histogramObj.data.length; i++) {
			for(let j = 1; j < histogramObj.data[i].length; j++) {
				if(histogramObj.data[i][j] < histogramObj.min) {
					//histogramObj.zzRange.min=histogramObj.data[i][j];
				}
				if(histogramObj.data[i][j] > histogramObj.max) {
					//histogramObj.zzRange.max=histogramObj.data[i][j]
				}
			}
		}
		//设置纵轴 轴标
		angular.forEach($(v).find('[id^="zzzb"] text'), function(v, k) {
			$(v).html(histogramObj.zzRange.min + (histogramObj.zzRange.max - histogramObj.zzRange.min) / 5 * k);
		})
	})
	//对   灯A的处理    
	angular.forEach($('[id^="lampAWIDGET"]'), function(v, k) {
		let attrs = v.attributes;
		if($rootScope.newCurrentData.yaoxinObj[attrs.address.value]){
			if($rootScope.newCurrentData.yaoxinObj[attrs.address.value].value) {
				var color = 'green'
			} else {
				var color = 'red'
			}
		}else{
			var color = 'blue'
		}
			
		$(v).find('[id^="colorIndicate"] path').attr({
			'fill': color
		})
	})
	//对管道处理
	angular.forEach($('[id^="pipeWIDGET"]'),function(v){
		let attrs=v.attributes;
		let signaltype=attrs.signaltype.nodeValue;
		let value=$rootScope.newCurrentData[signaltype][attrs.address.nodeValue].value;
		let pipediameter=parseFloat(attrs.diameter.nodeValue);
		//console.log(value);
		$scope.horizontalBackDirect=function(value){
			let dx=0;
			setInterval(function(){
				dx-=1;
				if(dx<=0){
					dx+=pipediameter;
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let x=parseFloat($(val).attr('x'))-1;
						$(val).attr({'x':x+pipediameter});
					});
				}else{
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let x=parseFloat($(val).attr('x'))-1;
						$(val).attr({'x':x});
					});
				}	
			},500)
			//},1/value*1000)
		}
		$scope.horizontalRightDirect=function(value){
			let dx=0;
			setInterval(function(){
				dx+=1;
				if(dx>=pipediameter){
					dx-=pipediameter;
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let x=parseFloat($(val).attr('x'))+1;
						$(val).attr({'x':x-pipediameter});
					});
				}else{
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let x=parseFloat($(val).attr('x'))+1;
						$(val).attr({'x':x});
					});
				}	
			},500)
			//},1/value*100)
		}
		$scope.longitudinalBackDirect=function(value){
			let dy=0;
			setInterval(function(){
				dy-=1;
				if(dy<=0){
					dy+=pipediameter;
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let y=parseFloat($(val).attr('y'))-1;
						$(val).attr({'y':y+pipediameter});
					});
				}else{
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let y=parseFloat($(val).attr('y'))-1;
						$(val).attr({'y':y});
					});
				}	
			//},1/value*1000)
			},500)
		}
		$scope.longitudinalRightDirect=function(value){
			let dy=0;
			setInterval(function(){
				dy+=1;
				if(dy>=pipediameter){
					dy-=pipediameter;
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let y=parseFloat($(val).attr('y'))+1;
						$(val).attr({'y':y-pipediameter});
					});
				}else{
					angular.forEach($(v).find('[id^="indicators"] rect:not(.fixed)'),function(val){
						let y=parseFloat($(val).attr('y'))+1;
						$(val).attr({'y':y});
					});
				}	
			},500)
			//},1/value*100)
		}
		if(attrs.pipedirect.nodeValue=='horizontal'){
			if(attrs.opposite.nodeValue!='0'){
				if(value>0){
					$scope.horizontalBackDirect(Math.abs(value));
				}else if(value<0){
					$scope.horizontalRightDirect(Math.abs(value));
				}
			}else{
				if(value>0){
					$scope.horizontalRightDirect(Math.abs(value));
				}else if(value<0){
					$scope.horizontalBackDirect(Math.abs(value));
				}
				
			}
		}else if(attrs.pipedirect.nodeValue=='longitudinal'){
			if(attrs.opposite.nodeValue!='0'){
				if(value>0){
					$scope.longitudinalBackDirect(Math.abs(value));
				}else if(value<0){
					$scope.longitudinalRightDirect(Math.abs(value));
				}
			}else{
				if(value>0){
					$scope.longitudinalRightDirect(Math.abs(value));
				}else if(value<0){
					$scope.longitudinalBackDirect(Math.abs(value));
				}
				
			}
				
		}
			
	})
	//对新管道的处理
	for(let i=0;i<$scope.itvs.length;i++){
		$interval.cancel($scope.itvs[i]);
		$scope.itvs[i]=null;
	}
	$scope.itvs=[];
	
	
	
	angular.forEach($('[id^="newPipeWIDGET"]'),function(v,k1){
		$scope.lengths[k1]=$scope.lengths[k1]||$(v).find('[id^="fillLine"] line').length-1;
		$rootScope.pipeXY[k1]=$rootScope.pipeXY[k1]||{};
		let value;
		if($(v).attr('signalType')=='yaoceObj'){
			value=Number($rootScope.newCurrentData.yaoceObj[$(v).attr('address')].value);
		}else if($(v).attr('signalType')=='yaoxinObj'){
			value=Number($rootScope.newCurrentData.yaoxinObj[$(v).attr('address')].value)=='1'?'50':'0'
		}
		let dx=0,dy=0;
		let width=Number($(v).attr('width'));
		let width5=width*5;
		
		let endPos=Number($(v).attr('endPos'));
		
		angular.forEach($(v).find('[id^="fillLine"] line'),function(line,k){
			if($(v).attr("pipedirect")=="horizontal"){
				$rootScope.pipeXY[k1][k]=$rootScope.pipeXY[k1][k]||Number($(line).attr('x1'))
			}
			if($(v).attr("pipedirect")=="longitudinal"){
				$rootScope.pipeXY[k1][k]=$rootScope.pipeXY[k1][k]||Number($(line).attr('y1'));
			}
		})
		
		let opposite=$(v).attr('opposite');
		$scope.itvs[k1]=$interval(function(){
			dx+=3;
			dy+=3;
			if(dx>width5){
				dx=0;
			}
			if(dy>width5){
				dy=0;
			}
			
			angular.forEach($(v).find('[id^="fillLine"] line'),function(line,k){
				
				//判断管子的方向
				if($(v).attr("pipedirect")=="horizontal"){
					if(opposite=='0'){
						if(value>0){
							if(k==$scope.lengths[k1]){
								if(dx+$rootScope.pipeXY[k1][k]>endPos){
									$(line).css({display:'none'})
								}else{
									$(line).css({display:'block'})
								}
							}
							$(line).attr({'x1':$rootScope.pipeXY[k1][k]+dx,'x2':$rootScope.pipeXY[k1][k]+dx});
						}else if(value<0){
							if(k==0){
								$(line).css({display:'none'})
							}
							$(line).attr({'x1':$rootScope.pipeXY[k1][k]-dx,'x2':$rootScope.pipeXY[k1][k]-dx});
						}else{}
					}else{
						if(value>0){
							if(k==$scope.lengths[k1]){
								if($rootScope.pipeXY[k1][k]-dx<endPos){
									$(line).css({display:'none'})
								}else{
									$(line).css({display:'block'})
								}
							}
							$(line).attr({'x1':$rootScope.pipeXY[k1][k]-dx,'x2':$rootScope.pipeXY[k1][k]-dx})
						}else if(value<0){
							if(k==0){
								$(line).css({display:'none'})
							}
							$(line).attr({'x1':$rootScope.pipeXY[k1][k]+dx,'x2':$rootScope.pipeXY[k1][k]+dx});
						}else{}	
					}
				}else if($(v).attr("pipedirect")=="longitudinal"){
					if(opposite=='0'){
						if(value>0){
							if(k==$scope.lengths[k1]){
								if(dy+$rootScope.pipeXY[k1][k]>endPos){
									$(line).css({display:'none'})
								}else{
									$(line).css({display:'block'})
								}
							}
							$(line).attr({'y1':$rootScope.pipeXY[k1][k]+dy,'y2':$rootScope.pipeXY[k1][k]+dy});
						}else if(value<0){
							if(k==0){
								$(line).css({display:'none'})
							}
							$(line).attr({'y1':$rootScope.pipeXY[k1][k]-dy,'y2':$rootScope.pipeXY[k1][k]-dy});
						}else{}
					}else{
						if(value>0){
							if(k==$scope.lengths[k1]){
								if($rootScope.pipeXY[k1][k]-dy<endPos){
									$(line).css({display:'none'})
								}else{
									$(line).css({display:'block'})
								}
							}
							$(line).attr({'y1':$rootScope.pipeXY[k1][k]-dy,'y2':$rootScope.pipeXY[k1][k]-dy})
						}else if(value<0){
							if(k==0){
								$(line).css({display:'none'})
							}
							$(line).attr({'y1':$rootScope.pipeXY[k1][k]+dy,'y2':$rootScope.pipeXY[k1][k]+dy});
						}else{}	
					}
				}
			})
		},300);
		//},1/Math.abs(value)*1000)
	})
}
//组件方法————lampAWIDGET
$scope.lampAWIDGET_fun = function(e) {
	let attrs = e.target.attributes;
	if(global_level>4){
		console.log(attrs,attrs.address.value)
	}
	$rootScope.newCurrentData.yaoxinObj[attrs.address.value].value = !$rootScope.newCurrentData.yaoxinObj[attrs.address.value].value;
	$rootScope.svgInitFun();
}
//显示控制组件的方法
$scope.showcontrollorWIDGET_fun = function(e, close) {
	let str
	if(close) {
		str = $(e.target).parent().parent().parent('[id^="showcontrolWIDGET"]').attr('id');
	} else {
		str = $(e.target).parents('[id^="showcontrolWIDGET"]').attr('id');
	}
	$scope[str] = !$scope[str];
}
$scope.getTestData('alarm_protect');
}]);
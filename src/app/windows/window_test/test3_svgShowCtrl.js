'use strict';
angular.module('app')
.controller('test3_svgShowCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','$compile',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,$compile) {
	//console.log('test3_svgShowCtrl');
	//获取svg文件
	$.ajax({
		type:"get",
		url:"src/app/windows/window_test/svgFile/AISvgShow.svg",
		dataType:'text',
		success:function(data){
			if(global_level>4){
					console.log("成功：",arguments);	
				}
			var str=$compile(data)($scope);
			$('.test3_svgShow').html(str);
			$scope.svgInitFun();
		},
		error:function(){
			if(global_level>1){
					console.log("失败：",arguments)	
					}
			
		}
	});
	//普通按钮b
	$scope.btnBOpt=function(e){
		console.log('btnB:',e)
	}
	//普通按钮a
	$scope.btnAOpt=function(e){
		console.log('btnA:',e)
		console.log($(e.target))
	}
	//控制开关
	$scope.controlSwitchOpt=function(e){
		console.log('controlSwitchOpt:',e);
	}
	//定义数据
	$rootScope.newCurrentData={
		yaoxinObj:{
			'1':{value:1},
			'2':{value:0},
			'3':{value:0},
			'4':{value:1},
			'5':{value:1},
			'6':{value:1}
		},
		yaoceObj:{
			'1':{value:'2'},
			'4':{value:'8'},
			'3':{value:'50'},
			'2':{value:'50'},
			'5':{value:'150'},
			'6':{value:'10'}
		}
	}
	
	//自定义svg列表
	$scope.svgList=[]
	$scope.svgBrowserLog=[];
	$scope.getSvg=function(url){
		$.ajax({
			type:"get",
			url:url,
			dataType:'text',
			success:function(data){
				$scope.svgBrowserLog.push(url)
				var str=$compile(data)($scope);
				$('.test3_svgShow').html(str);
				$scope.svgInitFun();
			},
			error:function(){
				if(global_level>1){
				console.log("失败：",arguments)	
				}
				
			}
		});
	}
	$interval(function(){
		$scope.interval1s=!$scope.interval1s;
	},1000)
	$scope.svgInitFun=function(){
		console.log('svgInitFun');
		//对温度计组件的处理--wenduji
		angular.forEach($('[id^="wenduji"]'),function(v,k){
			let dz1=$(v).attr('dz1')||undefined;
			let dz2=$(v).attr('dz2')||undefined;
			let wendujiObj={}
			wendujiObj.x=parseFloat($(v).find('.tempBox').attr('x'));
			wendujiObj.y=parseFloat($(v).find('.tempBox').attr('y'));
			wendujiObj.width=parseFloat($(v).find('.tempBox').attr('width'));
			wendujiObj.height=parseFloat($(v).find('.tempBox').attr('height'));
			wendujiObj.Address=$(v).attr('address');
			let currentObj={};
			let displayValue=$scope.newCurrentData.yaoceObj[wendujiObj.Address].value%50;
			displayValue=displayValue>=0?displayValue:displayValue+50;
			$scope.originPosition=$scope.newCurrentData.yaoceObj[wendujiObj.Address].value-displayValue;
			if($scope.originPosition!=0&&displayValue==0){
				displayValue=50;
				$scope.originPosition-=50;
			}
			let value=displayValue*wendujiObj.height/50;
			if($scope.newCurrentData.yaoceObj[wendujiObj.Address].value>dz2){
				$(v).find('.currentTemp').attr('fill','red');
			}else if($scope.newCurrentData.yaoceObj[wendujiObj.Address].value<dz1){
				
				$(v).find('.currentTemp').attr('fill','orange');
			}else{
				$(v).find('.currentTemp').attr('fill','green');
			}
			currentObj.x=wendujiObj.x;
			currentObj.y=wendujiObj.y+wendujiObj.height-value;
			currentObj.height=value;
			currentObj.width=wendujiObj.width;
			//console.log(currentObj);
			$(v).find('.currentTemp').attr(currentObj);
		})
		//对柱状图的处理 --zhuzhuangtu
		angular.forEach($('[id^="zhuzhuangtu"]'),function(v,k){
			if(!$scope[$(v).attr('arrdata')]){return};
			let histogramObj={};
			histogramObj.data=$scope[$(v).attr('arrdata')];//数据
			histogramObj.zzRange={};//数据中的最值
			histogramObj.zzRange.max=100;//最大值
			histogramObj.zzRange.min=0;//最小值
			histogramObj.range={};//纵轴量程范围
			histogramObj.range.min=0;
			histogramObj.range.max=100;
			histogramObj.items=null;//项目列表（jq对象）
			histogramObj.size={};//两轴长度
			histogramObj.size.x=$(v).find('[id^="hzZzt"]').attr('x2')-$(v).find('[id^="hzZzt"]').attr('x1')
			histogramObj.size.y=$(v).find('[id^="zzZzt"]').attr('y1')-$(v).find('[id^="zzZzt"]').attr('y2')
			//console.log(histogramObj.size)
			//获取项目列表
			histogramObj.items=$(v).find('[class^="barZzt"]');
			//console.log(histogramObj.items)
			//设置rect高度及位置
			angular.forEach(histogramObj.items,function(v1,k1){
				angular.forEach($(v1).find('rect'),function(v2,k2){
					//console.log(v2.attributes.height.value);
					//console.log(histogramObj.data[k2][k1+1].value);
					let height=parseFloat(histogramObj.data[k2][k1+1].value/(histogramObj.range.max-histogramObj.range.min)*histogramObj.size.y);
					//console.log(v2.attributes.y.value,height-v2.attributes.height.value)
					let y=parseFloat(v2.attributes.y.value)-height+parseFloat(v2.attributes.height.value);
					//console.log(parseFloat(v2.attributes.y.value),height,v2.attributes.height.value)
					$(v2).attr({'height':height,'y':y});
				})
			})
			
			//找到最大值最小值
			for(let i=0;i<histogramObj.data.length;i++){
				for(let j=1;j<histogramObj.data[i].length;j++){
					if(histogramObj.data[i][j]<histogramObj.min){
						//histogramObj.zzRange.min=histogramObj.data[i][j];
					}
					if(histogramObj.data[i][j]>histogramObj.max){
						//histogramObj.zzRange.max=histogramObj.data[i][j]
					}
				}
			}
			//设置纵轴 轴标
			angular.forEach($(v).find('[id^="zzzb"] text'),function(v,k){
				console.log(v,k);
				$(v).html(histogramObj.zzRange.min+(histogramObj.zzRange.max-histogramObj.zzRange.min)/5*k);
			})
		})
		//对   灯A的处理    
		angular.forEach($('[id^="lampAWIDGET"]'),function(v,k){
			let attrs=v.attributes;
			//console.log(attrs,$scope.newCurrentData.yaoxinObj);
			if($scope.newCurrentData.yaoxinObj[attrs.address.value].value){
				var color='green'
			}else{
				var color='red'
			}
			$(v).find('[id^="colorIndicate"] path').attr({'fill':color})
		})
		//对可拖动表格的处理
		angular.forEach($('[id^="dragableWIDGET"]'),function(v){
//			console.log($(v).find('[id^="dragele"]')[0])
//			$(v).find('[id^="dragele"]').draggable()
		})
		//对管道处理
		angular.forEach($('[id^="pipeWIDGET"]'),function(v){
			let attrs=v.attributes;
			
			let signaltype=attrs.signaltype.nodeValue;
			let value=$rootScope.newCurrentData[signaltype][attrs.address.nodeValue].value;
			let pipediameter=parseFloat(attrs.diameter.nodeValue);
			
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
				},1/value*10)
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
				},1/value*1)
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
				},1/value*10)
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
				},1/value*10)
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
		
//		$timeout(function(){
//			for(let i=0;i<$scope.itvs.length;i++){
//				$interval.cancel($scope.itvs[i]);
//				$scope.itvs[i]=null
//			}
//			$scope.itvs=[];
//		},3000);
		$scope.itvs=[];
		angular.forEach($('[id^="newPipeWIDGET"]'),function(v,k1){
			let value;
			if($(v).attr('signalType')=='yaoceObj'){
				value=Number($rootScope.newCurrentData.yaoceObj[$(v).attr('address')].value);
			}else if($(v).attr('signalType')=='yaoxinObj'){
				value=Number($rootScope.newCurrentData.yaoxinObj[$(v).attr('address')].value)=='1'?'50':'0'
			}
			let dx=0,dy=0;
			let width=Number($(v).attr('width'));
			let width5=width*5;
			let x={},y={};
			let endPos=Number($(v).attr('endPos'));
			angular.forEach($(v).find('[id^="fillLine"] line'),function(line,k){
				if($(v).attr("pipedirect")=="horizontal"){
					x[k]=x[k]||Number($(line).attr('x1'));
				}
				if($(v).attr("pipedirect")=="longitudinal"){
					y[k]=y[k]||Number($(line).attr('y1'));
				}
			})
			let opposite=$(v).attr('opposite');
			$scope.itvs[k1]=$interval(function(){
				dx+=1;
				dy+=1;
				if(dx>width5){
					dx=0;
				}
				if(dy>width5){
					dy=0;
				}
				
				angular.forEach($(v).find('[id^="fillLine"] line'),function(line,k){
					
					//判断管子的方向
					if($(v).attr("pipedirect")=="horizontal"){
						//x[k]=x[k]||Number($(line).attr('x1'));
						if(opposite=='0'){
							if(value>0){
								if(k==$(v).find('[id^="fillLine"] line').length-1){
									if(dx+x[k]>endPos){
										$(line).css({display:'none'})
									}else{
										$(line).css({display:'block'})
									}
								}
								$(line).attr({'x1':x[k]+dx,'x2':x[k]+dx});
							}else if(value<0){
								if(k==0){
									$(line).css({display:'none'})
								}
								$(line).attr({'x1':x[k]-dx,'x2':x[k]-dx});
							}else{}
						}else{
							if(value>0){
								if(k==$(v).find('[id^="fillLine"] line').length-1){
									if(x[k]-dx<endPos){
										
										$(line).css({display:'none'})
									}else{
										$(line).css({display:'block'})
									}
								}
								$(line).attr({'x1':x[k]-dx,'x2':x[k]-dx})
							}else if(value<0){
								if(k==0){
									$(line).css({display:'none'})
								}
								$(line).attr({'x1':x[k]+dx,'x2':x[k]+dx});
							}else{}	
						}
					}else if($(v).attr("pipedirect")=="longitudinal"){
						//y[k]=y[k]||Number($(line).attr('y1'));
						if(opposite=='0'){
							if(value>0){
								if(k==$(v).find('[id^="fillLine"] line').length-1){
									if(dy+y[k]>endPos){
										$(line).css({display:'none'})
									}else{
										$(line).css({display:'block'})
									}
								}
								$(line).attr({'y1':y[k]+dy,'y2':y[k]+dy});
							}else if(value<0){
								if(k==0){
									$(line).css({display:'none'})
								}
								$(line).attr({'y1':y[k]-dy,'y2':y[k]-dy});
							}else{}
						}else{
							if(value>0){
								if(k==$(v).find('[id^="fillLine"] line').length-1){
									if(y[k]-dy<endPos){
										$(line).css({display:'none'})
									}else{
										$(line).css({display:'block'})
									}
								}
								$(line).attr({'y1':y[k]-dy,'y2':y[k]-dy})
							}else if(value<0){
								if(k==0){
									$(line).css({display:'none'})
								}
								$(line).attr({'y1':y[k]+dy,'y2':y[k]+dy});
							}else{}	
						}
					}
				})
			},20);
			//},1/Math.abs(value)*10000)
		})
	}
	$scope.lampAWIDGET_fun=function(e){
		let attrs=e.target.attributes;
		$scope.newCurrentData.yaoxinObj[attrs.address.value].value=!$scope.newCurrentData.yaoxinObj[attrs.address.value].value;
		$rootScope.svgInitFun();
	}
	$scope.showcontrollorWIDGET_fun=function(e,close){
		let str;
		if(close){
			str=$(e.target).parent().parent().parent('[id^="showcontrolWIDGET"]').attr('id');
			console.log(str)
		}else{
			str=$(e.target).parent('[id^="showcontrolWIDGET"]').attr('id');
			console.log(str)
		}
		$scope[str]=!$scope[str];
	}
}]);












//对新管道的处理
//		angular.forEach($('[id^="newPipeWIDGET"]'),function(v){
//			
//			angular.forEach($(v).find('[id^="fillLine"] line'),function(line,k){
//				let value=Number($rootScope.newCurrentData[$(v).attr('signalType')][$(v).attr('address')].value);
//				if(value>50)value=50;
//				if(value<-50)value=-50;
//				let dx=0,dy=0;
//				let x=Number($(line).attr('x1')),y=Number($(line).attr('y1'));
//				
//				setInterval(function(){
//					//判断管子的方向
//					if($(v).attr("pipedirect")=="horizontal"){
//						if($(v).attr('opposite')=='0'){
//							dx++;
//							if(dx>Number($(v).attr('width'))*5){
//								dx=0;
//							}
//							if(value>0){
//								if(k==$(v).find('[id^="fillLine"] line').length-1){
//									if(dx+x>Number($(v).attr('endPos'))){
//										$(line).css({display:'none'})
//									}else{
//										$(line).css({display:'block'})
//									}
//								}
//								$(line).attr({'x1':x+dx,'x2':x+dx});
//							}else if(value<0){
//								if(k==0){
//									$(line).css({display:'none'})
//								}
//								$(line).attr({'x1':x-dx,'x2':x-dx});
//							}else{}
//							
//						}else{
//							dx++;
//							if(dx>Number($(v).attr('width'))*5){
//								dx=0;
//							}
//							if(value>0){
//								if(k==$(v).find('[id^="fillLine"] line').length-1){
//									if(x-dx<Number($(v).attr('endPos'))){
//										$(line).css({display:'none'})
//									}else{
//										$(line).css({display:'block'})
//									}
//								}
//								$(line).attr({'x1':x-dx,'x2':x-dx})
//							}else if(value<0){
//								if(k==0){
//									$(line).css({display:'none'})
//								}
//								$(line).attr({'x1':x+dx,'x2':x+dx});
//							}else{}	
//						}
//					}else{
//						if($(v).attr('opposite')=='0'){
//							dy++;
//							if(dy>=Number($(v).attr('width'))*5){
//								dy=0;
//							}
//							if(value>0){
//								if(k==$(v).find('[id^="fillLine"] line').length-1){
//									if(dy+y>Number($(v).attr('endPos'))){
//										$(line).css({display:'none'})
//									}else{
//										$(line).css({display:'block'})
//									}
//								}
//								$(line).attr({'y1':y+dy,'y2':y+dy});
//							}else if(value<0){
//								if(k==0){
//									$(line).css({display:'none'})
//								}
//								$(line).attr({'y1':y-dy,'y2':y-dy});
//							}else{}
//						}else{
//							dy++;
//							if(dy>Number($(v).attr('width'))*5){
//								dy=0;
//							}
//							if(value>0){
//								if(k==$(v).find('[id^="fillLine"] line').length-1){
//									if(y-dy<Number($(v).attr('endPos'))){
//										$(line).css({display:'none'})
//									}else{
//										$(line).css({display:'block'})
//									}
//								}
//								$(line).attr({'y1':y-dy,'y2':y-dy})
//							}else if(value<0){
//								if(k==0){
//									$(line).css({display:'none'})
//								}
//								$(line).attr({'y1':y+dy,'y2':y+dy});
//							}else{}	
//						}
//					}
//					
//				},1/Math.abs(value)*100)
//			})
//		})

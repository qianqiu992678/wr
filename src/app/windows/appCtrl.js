'use strict';

angular.module('app')
.controller('appCtrl', ['$location','$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','yxLocalStorage','yxWebsocket',
function($location,$filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,yxLocalStorage,yxWebsocket) {
	$rootScope.sleep=function(numberMillis) {    
		var now = new Date();    
		var exitTime = now.getTime() + numberMillis;   
		while (true) { 
			now = new Date();       
			if (now.getTime() > exitTime) 
			return;    
		} 
	};
	$rootScope.centerFooter=1;
	$rootScope.serverProtect={
    	closeTimer:null,
    	closeTimerStart:function(){
    		this.closeTimer=$timeout(function(){
    			yxLocalStorage.arrAdd({type:'info',msg:'长时间无操作自动关闭一次',time:new Date()});
    			window.location.href='about:blink';
    		},600000)
    	},
    	closeTimerReset:function(){
      		this.closeTimerRemove();
    		this.closeTimerStart();
    	},
    	closeTimerRemove:function(){
    		$timeout.cancel(this.closeTimer)
    		this.closeTimer=null;
    	}
    }
	
    $rootScope.isServer=true;
	$scope.localUrl=window.location.host.split(':').shift();
	if($scope.localUrl!='127.0.0.1'&&$scope.localUrl!='localhost'){
		$rootScope.isServer=false;
	}
	if($rootScope.isServer){
	    $('html.station').on('keydown mousemove mousedown', function(e) {
	        e.stopPropagation();
	        $rootScope.serverProtect.closeTimerReset();
	        if(e.keyCode==116&&($state.current.name=='main.diagram.SJYZT.yaoxin'||$state.current.name=='main.power.DNZLZHCX.DNZLLogWaveform')){
	        	alert('这个页面用到上一页面数据，不让刷新');
	        	e.preventDefault();
	        }
	    });
	    $rootScope.serverProtect.closeTimerStart();
	}
	//电能质量历史数据--查询参数
	$rootScope.dnzllogParam={};
	
	//监听路由变化，改变maxHeight属性
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		$rootScope.truecheck=[];
		$rootScope.falsecheck=[];
		$rootScope.check.checkedAll = false;
    })  
    //判断是否有登录信息
	if($.cookie('access')){
		$rootScope.hasUserInfo=true;
	}
	//中3区显示方法
	$rootScope.showFooter=function(){
		$rootScope.centerFooter=($rootScope.centerFooter==1?0:1);
	}
	//右侧显示方法
	$rootScope.showRight=function(){
		$rootScope.rightSide=($rootScope.rightSide==1?0:1);
	}
	//模态框
	$rootScope.modals={};
	$rootScope.currentAlarms=[];
	$rootScope.recordFiles=[];
	
	$scope.operateList=[];//实时操作记录数组
	//$scope.obj={name:'name',age:22}
	
	$scope.heartCheck={
		timeout:20000,
		timeoutObj:null,
		reset:function(){
			$timeout.cancel(this.timeoutObj);
			this.timeoutObj=null;
			this.start();
		},
		start:function(){
			this.timeoutObj=$timeout(function(){
				console.log('wsconnect')
				$scope.wsConnect();
				yxLocalStorage.arrAdd({type:'warning',msg:'ws reconnect',time:new Date()});
			},this.timeout)
		}
	}
	//对测试数据random
	$scope.randomTestDataYaoxinObj=function(){
		for(var key in $rootScope.testdata_yaoxinObj){
			if(key!=-10000&&key!=-10001){
				$rootScope.testdata_yaoxinObj[key].value=(Math.random()>0.5?1:0);
			}
		}
		//console.log($rootScope.testdata_yaoxinObj);
	};
	$scope.randomTestDataYaoceObj=function(){
		for(var key in $rootScope.testdata_yaoceObj){
			if(key>-51){
				//电流
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.04-0.02).toFixed(3);
			}else if(key>-101){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.4-0.2).toFixed(3);
			}else if(key>-151){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.6-0.3).toFixed(3);
			}else if(key>-201){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.8-0.4).toFixed(3);
			}else if(key>-251){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()-0.5).toFixed(3);
			}else if(key>-301){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*1.2-0.6).toFixed(3);
			}else if(key>-351){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*1.4-0.7).toFixed(3);
			}else if(key>-401){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*1.6-0.8).toFixed(3);
			}else if(key>-451){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*1.8-0.9).toFixed(3);
			}else if(key>-501){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*2-1).toFixed(3);
			}else if(key>-551){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*2.2-1.1).toFixed(3);
			}else if(key>-601){
				//电压
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*2-1).toFixed(3);
			}else if(key>-651){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*4-2).toFixed(3);
			}else if(key>-701){
				$rootScope.testdata_yaoceObj[key].value=(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-751){
				//温度
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-801){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-851){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-901){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-951){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-1001){
				//电能
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1).toFixed(3);
			}else if(key>-1051){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.2).toFixed(3);
			}else if(key>-1101){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.3).toFixed(3);
			}else if(key>-1151){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.4).toFixed(3);
			}else if(key>-1201){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.5).toFixed(3);
			}else if(key>-1251){
				//功率因数
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.004-0.002).toFixed(4);
			}else if(key>-1301){
				//功率
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*0.1-0.05).toFixed(3);
			}else if(key>-1351){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*1-0.5).toFixed(3);
			}else if(key>-1401){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*2-1).toFixed(3);
			}else if(key>-1451){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*4-2).toFixed(3);
			}else if(key>-1501){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*6-3).toFixed(3);
			}else if(key>-1551){
				$rootScope.testdata_yaoceObj[key].value=
					(parseFloat($rootScope.testdata_yaoceObj[key].value)+Math.random()*10-5).toFixed(3);
			}else if(key>-1601){
				let r=Math.random();
				$rootScope.testdata_yaoceObj[key].value=r>0.75?4:r>0.5?3:r>0.25?2:1;
			}
		}
		//console.log($rootScope.testdata_yaoceObj);
	};
	
	
	$rootScope.wsTablemsg=function(messageData){
		
		if(!$rootScope.dictionaryMsg){
			$scope.getdictionary();
			return;
		}
		$rootScope.currentData={YaoXin:[],YaoCe:[],YaoMai:[]};
		$rootScope.newCurrentData={YaoXin:[],YaoCe:[],YaoMai:[],yaoxin:[],yaoce:[],yaomai:[],yaoxinObj:{},yaomaiObj:{},yaoceObj:{}}
		console.log('处理数据');
		angular.forEach(messageData.data.YaoCe,function(v,k){
			if($rootScope.dictionaryMsg.YaoCe[k]){
				v=v.toFixed(4).toString();
				let obj={};
				obj.name=$rootScope.dictionaryMsg.YaoCe[k].Description;
				obj.Address=$rootScope.dictionaryMsg.YaoCe[k].Address;
				obj.value=v;
				$rootScope.currentData.YaoCe.push(obj);
				obj=null;
			}else{
				//yxLocalStorage.arrAdd({type:'warning',msg:'yaoce数据有一个在点表信息找不到:'+k+'点表信息：'+JSON.stringify($rootScope.dictionaryMsg.YaoCe),time:new Date()});
			}
				
		})
		/**messageData.data.YaoXin是number类型，需要先toString()2018年11月7日 15:20:48*/
		angular.forEach(messageData.data.YaoXin.toString().split(''),function(v,k){
			if($rootScope.dictionaryMsg.YaoXin[k]){
				let obj={};
				obj.name=$rootScope.dictionaryMsg.YaoXin[k].Description;
				obj.Address=$rootScope.dictionaryMsg.YaoXin[k].Address;
				obj.value=v;
				$rootScope.currentData.YaoXin.push(obj);
				obj=null;
			}else{
				//yxLocalStorage.arrAdd({type:'warning',msg:'yaoxin数据有一个在点表信息找不到:'+k+'点表信息：'+JSON.stringify($rootScope.dictionaryMsg.YaoXin),time:new Date()});
			}
				
		})
		angular.forEach(messageData.data.YaoMai,function(v,k){
			if($rootScope.dictionaryMsg.YaoMai[k]){
				let obj={};
				obj.name=$rootScope.dictionaryMsg.YaoMai[k].Description;
				obj.Address=$rootScope.dictionaryMsg.YaoMai[k].Address;
				obj.value=v;
				$rootScope.currentData.YaoMai.push(obj);
				obj=null;
			}else{
				//yxLocalStorage.arrAdd({type:'warning',msg:'yaomai数据有一个在点表信息找不到:'+k+'点表信息：'+JSON.stringify($rootScope.dictionaryMsg.YaoMai),time:new Date()});
			}	
		})
		//console.log($rootScope.currentData.YaoXin)
		//$rootScope.newCurrentData={YaoXin:[],YaoCe:[],YaoMai:[],yaoxin:[],yaoce:[],yaomai:[],yaoxinObj:{},yaomaiObj:{},yaoceObj:{}}

		angular.forEach($rootScope.currentData.YaoXin,function(item){
			let fenzuTitle=item.name.split('.').length==1?'独立模拟量':item.name.split('.')[0];
			let arr=$rootScope.newCurrentData.YaoXin.filter(function(value){
				return value.title==fenzuTitle;
			})
			if(arr.length==0){
				$rootScope.newCurrentData.YaoXin.push({title:fenzuTitle,data:[item]})
			}else{
				arr[0].data.push(item)
			}
			$rootScope.newCurrentData.yaoxinObj[item.Address]=item;
			$rootScope.newCurrentData.yaoxin.push({name:item.name.split('.').pop(),title:fenzuTitle,value:item.value,Address:item.Address})
			arr=null;
			fenzuTitle=undefined;
		})
		angular.forEach($rootScope.currentData.YaoCe,function(item){
			let fenzuTitle=item.name.split('.').length==1?'独立模拟量':item.name.split('.')[0];
			//let name=item.name.split('.').length==1?item.name.split('.')[0]
			let arr=$rootScope.newCurrentData.YaoCe.filter(function(value){
				return value.title==fenzuTitle;
			})
			if(arr.length==0){
				$rootScope.newCurrentData.YaoCe.push({title:fenzuTitle,data:[item]})
			}else{
				arr[0].data.push(item)
			}
			$rootScope.newCurrentData.yaoce.push({name:item.name.split('.').pop(),title:fenzuTitle,value:item.value,Address:item.Address})
			$rootScope.newCurrentData.yaoceObj[item.Address]=item;
			arr=null;
			fenzuTitle=undefined;
		})
		//if(typeof $rootScope.fenzuListSort=='function')$rootScope.fenzuListSort($rootScope.sortKey,1)
		
		angular.forEach($rootScope.currentData.YaoMai,function(item){
			let fenzuTitle=item.name.split('.').length==1?'独立模拟量':item.name.split('.')[0];
			let arr=$rootScope.newCurrentData.YaoMai.filter(function(value){
				return value.title==fenzuTitle;
			})
			if(arr.length==0){
				$rootScope.newCurrentData.YaoMai.push({title:fenzuTitle,data:[item]})
			}else{
				arr[0].data.push(item)
			}
			$rootScope.newCurrentData.yaomaiObj[item.Address]=item;
			$rootScope.newCurrentData.yaomai.push({name:item.name.split('.').pop(),title:fenzuTitle,value:item.value,Address:item.Address})
			arr=null;
			fenzuTitle=undefined;
		})
		
		if(!$rootScope.newCurrentData.yaoceObj['1']){
			$rootScope.newCurrentData.yaoceObj['1']={value:'1'}
		}
		if(!$rootScope.newCurrentData.yaoceObj['3']){
			$rootScope.newCurrentData.yaoceObj['3']={value:'25'}
		}
		if(!$rootScope.newCurrentData.yaoceObj['5']){
			$rootScope.newCurrentData.yaoceObj['5']={value:'50'}
		}
		if(!$rootScope.newCurrentData.yaoceObj['7']){
			$rootScope.newCurrentData.yaoceObj['7']={value:'75'}
		}
		if(!$rootScope.newCurrentData.yaoceObj['9']){
			$rootScope.newCurrentData.yaoceObj['9']={value:'100'}
		}
		if(!$rootScope.newCurrentData.yaoceObj['11']){
			$rootScope.newCurrentData.yaoceObj['11']={value:'0'}
		}
		if(typeof $rootScope.yaoxin=='function'){
			$rootScope.yaoxin()
		}
		if(typeof $rootScope.fenzu=='function'){
			$rootScope.fenzu();
		}
		
		//yaoxinObj数据处理完毕
		//console.log($rootScope.newCurrentData);
		if($rootScope.testdata_yaoxinObj){
			$.extend($rootScope.newCurrentData.yaoxinObj,$rootScope.testdata_yaoxinObj);
			//console.log('带测试数据yaoxinObj：',$rootScope.newCurrentData.yaoxinObj);
			$scope.randomTestDataYaoxinObj();
		}else{
			//console.log('不带测试数据yaoxinObj：',$rootScope.newCurrentData.yaoxinObj);
		}
		if($rootScope.testdata_yaoceObj){
			$.extend($rootScope.newCurrentData.yaoceObj,$rootScope.testdata_yaoceObj);
			//console.log('带测试数据yaoceObj：',$rootScope.newCurrentData.yaoceObj);
			
			$scope.randomTestDataYaoceObj();
			
		}else{
			//console.log('不带测试数据yaoceObj：',$rootScope.newCurrentData.yaoceObj);
		}
		
		
		//数据中筛选采集卡状态
		
		if(typeof $rootScope.svgInitFun=='function'){
			$rootScope.svgInitFun()
		}
		$rootScope.collectorsMsg=[];
		
		angular.forEach($rootScope.newCurrentData.yaoxin,function(v,k){
			if(v.name.substring(0,4)=='采集单元'){
				for(var i=0;i<$rootScope.collectorsMsg.length;i++){
					if(parseInt($rootScope.collectorsMsg[i].name.substring(4,$rootScope.collectorsMsg[i].name.length))
						==parseInt(v.name.substring(4,v.name.length))){
						if(v.name.substring(v.name.length-4,v.name.length)=='通讯正常'){
							$rootScope.collectorsMsg[i].v1=v.value;
						}
						if(v.name.substring(v.name.length-4,v.name.length)=='对时正常'){
							$rootScope.collectorsMsg[i].v2=v.value;
						}
						break;
					}
				}
				if(i==$rootScope.collectorsMsg.length){
					let unit={};
					unit.name=v.name.substr(0,v.name.length-4);
					if(v.name.substring(v.name.length-4,v.name.length)=='通讯正常'){
						unit.v1=v.value;
					}
					if(v.name.substring(v.name.length-4,v.name.length)=='对时正常'){
						unit.v2=v.value;
					}
					$rootScope.collectorsMsg.push(unit);
					unit=null;
				}
			}
		})
		if(!$scope.cc){
			$scope.collectorCheck($rootScope.collectorsMsg[0].name)
		}
	}
	$scope.wsi=0;
	$scope.wsConnect=function(){
		$scope.heartCheck.start();
		if($scope.ws){
			$scope.ws.close();
		}
		let localWS='ws://'+location.hostname+':8090';
		if(localWS!='ws://127.0.0.1:8090'&&yxIp.wsAddressArr.filter(function(wsIp){
			return  wsIp==localWS
		}).length==0){
			yxIp.wsAddressArr.push(localWS)
		}
		$scope.ws=yxWebsocket.websocketWorker(yxIp.wsAddressArr[$scope.wsi]);
		$scope.wsi+=1;
		if($scope.wsi>yxIp.wsAddressArr.length-1){
			$scope.wsi=0;
		}
		$scope.ws.onOpen(function(){});
		
		$scope.ws.onMessage(function(message){
			console.log('ws received message!')
			$scope.heartCheck.reset();
			var messageData=JSON.parse(message.data);
			//console.log(messageData);
			//yxLocalStorage.arrAdd({type:'info',msg:'ws onmessage....'+messageData.act,time:new Date()});
			if(messageData.act=='table'){//当前数据
				$rootScope.messageData=messageData;
				if(!$rootScope.isServer){
					$rootScope.wsTablemsg($rootScope.messageData);
				}
				//$rootScope.wsTablemsg($rootScope.messageData);
			}else if(messageData.act=='SOE'){//告警信息列表
				angular.forEach(messageData.data,function(v,k){
					v.message=$rootScope.dictionaryMsg.YaoXin.filter(function(v2){
						return v2.Address==v.Address
					})[0].Description;
					
					v.webState=true;
				})
				$rootScope.currentAlarms=$rootScope.currentAlarms.concat(messageData.data);
				$rootScope.currentAlarms.splice(0,$rootScope.currentAlarms.length-100);
				$rootScope.centerFooter=1;
			}else if(messageData.act=='lb'){//录波文件列表
				$rootScope.recordFiles=$rootScope.recordFiles.concat(messageData.data);
				if(global_level>4){console.log('ws_录波文件列表（处理后）：',$rootScope.recordFiles);}
			}else if(messageData.act=='time'){//更新系统时间
				$rootScope.systemTime=messageData.time;
				if(global_level>4){console.log('系统时间：',$rootScope.systemTime)}
			}else if(messageData.act=='operate'){
				angular.forEach(messageData.data,function(v){
					v.time=new Date(v.OperateTime).format('yyyy-MM-dd hh:mm:ss')
				})
				$scope.operateList=$scope.operateList.concat(messageData.data);
				if(global_level>4){console.log('ws_操作记录（处理后）：',$scope.operateList);}
			}else if(messageData.act=='error'){
				toaster.pop('error','',messageData.msg)
			}else if(messageData.act=='restart'){
				$rootScope.modals.refreshTipModal=true;
			}
			
		});
		$scope.ws.onClose(function(data){
			//yxLocalStorage.arrAdd({type:'error',msg:'ws close....'+JSON.stringify(data),time:new Date()});
		});
		$scope.ws.onError(function(data){
			//yxLocalStorage.arrAdd({type:'error',msg:'ws onError....'+JSON.stringify(data),time:new Date()});
		});
	}
	$scope.wsConnect()
	
	
	//获取点表信息
	$scope.getdictionary=function(){
		yxRequest.send('get',yxIp.requestIp+'get_table',
			{},
			function(result){
				if(global_level>4){
					console.log('获取点表信息成功:',result.data);
				}
				$rootScope.dictionaryMsg=result.data;
				$rootScope.dataCollectUnitNum=result.data.YaoXin.filter(function(v){
					return v.Description.substring(0,4)=='采集单元'
				}).length/2
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:'获取点表失败'+JSON.stringify(data),time:new Date()});
				if(global_level>1){
					console.log('获取点表信息失败',data);
				}
				toaster.pop('error','',data.msg)
			}
		);
	}
	$scope.getdictionary();
	//列表排序公共方法
	$rootScope.sortNum=1;
	$rootScope.listSort=function(key,arr,autoSort){
		if(!key)return;
		if(!arr)return;
		$rootScope.sortKey=key;
		if(!autoSort)$rootScope.sortNum*=-1;
		arr.sort($scope.cmp);
	}	
	$scope.cmp=function(obj1,obj2){
		if(obj2[$scope.sortKey]>obj1[$scope.sortKey]){
			return 1*$rootScope.sortNum
		}else if(obj2[$scope.sortKey]<obj1[$scope.sortKey]){
			return -1*$rootScope.sortNum
		}else{
			return 0
		}
	}
	//公共方法--转时间戳
	$rootScope.getTimestamp=function(date){
		return new Date(date.replace(/-/g,'/')).getTime();
	}
	//公共方法--全选
	$rootScope.truecheck = [];
	$rootScope.falsecheck = [];
	$rootScope.check = {};
	$rootScope.check.checkedAll = false;
	$rootScope.checkAll = function(item){
		$rootScope.truecheck = [];
		$rootScope.falsecheck = [];
		angular.forEach(item,function(key,value){
			if($rootScope.check.checkedAll){
				key.checked = true;
				$rootScope.truecheck.push(key);
			}else{
				key.checked = false;
				$rootScope.falsecheck.push(key);
			}
		});
	}
	//公共方法--单选
	$rootScope.checkSingle = function(item){
		$rootScope.truecheck = [];
		$rootScope.falsecheck = [];
		angular.forEach(item,function(value,key){
			if(typeof value.checked != 'undefined'){
				if(value.checked){
					$rootScope.truecheck.push(value);
				}else{
					$rootScope.falsecheck.push(value);
				}
			}
			
		});
		if($rootScope.truecheck.length == item.length){
			$rootScope.check.checkedAll = true;
		}else{
			$rootScope.check.checkedAll = false;
		}
	}
	
	//导出方法
	$rootScope.listExport=function(obj){
		yxRequest.send('post',yxIp.requestIp+'excel',
			obj,
			function(result){
				let filename=prompt("请输入文件名","download");
				if(filename){
					filename='/'+filename+'.xlsx'
				}else{
					filename='/download.xlsx'
				};
				var eleLink = document.createElement('a');
				eleLink.style.display = 'none';
				//eleLink.download = filename||'名字.xlsx';
				eleLink.href = yxIp.exportIp+result.data+filename;
				document.body.appendChild(eleLink);
				eleLink.click();
				document.body.removeChild(eleLink);	
			},function(data){
				
				if(global_level>1){
					console.log('失败',data);
				}
				
				toaster.pop('error','',data.msg)
			}
		);
	}
	//下载文件方法
	$rootScope.openFile=function(arr){
		console.log(arr);
		
		for(let i=0;i<arr.length;i++){
			console.log(arr[i])
			var elemIF = document.createElement("iframe");   
			elemIF.src =yxIp.requestIp1+arr[i];   
			elemIF.style.display = "none";   
			document.body.appendChild(elemIF);
			$rootScope.sleep(1000);
			
		}
		
		return;
		console.log(arr)
		let filename=prompt("请输入文件名","download");
		filename=filename||'download';
		//angular.forEach(arr,function(v){
		//for(let i=arr.length-1;i>-1;i--){
		for(let i=0;i<arr.length;i++){
			let type=arr[i].split('.').pop();
			$.ajax({
				type:"get",
				url:yxIp.exportIp+arr[i],
				async:true,
				dataType:'text',
				success:function(data){
					if(global_level>4){
						console.log('成功',data);
					}
					console.log(data)
					var file = new File([data], filename+"."+type, { type: "text/plain;charset=ANSI" });
	    			saveAs(file);
				},
				error:function(data){
					if(global_level>1){
						console.log('文件下载失败失败:',arguments);
					}
					toaster.pop('error','','文件下载失败')
				}
			});
		}
		//})
	}
	$scope.fileDownLoad=function(url){
		var eleLink = document.createElement('a');
		eleLink.style.display = 'none';
		eleLink.href = yxIp.exportIp+url;
		document.body.appendChild(eleLink);
		eleLink.click();
		document.body.removeChild(eleLink);	
	}
	//获取中1区数据//独立模拟量1;模拟量组2;开关量3;开出量4;
	$scope.getMonitorMsg=function(){
		yxRequest.send('get',yxIp.requestIp+'device',
			{},
			function(result){
				if(global_level>4){
					console.log('获取采集点信息成功',result);
				}
				
				angular.forEach(result.data,function(collector){
					collector.list.allData=[];
					angular.forEach(collector.list.analog,function(analogItem){
						analogItem.name=analogItem.AnalogName;
						analogItem.type=1;
						collector.list.allData=collector.list.allData.concat(analogItem);
					})
					angular.forEach(collector.list.digital,function(digitalItem){
						digitalItem.name=digitalItem.DigitalName;
						digitalItem.type=3;
						digitalItem.Unit='';
						collector.list.allData=collector.list.allData.concat(digitalItem)
					})
					angular.forEach(collector.list.group,function(groupItem){
						let objA={type:2,Unit:groupItem.Unit};
						let objB={type:2,Unit:groupItem.Unit};
						let objC={type:2,Unit:groupItem.Unit};
						objA.name=groupItem.GroupName+'.A相';
						objB.name=groupItem.GroupName+'.B相';
						objC.name=groupItem.GroupName+'.C相';
						
						objA.Channel=groupItem.A;
						objB.Channel=groupItem.B;
						objC.Channel=groupItem.C;
						collector.list.allData.push(objA,objB,objC)
					})
					angular.forEach(collector.list.output,function(outputItem){
						outputItem.type=4;
						outputItem.Unit+'';
						outputItem.name=outputItem.OutputName;
						outputItem.Channel=1;
						collector.list.allData=collector.list.allData.concat(outputItem)
					})
				})
				if(global_level>4){
					console.log('处理后的采集点信息:',result.data);	
				}
				
				$scope.monitorMsg=result.data;
			},function(data){
				if(global_level>1){
					console.log('获取采集点信息失败',data);
				}
				
				toaster.pop('error','',data.msg)
			}
		);
	}
	$scope.getMonitorMsg();
	
	//z中1区采集卡切换
	$scope.collectorCheck=function(id){
		$scope.cc=id;
		$scope.currentCollector=$scope.monitorMsg.filter(function(v){
			return v.DevID==id.substring(4,id.length);
		})[0]
	}
	//菜单栏收放
	$scope.leftAreaShow=true;
	$scope.leftAreaShowFun=function(){
		$scope.leftAreaShow=true;
	}
	$scope.leftAreaHideFun=function(){
		$scope.leftAreaShow=false;
	}
	//添加默认时间
	$rootScope.defaultTime=function(obj,n){
		if(!n)return;
		obj.end_time=new Date().format('yyyy-MM-dd hh:mm:ss');
		obj.start_time=(new Date(new Date().getTime()-24*3600*1000*n)).format('yyyy-MM-dd hh:mm:ss')
		return obj
	}
	
	/*****************/
	$scope.isShow=true;
	$rootScope.userName=$.cookie('username');
	//获取文件夹列表
	$scope.getFolderList=function(){
		yxRequest.send('post',yxIp.requestIp+'folder/folder',
			{},
			function(result){
				$rootScope.folderList=result.data;
				$rootScope.folderList.unshift({url:'client',isDirectory:'true'});
			},function(data){
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//登录确认方法
	$scope.login={};
	$scope.enterLogin=function(e){
		if(global_level>4){console.log(e)}
		var keycode = window.event?e.keyCode:e.which;
    	if(keycode==13){
            $rootScope.loginConfirm($scope.login.username,$scope.login.password)
        }
	}
	$rootScope.loginConfirm=function(uname,pwd){
		yxLogin.login(uname,pwd,function(data){
			toaster.pop('success','','登录成功');
			$scope.login.password='';
			$rootScope.hasUserInfo=true;
			$rootScope.userName=$scope.login.username;
			if(global_level>4){
				console.log('登录成功',data);	
				console.log($rootScope.userName)	
				}
			
			$scope.loginModalCloseFun();
			if($rootScope.isServer){
				$timeout(function(){
					$scope.dataManageOnce();
				},5000)
			}
			if($state.current.name=='main.diagram.DQMX'){
				$scope.getFolderList();
				$rootScope.svgPageGo('client/'+$.cookie('username')+'/index.svg');
			}
		},function(data){
			if(global_level>1){
				console.log('登录失败111',data);	
				}
			
			toaster.pop('error','',data.msg);
		})
	}
	//处理一次数据
	$scope.dataManageOnce=function(){
		console.log('dataManageOnce')
		if($rootScope.messageData){
			$rootScope.wsTablemsg($rootScope.messageData);
		}else{
			$timeout(function(){
				$scope.dataManageOnce();
			},5000)
		}
	}
	//关闭登录模态框方法
	$scope.loginModalCloseFun=function(){
		if(global_level>4){
			console.log('closeFun',$scope.username)		
				}
		
		$rootScope.modals.systemLoginModal=false;
		
	}
	//退出登录确认方法
	$scope.logoutConfirm=function(){
		yxLogin.logout(function(){
			$rootScope.hasUserInfo=false;
			$rootScope.userName='';
			$rootScope.modals.systemLogoutModal=false;
		},function(data){
			toaster.pup('error','',data.msg)
		});
	}
	//关闭登录模态框
	$scope.modalCloseFun=function(str){
		$scope.modals[str]=false;
	}
	//录波确认
	$scope.recordStartConfirm=function(){
		yxRequest.send('get',yxIp.requestIp+'record',
			{},
			function(result){
				if(global_level>4){
					console.log('录波启动成功',result);
				}
				
				toaster.pop('success','','录波启动成功');
				$rootScope.modals.luboStartModal=false;
			},function(data){
				if(global_level>1){
					console.log('录波启动失败',data);
				}
				
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//更新系统刷新时间
	$scope.refreshTimeEdit=function(time){
		if(time<5){
			toaster.pop('warning','','刷新时间不能低于5秒');
			return;
		}
		yxRequest.send('post',yxIp.requestIp+'updata_refresh',
			{data:time*1000},
			function(result){
				if(global_level>4){
					console.log('更新系统刷新时间成功',result);
				}
				toaster.pop('success','','更新系统刷新时间成功');
				$scope.getRefreshTime();
				$rootScope.modals.refreshTimeModal=false;
			},function(data){
				if(global_level>1){
					console.log('更新系统刷新时间失败',data);
				}
				toaster.pop('error','',data.msg)
			}
		);
	}
	$scope.getRefreshTime=function(){
		yxRequest.send('get',yxIp.requestIp+'refresh',
			{},
			function(result){
				if(global_level>4){
					console.log('获取当前刷新时间成功',result);
				}
				$scope.refreshTime=result.data/1000
			},function(data){
				if(global_level>1){
					console.log('获取当前刷新时间失败',data);
				}
				toaster.pop('error','',data.msg)
			}
		)
	}
	$scope.getRefreshTime();
	
	//随机产生颜色
	$rootScope.colorRandom=function(min,max){
		let a=parseInt(Math.random()*(max-min)+min);
		let b=parseInt(Math.random()*(max-min)+min);
		let c=parseInt(Math.random()*(max-min)+min);
		return `rgb(${a},${b},${c})`;
	}
	//定值修改信息提交
	$rootScope.dzUpdateSubmit=function(){
		if($rootScope.dzUpdateMsg.upoint.length==0&&
			$rootScope.dzUpdateMsg.cpoint.length==0&&
			$rootScope.dzUpdateMsg.icpoint.length==0&&
			$rootScope.dzUpdateMsg.iupoint.length==0&&
			$rootScope.dzUpdateMsg.kpoint.length==0){
			toaster.pop('warning','','您未修改任何定值')	;return;
		}
		$rootScope.modals.dzSubmitingModal=true;
		yxRequest.send('post',yxIp.requestIp+'dz/updata_info',
			$rootScope.dzUpdateMsg,
			function(result){
				$rootScope.dzUpdateMsg={upoint:[],cpoint:[],icpoint:[],iupoint:[],kpoint:[]};
				$rootScope.dzMsgObj={upoint:[],cpoint:[],icpoint:[],iupoint:[],kpoint:[]};
				$rootScope.modals.dzSubmitingModal=false;
				if($state.current.name=='main.dzManage.dz_volList'){
					$rootScope.getVolListMsgFun();
				}else if($state.current.name=='main.dzManage.dz_curList'){
					$rootScope.getCurListMsgFun();
				}else if($state.current.name=='main.dzManage.dz_independentList'){
					$rootScope.getIndependentListMsgFun();
				}else if($state.current.name=='main.dzManage.dz_switchList'){
					$rootScope.getSwitchListMsgFun();	
				}
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:'定值修改失败：'+JSON.stringify(data),time:new Date()})
				if(global_level>1){console.log('定值修改失败',data);}
				$rootScope.modals.dzSubmitingModal=false;
				toaster.pop('error','',data.msg)
			},'access',
			function(data){
				$rootScope.modals.dzSubmitingModal=false;
			}
		);
	}
}]);
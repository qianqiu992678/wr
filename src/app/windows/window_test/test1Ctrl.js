'use strict';

angular.module('app')
.controller('test1Ctrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','Upload','yxLocalStorage','yxWebsocket',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,Upload,yxLocalStorage,yxWebsocket) {
	//console.log('test1Ctrl');
		$timeout(function(){
		toaster.pop('error','','失败')
	},1000)
	$scope.testNum='1.2';
	$scope.downloadFile1=function(url) { 
		console.log(url)
        try{ 
            var elemIF = document.createElement("iframe");   
            elemIF.src = url; 
            //elemIF.style.display = "none"; 
            
            document.body.appendChild(elemIF);
            
        }catch(e){ 
 			console.log(e)
        }
        elemIF.onload=function(){
	        	alert(3)
	        }
        
    }
	//$scope.downloadFile1('test.doc');
	$scope.downloadFile2=function(url) { 
		//window.location=url;
		window.open(url);
    }
	//$scope.downloadFile2('test.doc')
	
	
	
	$scope.downloadFile3=function (url) {
        var $form = $('<form method="GET"></form>');
        $form.attr('action', url);
        $form.appendTo($('body'));
       $form.submit();
    }
	//$scope.downloadFile3('test.doc')
	$scope.downloadFile4=function (url,filename) {
	    // 创建隐藏的可下载链接
	    var eleLink = document.createElement('a');
	    eleLink.download = filename;
	    eleLink.style.display = 'none';
	    // 字符内容转变成blob地址
	    //var blob = new Blob([content]);
	    eleLink.href = url;//URL.createObjectURL(blob);
	    // 触发点击
	    document.body.appendChild(eleLink);
	    eleLink.click();
	    // 然后移除
	    document.body.removeChild(eleLink);
   	}
	$scope.downloadStart=function(){
		
//		$scope.filename=$scope.filename||'名字'
//		$scope.downloadFile4('test.doc',$scope.filename+'.doc');
		let arr=['CAAP2008X.rar','SVG.rar']
		for(let i=0;i<arr.length;i++){
			// 创建隐藏的可下载链接
		    var elea = document.createElement('a');
		   elea.style.display = 'none';
		    elea.href = arr[i];
		    console.log(yxIp.requestIp1+arr[i])
		    // 触发点击
		    document.body.appendChild(elea);
		    elea.click();
		    // 然后移除
		    document.body.removeChild(elea);
		}



	}
	//download
	$scope.downloadFile5=function(){
		let filename;//=prompt("请输入文件名","download");
		if(filename)filename+='.xlsx';
		var eleLink = document.createElement('a');
		eleLink.style.display = 'none';
		eleLink.download = filename||'名字.xlsx';
		eleLink.href = '92f6e4c041ff11e8bc22a52e87d47e0e.xlsx';
		console.log(eleLink)
		document.body.appendChild(eleLink);
		eleLink.click();
		document.body.removeChild(eleLink);	
	}
	//$scope.downloadFile5();/download/Report/2018-04/2018-04-19_15.06.16.HDR
	$scope.ajaxDown=function(){
		$.ajax({
				type:"get",
				url:yxIp.requestIp+'download/Report/2018-04/2018-04-19_15.06.16.DAT',
				async:true,
				headers: {
	                'Content-Type': 'application/octet-stream',
	                'accept':'bytes'
	            },
				success:function(data){
					console.log(data);
				},
				error:function(data){
					//console.log(data.responseText)
					//$scope.downloadFile('filename.CFG',data.responseText)
					$scope.downloadTextFile(data.responseText)
				}
			});
	}
	
	$scope.downloadFile=function(fileName, content){
		console.log(fileName)
	    var aLink = document.createElement('a');
	    var blob = new Blob([content]);
	    var evt = document.createEvent("HTMLEvents");
	    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
	    aLink.download = fileName;
	    console.log(URL.createObjectURL(blob));
	    aLink.href = URL.createObjectURL(blob);
	    //aLink.dispatchEvent(evt);
	    console.log(aLink)
	    //aLink.click()
	    fileEntry.createWriter(function (fileWriter) {  
		    fileWriter.write(blob); // 返回Blob对象并通过fileWriter写入  
		    fileWriter.onwriteend = function () {console.log(4234)}; // 绑定写入操作完成后的事件  
		}); 
	}
	
	$scope.downloadTextFile = function(text) {
	    var file = new File([text], "download.txt", { type: "text/plain;charset=utf-8" });
	    saveAs(file);
	}
	
	//页面解析到当前为止所有的script标签
	var js = document.scripts;
	//js[js.length - 1] 就是当前的js文件的路径
	//js = js[js.length - 1].src.substring(0, js[js.length - 1].src.lastIndexOf("/") + 1);
	//输出当前js文件所在的目录
	//console.info(js);
	$scope.testDownload=function(){
		let url='lib/yx-frame/res/test.doc';
		let filename='download';
		let type=url.split('.').pop();
		//console.log(type)
		$.ajax({
			type:"get",
			url:'http://127.0.0.1:8020/htdocs/waveformRecord/'+url,
			async:true,
			dataType:'text',
			success:function(data){
				var file = new File([data], filename+"."+type, { type: "text/plain;charset=utf-8" });
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
	
	
	
	
	
	
	
	
	
	
	
	
//	//上传文件
    $scope.uploadFile = null;
	$scope.fileData = null;
	//base64
	$scope.fileBase64Fun = function() {
		var reader = new FileReader();
		
		
		reader.readAsDataURL($scope.fileData);
		reader.onload = function() {
			$scope.uploadFile = reader.result;
			var timer = $timeout(function() {
				$scope.upload($scope.uploadFile,$scope.fileData.name);
				$timeout.cancel(timer);
			}, 300, true);
		}
	}
	$scope.upload = function(file,filename) {
		var toastInstance = toaster.pop('wait', '', '正在上传，请稍后...', 99999);
		
		if(!$scope.fileData.name) {return;}
		Upload.upload(
	        { 
	            url: yxIp.requestIp, 
	            fields: {'filename': $scope.fileData.name}, file: file 
        })
        .progress(function (evt) { 
        	console.log(evt)
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total); 
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name); 
        })
        .success(function (data, status, headers, config) {console.log('')
        	console.log('success')	
            //console.log('file ' + config.file.name + 'uploaded. Response: ' + data); 
        })
        .error(function (data, status, headers, config) { 
        	console.log('error')
            //console.log('error status: ' + data,status,headers,config); 
        })
	}
	//上传文件
    $scope.$watch('fileData', function() {
        if(!$scope.fileData) {
			return
		};
        if(!$scope.fileData.name.match(/.*.svg/)) {
        	console.log('格式不对')
			$scope.uploadFileErr = "请上传正确的excel文件.";
			$scope.fileData = {};
			$scope.fileData.name = null;
			$scope.uploadFile = null;
		} else {
			$scope.uploadFileErr = "";
			//base64编码
			$scope.fileBase64Fun();
		}
    });
    $scope.inputChange=function(){
    	$scope.selectValue=$scope.value
    }
    $scope.selChange=function(){
    	console.log('selChange')
    }
    /******************ws************************/
   
	
	
	$scope.onOpenFun=function(data){
		console.log('onOpen:',data);	
	}
	$scope.onMessageFun=function(message){
		console.log('onmessage',message)
	}
	$scope.onErrorFun=function(data){
		console.log('error',data)
	}
	$scope.onCloseFun=function(data){
		console.log('close',data)
		$timeout(function(){
			yxWebsocket.websocketWorder(yxIp.wsAddress,$scope.onOpenFun,$scope.onMessageFun,$scope.onErrorFun,$scope.onCloseFun);
		},5000)
	}
	//yxWebsocket.websocketWorder(yxIp.wsAddress,$scope.onOpenFun,$scope.onMessageFun,$scope.onErrorFun,$scope.onCloseFun);
	
	
	$timeout(function(){
		$('.resetTest').html('123456789')
	},5000)
	$scope.getTestData=function(){
		$.ajax({
			type:"get",
			url:"src/testData/newcurrentdata.json",
			async:true,
			success:function(data){
				$scope.testData=data;
				//console.log($scope.testData)
			}
		});
	}
	$scope.getTestData()
	$scope.getData=function(pageNum){
		$scope.currentDisplay=$scope.testData.yaoxin.slice((pageNum-1)*10,pageNum*10+10)	
		//console.log($scope.currentDisplay)
	}
	$scope.pageNum=1;
	$timeout(function(){
		$scope.getData($scope.pageNum)
	},2000)
	$scope.wheelTest=function(e){
		let scrollBotom=$(e.target).parents('table').height()-$(e.target).parents('.testContainer').scrollTop()-$(e.target).parents('.testContainer').height()+2;
		console.log(scrollBottom);
	}
	$scope.arr={};
	for(var i=0;i<400;i++){
		if(i<101){
			let v=parseFloat((Math.random()*10).toFixed(3))+30;
			$scope.arr[i+1]={name:'测试数据',Address:i+1,value:v};
		}else if(i<201){
			let v=Math.random()*15+10;
			$scope.arr[i+1]={name:'测试数据',Address:i+1,value:v};
		}else if(i<301){
			let v=Math.random()*5+35;
			$scope.arr[i+1]={name:'测试数据',Address:i+1,value:v};
		}else if(i<401){
			let v=Math.random()*10+15;
			$scope.arr[i+1]={name:'测试数据',Address:i+1,value:v};
		}
		
	}
	//console.log($scope.arr)
	$scope.yaoceObjTest={};
	for(let i=-1;i>-5551;i--){
		if(i>-51){
			let v=parseFloat((Math.random()/5-0.1+1).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-101){
			let v=parseFloat((Math.random()*2-1+10).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-151){
			let v=parseFloat((Math.random()*4-2+20).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-201){
			let v=parseFloat((Math.random()*6-3+30).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-251){
			let v=parseFloat((Math.random()*8-4+40).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-301){
			let v=parseFloat((Math.random()*10-5+50).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-351){
			let v=parseFloat((Math.random()*12-6+60).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-401){
			let v=parseFloat((Math.random()*14-7+70).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-451){
			let v=parseFloat((Math.random()*16-8+80).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-501){
			let v=parseFloat((Math.random()*18-9+90).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-551){
			let v=parseFloat((Math.random()*20-10+100).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-601){
			//电压
			let v=parseFloat((Math.random()*30+220).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-651){
			let v=parseFloat((Math.random()*20+380).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-701){
			let v=parseFloat((Math.random()*0.5+10).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-751){
			//温度
			let v=parseFloat((Math.random()*10+10).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-801){
			let v=parseFloat((Math.random()*10+20).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-851){
			let v=parseFloat((Math.random()*10+30).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-901){
			let v=parseFloat((Math.random()*10+40).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-951){
			let v=parseFloat((Math.random()*10+50).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1001){
			//电能
			let v=parseFloat((Math.random()*1000+1000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1051){
			let v=parseFloat((Math.random()*1000+2000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1101){
			let v=parseFloat((Math.random()*1000+3000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1151){
			let v=parseFloat((Math.random()*1000+4000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1201){
			let v=parseFloat((Math.random()*1000+5000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1251){
			//功率因数
			let v=parseFloat((Math.random()*0.15+0.7).toFixed(4));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1301){
			//功率
			let v=parseFloat((Math.random()*4+1).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1351){
			let v=parseFloat((Math.random()*40+10).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1401){
			let v=parseFloat((Math.random()*50+50).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1451){
			let v=parseFloat((Math.random()*400+100).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1501){
			let v=parseFloat((Math.random()*500+500).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1551){
			let v=parseFloat((Math.random()*4000+1000).toFixed(3));
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1601){
			//let v=parseFloat((Math.random()*4000+1000).toFixed(3));
			let r=Math.random();
			let v;
			if(r>0.75){
				v=4;
			}else if(r>0.5){
				v=3
			}else if(r>0.25){
				v=2
			}else{
				v=1
			}
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}else if(i>-1651){
			let v=parseFloat((Math.random()*5+20).toFixed());
			$scope.yaoceObjTest[i]={name:'测试数据',Address:i,value:v}
		}
	}
	console.log(JSON.stringify($scope.yaoceObjTest))
	$scope.yaoxinObjTest={};
	for(let i=-1;i>-101;i--){
		let v=Math.random()>0.5?1:0;
		$scope.yaoxinObjTest[i]={name:'测试数据',Address:i,value:v};
	}
	//console.log(JSON.stringify($scope.yaoxinObjTest));
	
	
	
//$('#editArea').html('abc')

//var elem=document.querySelector('#testdata');

//var $scope = angular.element(elem).scope();

$scope.testdata=[
	{name:'guanqian'},
	{name:'weige'}
];
$scope.testdataadd=function(){
	$scope.testdata[1].name+='a';
	//console.log($scope.$watch)
}
$scope.$watch('testdata',function(){
	console.log('changed')
	console.log($scope.testdata)
},true)


//var elem=document.querySelector('.btn_send');
//var $scope=angular.element(elem).scope();
//var inputarea=document.querySelector('#editArea');
//var $scope2=angular.element(inputarea).scope();
//$scope.leng=0;
//$scope.$watch('chatContent',function(){
//	if($scope.chatContent.length>$scope.leng){
//		if($scope.chatContent[$scope.chatContent.length-1].RecommendInfo){
//			$scope.editAreaKeydown({keyCode:33});
//			$scope.editAreaKeyup()
//			$scope.editAreaCtn='hello'
//			$scope2.sendTextMessage();
//		}
//	}
//	$scope.leng=$scope.chatContent.length;
//},true);

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}]);





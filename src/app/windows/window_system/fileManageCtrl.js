'use strict';
angular.module('app')
.controller('fileManageCtrl', ['$filter','$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval','yxRequest','yxLogin','$compile','yxWebsocket','Upload','yxLocalStorage',
function($filter,$rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval,yxRequest,yxLogin,$compile,yxWebsocket,Upload,yxLocalStorage) {
	$scope.folderData=[{url:'我的文件夹',isDirectory:true}];	
	$scope.compileError=[];
	$scope.getMainFolder=function(fun){
		yxRequest.send('post',yxIp.requestIp+'folder/folder',
			{},
			function(result){
				if(typeof fun=='function'){
					fun(result.data)
				}
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				console.log(data)
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	$scope.getFolder=function(){
		if($scope.folderData[0].showSubFolder){
			$scope.folderData[0].showSubFolder=false;
			return;
		}else if($scope.folderData[0].subFolder){
			$scope.folderData[0].showSubFolder=true;
			return;
		}
		$scope.getMainFolder(function(data){
			$scope.folderData[0].subFolder=data
			$scope.folderData[0].showSubFolder=true;
		});
		
	}
	$scope.toFolder=function(){
		if($scope.folderData[0].subFolder){
			$scope.currentFolder=$scope.folderData[0];
			return;
		}
		//$scope.folderData[0].subFolder=
		$scope.getMainFolder(function(data){
			$scope.folderData[0].subFolder=data;
			$scope.currentFolder=$scope.folderData[0];
			$scope.folderData[0].showSubFolder=true;
		});
	}
	$scope.toFolder();
	$scope.getSubFolder=function(item,fun){
		yxRequest.send('post',yxIp.requestIp+'folder/files',
			{path:item.url.split('/').pop()},
			function(result){
				
				if(typeof fun=='function'){
					let arr=[];
					angular.forEach(result.data,function(v){
						arr.push({url:v,isDirectory:false})
					})
					fun(arr)
				}
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	$scope.showSubFolderFun=function(item){
		if(item.showSubFolder){
			item.showSubFolder=false;
			return;
		}else if(item.subFolder){
			item.showSubFolder=true;
			return;
		}
		$scope.getSubFolder(item,function(data){
			item.subFolder=data;
			item.showSubFolder=true;
		});
	}	
	//跳转到指定文件夹	
	$scope.currentFolder=null;
	$scope.toSubFolder=function(item){
		if(item.subFolder){
			$scope.currentFolder=item;
			return;
		}
		$scope.getSubFolder(item,function(data){
			item.subFolder=data
		});
		$scope.currentFolder=item;
	}
	
	//窗口右键
	$scope.showContextmenuFun=function(e){
		if($(e.target).attr('class').indexOf('uploadDropArea')>=0){
			$scope.showContextmenu=true;
			$scope.showFileOptMenu=false;
			$('.window-contextmenu').css({top:e.clientY+'px',left:e.clientX+'px'})
		}else{
			$scope.showContextmenu=false;
			$scope.showFileOptMenu=true;
			$('.window-fileOptMenu').css({top:e.clientY+'px',left:e.clientX+'px'});
			$scope.targetFile=$scope.currentFolder.subFolder[$(e.target).attr('data-toggle')];
			$scope.targetFile.checked=true;
		}
	}
	//文件删除
	$scope.fileDeleteFun=function(){
		$scope.showFileOptMenu=false;
		let optArr=[];
		
		$scope.optFileArr=$scope.currentFolder.subFolder.filter(function(v){
			return v.checked
		});
		angular.forEach($scope.optFileArr,function(v,k){
			if(!v.isDirectory){
				optArr.push(v.url.split('/').pop())
			}else{
				toaster.pop('warning','','文件夹不可以删除');
			}
		})
		if(optArr.length==0){
			return;
		}
		if($scope.currentFolder.url.indexOf('/')<0){
			var path='';
		}else{
			var path=$scope.currentFolder.url.split('/').pop();
		}
		yxRequest.send('post',yxIp.requestIp+'folder/rmfiles',
			{path:path,files:optArr},
			function(result){
				toaster.pop('success','','删除成功');
				$scope.showFileOptMenu=false;
				if($scope.currentFolder.url.indexOf('/')<0){
					$scope.getMainFolder(function(data){
						$scope.currentFolder.subFolder=data;
					});
				}else{
					$scope.getSubFolder($scope.currentFolder,function(data){
						$scope.currentFolder.subFolder=data;
					});
				}
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//文件重命名
	$scope.fileRenameFun=function(){
		$scope.showFileOptMenu=false;
		$scope.fileRenameConfirmModal=true;
		$scope.newFileName=$scope.targetFile.url.split('/').pop().split('.').shift();
		$scope.fileType=$scope.targetFile.url.split('/').pop().split('.').pop();
	}
	//文件重命名确认
	$scope.fileRenameConfirm=function(){
		if($scope.currentFolder.url.indexOf('/')<0){
			var path='';
		}else{
			var path=$scope.currentFolder.url.split('/').pop();
		}
		yxRequest.send('post',yxIp.requestIp+'folder/refile',
			{old_title:$scope.targetFile.url.split('/').pop(),new_title:$scope.newFileName+'.'+$scope.fileType,path:path},
			function(result){
				toaster.pop('success','','重命名成功');
				$scope.fileRenameConfirmModal=false;
				if($scope.currentFolder.url.indexOf('/')<0){
					$scope.getMainFolder(function(data){
						$scope.currentFolder.subFolder=data;
					});
				}else{
					$scope.getSubFolder($scope.currentFolder,function(data){
						$scope.currentFolder.subFolder=data;
					});
				}
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//文件下载
	$scope.fileDownLoad=function(){
		$scope.showFileOptMenu=false;
		if(!$scope.targetFile.isDirectory){
			var eleLink = document.createElement('a');
			eleLink.style.display = 'none';
			eleLink.download = $scope.targetFile.url.split('/').pop();
			
			eleLink.href = yxIp.requestIp+$scope.targetFile.url;
			document.body.appendChild(eleLink);
			eleLink.click();
			document.body.removeChild(eleLink);
		}else{
			toaster.pop('warning','','文件夹无法下载');
		}
		return;
		$scope.optFileArr=$scope.currentFolder.subFolder.filter(function(v){
			return v.checked
		});
		angular.forEach($scope.optFileArr,function(v,k){
			if(!v.isDirectory){
				console.log(v)
				console.log('/'+v.url);
				var eleLink = document.createElement('a');
				eleLink.style.display = 'none';
				eleLink.download = v.url.split('/').pop();
				eleLink.href = '/'+v.url;
				document.body.appendChild(eleLink);
				eleLink.click();
				document.body.removeChild(eleLink);	
			}else{
				toaster.pop('warning','','文件夹无法下载');
			}
		})
	}
	//文件编译
	$scope.svgfilecompile=function(){
		let filename=$scope.targetFile.url.split('/').pop();
		//获取svg文件
		$.ajax({
			type:"get",
			url:yxIp.requestIp+$scope.targetFile.url,
			dataType:'text',
			async:true,
			success:function(data){
				if(global_level>4){console.log("成功：",arguments);}
				var str=$compile(data)($scope);
				$('.svgCompileBox').html(str);
				$scope.compile(filename);
			},
			error:function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				if(global_level>1){console.log("失败：",arguments);}
			}
		});
	}
	$scope.compileErrorModalClose=function(){
		$scope.compileErrorModal=false;
		$scope.compileError=[];
	}
	$scope.compile=function(filename){
		$scope.allElements=$('.svgCompileBox *');
		angular.forEach($scope.allElements,function(el,key){
			if(el.attributes.onclick){
				let str=el.attributes.onclick.nodeValue;
				try{
					var obj=JSON.parse(str.substring(7,str.length-2));
				}catch(e){
					//TODO handle the exception
					yxLocalStorage.arrAdd({type:'error',msg:JSON.stringify(e)+'--'+str,time:new Date()})
					//console.log(str);
					$scope.compileError.push({id:$(el).attr('id'),errorMsg:'json格式错误'});
					return;
				}
				if(obj.compil_info){
					$(el).removeAttr("onclick");
					if(obj.widget_type=='image'){
						for(let k in obj){
							$(el).attr(obj);
						}
						$(el).attr({"xlink:href":'/'+obj['xlink:href']});
					}else if(obj.widget_type=='aiText'){
						let addr=obj.address;
						let originStr=$(el).html();
						let leng=obj.leng?obj.leng:2;
						$(el).html(`{{newCurrentData.${obj.signalType}[${addr}]?('${originStr}'+newCurrentData.${obj.signalType}[${addr}].value|number:${leng}):'地址不存在'}}`); 
					}else if(obj.widget_type=='textAi'){
						let addr=obj.address;
						let originStr=$(el).html();
						let leng=obj.leng?obj.leng:2;
						$(el).html(`{{newCurrentData.${obj.signalType}[${addr}]?((newCurrentData.${obj.signalType}[${addr}].value|number:${leng})+'${originStr}'):'地址不存在'}}`); 
					}else if(obj.widget_type=='valueText'){
						let addr=obj.address,unit=obj.unit?obj.unit:'',afterUnit=obj.afterUnit?obj.afterUnit:1,
							leng=obj.leng?obj.leng:2;
						//let originStr=$(el).html();
						if(unit){
							if(afterUnit==1){
								$(el).html(`{{newCurrentData.${obj.signalType}[${addr}]?((newCurrentData.${obj.signalType}[${addr}].value|number:${leng})+'${unit}'):''}}`); 
							}else{
								$(el).html(`{{newCurrentData.${obj.signalType}[${addr}]?('${unit}'+(newCurrentData.${obj.signalType}[${addr}].value|number:${leng})):''}}`); 
							}
						}else{
							$(el).html(`{{newCurrentData.${obj.signalType}[${addr}]?(newCurrentData.${obj.signalType}[${addr}].value|number:${leng}):''}}`); 
						}
					} else if(obj.widget_type == 'numberValue') {
						//let originStr = $(el).html();
						let leng=obj.valuelength||'3',value;
						let unit=obj.unit||'';
						if(obj.afterunit!='0'){
							value=`{{newCurrentData['${obj.signalType}'][${obj.address}].value | number:${leng}}}{{'${unit}'}}`;
						}else{
							value=`{{'${unit}'}}{{newCurrentData['${obj.signalType}'][${obj.address}].value | number:${leng}}}`;
						}
						$(el).html(value);
					}else if(obj.widget_type == 'specialFont') {
						$(el).attr({'fill':obj.color||'red'});
						let value=`{{newCurrentData['${obj.signalType}'][${obj.address}].value | mynumber:'${obj.leng}'}}`;
						$(el).html(value);
					}else if(obj.widget_type=='normalUnnormal'){
						$(el).html(`{{newCurrentData.yaoxinObj[${obj.address}].value?'正常':'异常'}}`);
					}else if(obj.widget_type=='tempText'){
						let originStr=$(el).html();
						$(el).html(`{{${originStr}+originPosition}}`);
					}else if(obj.widget_type=='switchB'){
						$(el).find('[id^="switchbOpen"]').attr({"ng-show":"!newCurrentData.yaoxinObj["+obj.address+"].value"});
						$(el).find('[id^="switchbClose"]').attr({"ng-show":"newCurrentData.yaoxinObj["+obj.address+"].value"});
					}else if(obj.widget_type=='switchC'){
						$(el).find('[id^="switchOpen"]').attr({"ng-show":"!newCurrentData.yaoxinObj["+obj.address+"].value"});
					}else if(obj.widget_type=='histogram'){
						obj.col=parseInt(obj.col);
						obj.row=parseInt(obj.row);
						let histogram={};
						histogram.dSize={};//坐标轴尺寸
						histogram.dSize.width=$(el).find('[id^="hzZzt"]').attr('x2')-$(el).find('[id^="hzZzt"]').attr('x1');
						histogram.dSize.height=$(el).find('[id^="zzZzt"]').attr('y2')-$(el).find('[id^="zzZzt"]').attr('y1');
						histogram.originPosition={};//图标原点
						histogram.originPosition.x=parseFloat($(el).find('[id^="hzZzt"]').attr('x1'));
						histogram.originPosition.y=parseFloat($(el).find('[id^="hzZzt"]').attr('y1'));
						histogram.itemWidth=histogram.dSize.width/((obj.col+1)*obj.row);
						//去掉原有内容
						$(el).find('[id^="hzfgxZzt"]')[0].innerHTML='';
						$(el).find('[id^="zzfgxZzt"]')[0].innerHTML='';
						$(el).find('[id^="hzzbZzt"]')[0].innerHTML='';
						$(el).find('[id^="itemsListTextZzt"]')[0].innerHTML='';
						$(el).find('[id^="mainHistogramZzt"]')[0].innerHTML='';
						$(el).find('[id^="zzzbZzt"]')[0].innerHTML='';
						for(let i=0;i<obj.row;i++){
							//横坐标轴标标线
							var lineObj = document.createElementNS("http://www.w3.org/2000/svg","line");
							if(lineObj){  
					            lineObj.setAttribute("x1",histogram.originPosition.x+histogram.itemWidth*(obj.col+1)*i);  
					            lineObj.setAttribute("x2",histogram.originPosition.x+histogram.itemWidth*(obj.col+1)*i);  
					            lineObj.setAttribute("y1",histogram.originPosition.y-10);  
					            lineObj.setAttribute("y2",histogram.originPosition.y);  
					            lineObj.setAttribute("style","fill:#FFFF00;stroke-width:1;stroke:#FFFF00");  
					            $(el).find('[id^="hzfgxZzt"]')[0].appendChild(lineObj); 
					        }  
					        //横坐标轴标标名
					        let hzzbStr=`<text transform="matrix(1 0 0 1 ${histogram.originPosition.x+histogram.itemWidth*(obj.col+1)*i+histogram.itemWidth*(obj.col+1)/2} ${histogram.originPosition.y+25})" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="32.1104" file="#FFFF00" stroke="#FFFF00">{{${obj.arrData}[${i}][0].value}}</text>`;
					        $(el).find('[id^="hzzbZzt"]')[0].innerHTML+=hzzbStr;
						}
						//var svgDom;
						//var itemsText;//右上角项目指示（数学，语文，英语）
						for(let i=0;i<obj.col;i++){
							let obj1={};
							obj1.width=histogram.itemWidth-3;
							obj1.height=300;
							obj1.x=histogram.originPosition.x+histogram.itemWidth*(i+0.5)+3;
							obj1.y=histogram.originPosition.y-obj1.height;
							obj1.color=$rootScope.colorRandom(200,100);
							let svgDom=`<g id="item${i+1}">
								<rect x="${histogram.originPosition.x+histogram.dSize.width+50}" y="${histogram.originPosition.y+histogram.dSize.height+10+i*40}" fill="${obj1.color}" stroke="#FFFF00" stroke-width="0.5" width="80" height="30"/>
								<g class='barZzt${i+1}'>`
							let itemsText=`<text transform="matrix(1 0 0 1 ${histogram.originPosition.x+histogram.dSize.width+140} ${histogram.originPosition.y+histogram.dSize.height+10+i*40+20})" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="32.1104" stroke="#FFFF00"	fill="#FFFF00">{{${obj.arrData}[0][${i+1}].name}}</text>`
							for(let j=0;j<obj.row;j++){
								svgDom+=`<rect x="${obj1.x+j*(histogram.itemWidth*(obj.col+1))}" y="${obj1.y}" fill="${obj1.color}" stroke="#FFFF00" stroke-width="0.5" width="${obj1.width}" height="${obj1.height}"/>`
							}
							svgDom+=`</g></g>`;
							$(el).find('[id^="itemsListTextZzt"]')[0].innerHTML+=itemsText;
							$(el).find('[id^="mainHistogramZzt"]')[0].innerHTML+=svgDom;
						}
						//纵坐标轴标
						for(let i=0;i<=5;i++){
							var lineObj = document.createElementNS("http://www.w3.org/2000/svg","line");
							if(lineObj){  
					            lineObj.setAttribute("x1",histogram.originPosition.x+10);  
					            lineObj.setAttribute("x2",histogram.originPosition.x);  
					            lineObj.setAttribute("y1",histogram.originPosition.y+histogram.dSize.height/5*(i));  
					            lineObj.setAttribute("y2",histogram.originPosition.y+histogram.dSize.height/5*(i));  
					            lineObj.setAttribute("style","fill:#FFFF00;stroke-width:1;stroke:#FFFF00");  
					            $(el).find('[id^="hzfgxZzt"]')[0].appendChild(lineObj); 
					        } 
					        let zzbStr=`<text fill='#FFFF00' stroke="#FFFF00" transform="matrix(1 0 0 1 ${histogram.originPosition.x-30} ${histogram.originPosition.y+histogram.dSize.height/5*(i)})" font-family="'ArialMT'" font-size="32.1104">0</text>`;
					        $(el).find('[id^="zzzbZzt"]')[0].innerHTML+=zzbStr;
						}
						for(let k in obj){
							$(el).attr(obj);
						}
					}else if(obj.widget_type=='linechart'){
						obj.col=parseInt(obj.col);
						obj.row=parseInt(obj.row);
						let linechart={};
						linechart.data=$scope[obj.arrData];//数据
						linechart.size={};//两轴长度
						linechart.size.x=$(el).find('[id^="hzZXT"]').attr('x2')-$(el).find('[id^="hzZXT"]').attr('x1');
						linechart.size.y=$(el).find('[id^="zzZXT"]').attr('y1')-$(el).find('[id^="zzZXT"]').attr('y2');
						linechart.itemWidth=linechart.size.x/obj.row;//每一项的宽度
						linechart.originPosition={};//坐标原点位置
						linechart.originPosition.x=parseInt($(el).find('[id^="hzZXT"]').attr('x1'));
						linechart.originPosition.y=parseInt($(el).find('[id^="hzZXT"]').attr('y1'));
						$(el).find('[id^="hzfgxZXT"]').html('');//横轴分割线置空
						$(el).find('[id^="zzzbZXT"]').html('');//纵轴轴标置空
						$(el).find('[id^="zzfgxZXT"]').html('');//纵轴分割线置空
						$(el).find('[id^="mainLineZXT"]').html('');//主图线条置空
						$(el).find('[id^="mainPointZXT"]').html('');//主图线点置空
						$(el).find('[id^="itemListZXT"]').html('');//右上角项目标志置空
						$(el).find('[id^="hzzbZXT"]').html('');//横轴轴标置空
						for(let i=0;i<linechart.data.length;i++){
							let str=`<line fill="none" stroke="#000000" x1="241.737" y1="283.463" x2="241.737" y2="278.141"/>`;
							$(el).find('[id^="hzfgxZXT"]').html(str);
						}
					}else if(obj.widget_type=='fengshan'){
						let fengshan={};
						fengshan.center={};
						fengshan.center.x=parseFloat($(el).find('[id^="waikuangFS"]').attr('x'));
						fengshan.center.y=parseFloat($(el).find('[id^="waikuangFS"]').attr('y'));
						fengshan.size=parseFloat($(el).find('[id^="waikuangFS"]').attr('width'));
						
						$(el).find('[id^="rotateItems"] path').css({"transformOrigin":parseInt(fengshan.center.x+fengshan.size/2)+"px "+parseInt(fengshan.center.y+fengshan.size/2)+"px"})
						//$(el).removeAttr("onclick");
					}else if(obj.widget_type=='lampB'){
						for(let k in obj){
							$(el).attr(obj);
						}
						$(el).attr({"ng-class":"{lampBAlarm:!newCurrentData.yaoxinObj["+obj.address+"].value}"})
					}else if(obj.widget_type=='lampBS'){
						for(let k in obj){
							$(el).attr(obj);
						}
						$(el).find('[id^="colorIndicate"]').attr({'ng-hide':`interval1s&&newCurrentData.yaoxinObj["${obj.address}"].value!=0`})
					}else if(obj.widget_type=='lampA'){
						$(el).attr({"address":obj.address});
						$(el).find('[id^="targetEle"]').attr({"address":obj.address,"ng-click":"lampAWIDGET_fun($event)"})
					}else if(obj.widget_type=='showcontrollor'){
						$(el).find('[id^="controllor"]').attr({'ng-click':"showcontrollorWIDGET_fun($event)"});
						$(el).find('[id^="closeWIDGET"] [id^="targetEle"]').attr({"ng-click":"showcontrollorWIDGET_fun($event,'close')"})
						let idStr=$(el).attr('id');
						$(el).find('[id^="showItem"]').attr({'ng-show':idStr});
						
						//$(el).removeAttr("onclick");
					}else if(obj.widget_type=='tableList'){//表格
						let tableList={};
						tableList.size={};//表格尺寸
						tableList.data=$scope[obj.arrData];
						tableList.itemCount={};
						//tableList.itemCount.col=tableList.data[0].length;
						//tableList.itemCount.row=tableList.data.length+1;
						tableList.itemCount.col=obj.col;
						tableList.itemCount.row=obj.row;
						tableList.size.width=parseFloat($(el).find('[id^="outline"]').attr('width'));
						tableList.size.height=parseFloat($(el).find('[id^="outline"]').attr('height'));
						tableList.size.x=parseFloat($(el).find('[id^="outline"]').attr('x'));
						tableList.size.y=parseFloat($(el).find('[id^="outline"]').attr('y'));
						tableList.itemSize={};
						tableList.itemSize.width=tableList.size.width/tableList.itemCount.col;
						tableList.itemSize.height=tableList.size.height/tableList.itemCount.row;
						$(el).html($(el).find('[id^="outline"]'));
						
						for(let i=0;i<tableList.itemCount.row;i++){
							let str=`<line fill="none" stroke="#FFFF00" stroke-width="2" x1="${tableList.size.x}" y1="${tableList.size.y+tableList.size.height-i*(tableList.itemSize.height)}" x2="${tableList.size.x+tableList.size.width}" y2="${tableList.size.y+tableList.size.height-i*(tableList.itemSize.height)}"/>`;
							for(let j=0;j<tableList.itemCount.col;j++){
								str+=`<text transform="matrix(1 0 0 1 ${tableList.size.x+j*tableList.itemSize.width+6} ${tableList.size.y+tableList.itemSize.height+tableList.itemSize.height*(i+1)-6})" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">{{${obj.arrData}[${i}][${j}].value}}</text>`
							}
							el.innerHTML+=str;
						}
						for(let i=0;i<tableList.itemCount.col;i++){
							let str=`<line fill="none" stroke="#FFFF00" stroke-width="2" x1="${tableList.size.x+tableList.itemSize.width*i}" y1="${tableList.size.y}" x2="${tableList.size.x+tableList.itemSize.width*i}" y2="${tableList.size.y+tableList.size.height}"/>`;
							if(i>0){
								str+=`<text transform="matrix(1 0 0 1 ${tableList.size.x+i*tableList.itemSize.width+6} ${tableList.size.y+tableList.itemSize.height-6})" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">{{${obj.arrData}[0][${i}].name}}</text>`
							}
							el.innerHTML+=str;
						}
						`<text transform="matrix(1 0 0 1 557.5002 134.4998)" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">学生</text>`
					}else if(obj.widget_type=='functionBtn'){
						$(el).children().attr({'ng-click':obj['ng-click']})
					}else if(obj.widget_type=='highchartZztWIDGET'){
						let highchartZztWIDGET={};
						highchartZztWIDGET.size={};
						highchartZztWIDGET.size.width=parseFloat($(el).children().attr('width'));
						highchartZztWIDGET.size.height=parseFloat($(el).children().attr('height'));
						highchartZztWIDGET.position={};
						highchartZztWIDGET.position.x=parseFloat($(el).children().attr('x'));
						highchartZztWIDGET.position.y=parseFloat($(el).children().attr('y'));
						highchartZztWIDGET.id=$(el).attr('id')+'WIDGET';
						console.log(highchartZztWIDGET.id);
						let svgContainer = $(`<div id='${highchartZztWIDGET.id}' width='${highchartZztWIDGET.size.width}px' height='${highchartZztWIDGET.size.height}px'></div>`);
						$('body').append(svgContainer);
						var seriesOptions = [],
							seriesCounter = 0,
							names = ['MSFT', 'AAPL', 'GOOG'],
							// create the chart when all data is loaded
							createChart = function () {
									Highcharts.stockChart(highchartZztWIDGET.id, {
											rangeSelector: {
													selected: 4
											},
											yAxis: {
													labels: {
															formatter: function () {
																	return (this.value > 0 ? ' + ' : '') + this.value + '%';
															}
													},
													plotLines: [{
															value: 0,
															width: 2,
															color: 'silver'
													}]
											},
											plotOptions: {
													series: {
															compare: 'percent'
													}
											},
											tooltip: {
													pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
													valueDecimals: 2
											},
											series: seriesOptions
									});
							};
						$.each(names, function (i, name) {
								$.getJSON('https://data.jianshukeji.com/jsonp?filename=json/' + name.toLowerCase() + '-c.json&callback=?',    function (data) {
										
										seriesOptions[i] = {
												name: name,
												data: data
										};
										// As we're loading the data asynchronously, we don't know what order it will arrive. So
										// we keep a counter and create the chart when all the data is loaded.
										seriesCounter += 1;
										
										if (seriesCounter === names.length) {
												createChart();
										}
								});
						});
						$timeout(function(){
							//var str=$("#svgContainerHighchart");
							//console.log($(`#${highchartZztWIDGET.id}`)[0].outerHTML)
							//$('#svgContainerHighchart').remove();
							let strData=$(`#${highchartZztWIDGET.id}`)[0].outerHTML;
							var file = new File([strData], `${highchartZztWIDGET.id}.html`, { type: "text/plain;charset=utf-8" });
							saveAs(file);
							//str=`<g transform="translate(${highchartZztWIDGET.position.x},${highchartZztWIDGET.position.y})">`+str+'</g>';
						},2000)
						
						
						//console.log(document.querySelector("#svgContainerHighchart"))
					}else if(obj.widget_type == 'newPipe') {
						for(let k in obj) {$(el).attr(obj);}
						let pipeObj = {};
						pipeObj.size = {};
						pipeObj.startEnd = {};
						pipeObj.lineMsg = {};
						pipeObj.lineMsg.ax1 = Number($(el).find('[id^="pipea"]').attr('x1'));
						pipeObj.lineMsg.ay1 = Number($(el).find('[id^="pipea"]').attr('y1'));
						pipeObj.lineMsg.ax2 = Number($(el).find('[id^="pipea"]').attr('x2'));
						pipeObj.lineMsg.ay2 = Number($(el).find('[id^="pipea"]').attr('y2'));

						pipeObj.lineMsg.bx1 = Number($(el).find('[id^="pipeb"]').attr('x1'));
						pipeObj.lineMsg.by1 = Number($(el).find('[id^="pipeb"]').attr('y1'));
						pipeObj.lineMsg.bx2 = Number($(el).find('[id^="pipeb"]').attr('x2'));
						pipeObj.lineMsg.by2 = Number($(el).find('[id^="pipeb"]').attr('y2'));

						obj.fillColor = obj.fillColor || 'red';
						obj.lineColor = obj.lineColor || 'red';
						$(el).find('[id^="pipe"]').attr({
							stroke: obj.lineColor
						})
						if((pipeObj.lineMsg.ax1==pipeObj.lineMsg.ax2)&&(pipeObj.lineMsg.bx1==pipeObj.lineMsg.bx2)){
							obj.pipedirect = 'longitudinal';
							$(el).attr({pipedirect:'longitudinal'})
						}else if((pipeObj.lineMsg.ay1==pipeObj.lineMsg.ay2)&&(pipeObj.lineMsg.by1==pipeObj.lineMsg.by2)){
							obj.pipedirect = 'horizontal';
							$(el).attr({pipedirect:'horizontal'})
						}else{
							$scope.compileError.push({id:$(el).attr('id'),errorMsg:'管道不水平或者垂直'})
							//console.error('管道不水平或者垂直，ax1,ax2,bx1,bx2,ay1,ay2,by1,by2：',pipeObj.lineMsg.ax1,pipeObj.lineMsg.ax2,pipeObj.lineMsg.bx1,pipeObj.lineMsg.bx2,pipeObj.lineMsg.ay1,pipeObj.lineMsg.ay2,pipeObj.lineMsg.by1,pipeObj.lineMsg.by2)
							//console.log('组件id：',$(el).attr('id'));
							return ;
						}
						//console.log(obj.pipedirect)

						if(obj.pipedirect == 'horizontal') { //横向
							pipeObj.size.width = Math.abs($(el).find('[id^="pipeb"]').attr('y2') - $(el).find('[id^="pipea"]').attr('y1'));
							$(el).attr({
								width: pipeObj.size.width
							});
							//pipeObj.size.leng={}
							let str = '';
							for(let i = 0; true; i++) {
								if(obj.opposite == '0') {
									pipeObj.startEnd.x1 = pipeObj.lineMsg.ax1 > pipeObj.lineMsg.bx1 ? pipeObj.lineMsg.bx1 : pipeObj.lineMsg.ax1;
									pipeObj.startEnd.y1 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.by1 : pipeObj.lineMsg.ay1;
									pipeObj.startEnd.x2 = pipeObj.lineMsg.ax2 > pipeObj.lineMsg.bx2 ? pipeObj.lineMsg.bx2 : pipeObj.lineMsg.ax2;
									pipeObj.startEnd.y2 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.ay1 : pipeObj.lineMsg.by1;
									$(el).attr({
										endPos: pipeObj.startEnd.x2
									});
									if(pipeObj.startEnd.x1 + i * 5 * pipeObj.size.width >= pipeObj.startEnd.x2) {
										break;
									}
									str += `<line fill="none" stroke="${obj.fillColor}" x1="${pipeObj.startEnd.x1+i*pipeObj.size.width*5}" y1="${pipeObj.startEnd.y1}" x2="${pipeObj.startEnd.x1+i*pipeObj.size.width*5}" y2="${pipeObj.startEnd.y2}"/>`

								} else {
									pipeObj.startEnd.x1 = pipeObj.lineMsg.ax1 < pipeObj.lineMsg.bx1 ? pipeObj.lineMsg.bx1 : pipeObj.lineMsg.ax1;
									pipeObj.startEnd.y1 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.by1 : pipeObj.lineMsg.ay1;
									pipeObj.startEnd.x2 = pipeObj.lineMsg.ax2 < pipeObj.lineMsg.bx2 ? pipeObj.lineMsg.bx2 : pipeObj.lineMsg.ax2;
									pipeObj.startEnd.y2 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.ay1 : pipeObj.lineMsg.by1;
									$(el).attr({
										endPos: pipeObj.startEnd.x1
									});
									if(pipeObj.startEnd.x2 - i * 5 * pipeObj.size.width <= pipeObj.startEnd.x1) {
										break;
									}
									str += `<line fill="none" stroke="${obj.fillColor}" x1="${pipeObj.startEnd.x2-i*5*pipeObj.size.width}" y1="${pipeObj.startEnd.y1}" x2="${pipeObj.startEnd.x2-i*5*pipeObj.size.width}" y2="${pipeObj.startEnd.y2}"/>`
								}
							}
							$(el).find('[id^="fillLine"]').html(str)
						} else if(obj.pipedirect == 'longitudinal') { //纵向
							pipeObj.size.width = Math.abs(pipeObj.lineMsg.bx1 - pipeObj.lineMsg.ax1);
							//console.log(pipeObj)
							$(el).attr({
								width: pipeObj.size.width
							});
							let str = '';
							for(let i = 0; true; i++) {
								if(obj.opposite == '0') {
									pipeObj.startEnd.x1 = pipeObj.lineMsg.ax1 > pipeObj.lineMsg.bx1 ? pipeObj.lineMsg.bx1 : pipeObj.lineMsg.ax1;
									pipeObj.startEnd.y1 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.by1 : pipeObj.lineMsg.ay1;
									pipeObj.startEnd.x2 = pipeObj.lineMsg.ax2 > pipeObj.lineMsg.bx2 ? pipeObj.lineMsg.ax2 : pipeObj.lineMsg.bx2;
									pipeObj.startEnd.y2 = pipeObj.lineMsg.ay2 > pipeObj.lineMsg.by2 ? pipeObj.lineMsg.by2 : pipeObj.lineMsg.ay2;
									$(el).attr({
										endPos: pipeObj.startEnd.y2
									});
									if(pipeObj.startEnd.y1 + i * 5 * pipeObj.size.width >= pipeObj.startEnd.y2) {
										break;
									}
									str += `<line fill="none" stroke="${obj.fillColor}" x1="${pipeObj.startEnd.x1}" y1="${pipeObj.startEnd.y1+i*5*pipeObj.size.width}" x2="${pipeObj.startEnd.x2}" y2="${pipeObj.startEnd.y1+i*5*pipeObj.size.width}"/>`
								} else {
									pipeObj.startEnd.x1 = pipeObj.lineMsg.ax1 < pipeObj.lineMsg.bx1 ? pipeObj.lineMsg.bx1 : pipeObj.lineMsg.ax1;
									pipeObj.startEnd.y1 = pipeObj.lineMsg.ay1 > pipeObj.lineMsg.by1 ? pipeObj.lineMsg.ay1 : pipeObj.lineMsg.by1;
									pipeObj.startEnd.x2 = pipeObj.lineMsg.ax2 < pipeObj.lineMsg.bx2 ? pipeObj.lineMsg.ax2 : pipeObj.lineMsg.bx2;
									pipeObj.startEnd.y2 = pipeObj.lineMsg.ay2 > pipeObj.lineMsg.by2 ? pipeObj.lineMsg.ay2 : pipeObj.lineMsg.by2;
									$(el).attr({
										endPos: pipeObj.startEnd.y1
									});
									if(pipeObj.startEnd.y2 - i * 5 * pipeObj.size.width <= pipeObj.startEnd.y1) {
										break;
									}
									str += `<line fill="none" stroke="${obj.fillColor}" x1="${pipeObj.startEnd.x1}" y1="${pipeObj.startEnd.y2-i*5*pipeObj.size.width}" x2="${pipeObj.startEnd.x2}" y2="${pipeObj.startEnd.y2-i*5*pipeObj.size.width}"/>`
								}
							}
							$(el).find('[id^="fillLine"]').html(str)
						}
					}else if(obj.widget_type=='pipeWIDGET'){
						for(let k in obj){$(el).attr(obj);}
						let pipeObj={};
						pipeObj.fillColor=obj.fillColor;
						pipeObj.lineColor=obj.lineColor;
						pipeObj.shape={};//管道形状：长度，直径
						pipeObj.position={};//管道起始位置
						let ax1=parseFloat($(el).find('[id^="lineA"]').attr('x1'));
						let ay1=parseFloat($(el).find('[id^="lineA"]').attr('y1'));
						let bx1=parseFloat($(el).find('[id^="lineB"]').attr('x1'));
						let by1=parseFloat($(el).find('[id^="lineB"]').attr('y1'));
						
						let ax2=parseFloat($(el).find('[id^="lineA"]').attr('x2'));
						let ay2=parseFloat($(el).find('[id^="lineA"]').attr('y2'));
						let bx2=parseFloat($(el).find('[id^="lineB"]').attr('x2'));
						let by2=parseFloat($(el).find('[id^="lineB"]').attr('y2'));
						$(el).find('[id^="lineA"]').attr({'stroke':pipeObj.lineColor});
						$(el).find('[id^="lineB"]').attr({'stroke':pipeObj.lineColor});
						if(obj.pipedirect=='horizontal'){//横向
							pipeObj.shape.diameter=Math.abs(by1-ay1);
							$(el).attr({'diameter':pipeObj.shape.diameter});
							pipeObj.shape.leng=(ax2>bx2?ax2:bx2)-(ax1<bx1?ax1:bx1);
							pipeObj.position.startx=parseFloat(ax1>bx1?bx1:ax1);
							pipeObj.position.starty=parseFloat(ay1);
							let str=``;
							let i=0;
							while(true){
								let startx=pipeObj.position.startx+pipeObj.shape.diameter*i;
								if((startx+pipeObj.shape.diameter*1.5)>(pipeObj.position.startx+pipeObj.shape.leng)){
									break;
								}
								str+=`<rect x="${startx}" y="${pipeObj.position.starty+1}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter-2}" fill="${pipeObj.fillColor}" stroke="#FFFF33"/>`;
								i++;
							}
							str+=`<rect class='fixed' x="${pipeObj.position.startx+pipeObj.shape.leng-pipeObj.shape.diameter/2}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter}" fill="#000" stroke="#000"/>`;
							str+=`<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter}" fill="#000" stroke="#000"/>`;
							$(el).find('[id^="indicators"]').html(str);
						}else if(obj.pipedirect=='longitudinal'){//纵向
							pipeObj.shape.diameter=Math.abs(bx1-ax1);
							$(el).attr({'diameter':pipeObj.shape.diameter});
							pipeObj.shape.leng=(ay2>by2?ay2:by2)-(ay1<by1?ay1:by1);
							pipeObj.position.startx=ax1;
							pipeObj.position.starty=ay1<by1?ay1:by1;
							let str=``;
							let i=0;
							while(true){
								let starty=pipeObj.position.starty+pipeObj.shape.diameter*i;
								if((starty+pipeObj.shape.diameter*1.5)>(pipeObj.position.starty+pipeObj.shape.leng)){
									console.log(i);
									break;
								}
								str+=`<rect x="${pipeObj.position.startx+1}" y="${starty}" width="${pipeObj.shape.diameter-2}" height="${pipeObj.shape.diameter/2}" fill="${pipeObj.fillColor}" stroke="#FFFF33"/>`;
								i++;
							}
							str+=`<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty+pipeObj.shape.leng-pipeObj.shape.diameter/2}" width="${pipeObj.shape.diameter}" height="${pipeObj.shape.diameter/2}" fill="#000" stroke="#000"/>`;
							str+=`<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter}" height="${pipeObj.shape.diameter/2}" fill="#000" stroke="#000"/>`;
							$(el).find('[id^="indicators"]').html(str);
						}
					}else if(obj.widget_type=='opendoor'){
						for(let k in obj){
							$(el).attr(obj);
						}
						$(el).attr({'ng-show':`interval1s&&newCurrentData.yaoxinObj["${obj.address}"].value!=0`})
					}else if(obj.widget_type=='closedoor'){
						for(let k in obj){
							$(el).attr(obj);
						}
						$(el).attr({'ng-hide':`newCurrentData.yaoxinObj["${obj.address}"].value!=0`})
					}else{
						for(let k in obj){
							$(el).attr(obj);
						}
					}
				}
					
			}
		})
		if($scope.compileError.length){
			$scope.compileErrorModal=true;
			toaster.pop('error','','编译失败，请检查svg源文件！');
			return;
		}
		let strData=document.getElementsByClassName('svgCompileBox')[0].innerHTML;
		var file = new File([strData], filename, { type: "text/plain;charset=utf-8" });
		saveAs(file);
		$('.svgCompileBox').html('');
	}
	//文件/文件夹双击
	$scope.fileOptFun=function(e,item){
		if(item.isDirectory){
			$scope.getSubFolder(item,function(data){
				item.subFolder=data
			});
			$scope.currentFolder=item;
		}else{
			var eleLink = document.createElement('a');
			eleLink.style.display = 'none';
			eleLink.download = item.url.split('/').pop();
			eleLink.href = yxIp.requestIp+item.url;
			document.body.appendChild(eleLink);
			eleLink.click();
			document.body.removeChild(eleLink);	
		}
	}
	//新建文件夹
	$scope.newFolder=function(){
		$scope.newFolderConfirmModal=true;
		$scope.showContextmenu=false;
	}
	$scope.newFolderConfirm=function(){
		yxRequest.send('post',yxIp.requestIp+'folder/creatFolder',
			{title:$scope.foldername},
			function(result){
				toaster.pop('success','','新建成功');
				$scope.getMainFolder(function(data){
					$scope.folderData[0].subFolder=data;
					$scope.currentFolder=$scope.folderData[0];
					$scope.folderData[0].showSubFolder=true;
					$scope.newFolderConfirmModal=false;
				});
			},function(data){
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//文件夹右键菜单
	$scope.showFolderOptMenu=function(e,item){
		$scope.folderOptMenu=true;
		$('.window-folderOptMenu').css({top:e.clientY+'px',left:e.clientX+'px'});
		$scope.optItem=item;
	}
	//文件夹重命名
	$scope.folderRenameFun=function(){
		$scope.folderRenameConfirmModal=true;
		$scope.newFileName=$scope.optItem.url.split('/').pop();
		$scope.folderOptMenu=false;
	}
	//文件夹重命名确认
	$scope.folderRenameConfirm=function(){
		yxRequest.send('post',yxIp.requestIp+'folder/reFolder',
			{old_title:$scope.optItem.url.split('/').pop(),new_title:$scope.newFileName},
			function(result){
				toaster.pop('success','','修改成功');
				$scope.getMainFolder(function(data){
					$scope.folderData[0].subFolder=data;
					$scope.folderRenameConfirmModal=false;
				});
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				console.error(data)
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	//文件夹删除
	$scope.folderDeleteFun=function(){
		$scope.folderOptMenu=false;
		yxRequest.send('post',yxIp.requestIp+'folder/rmFolder',
			{title:$scope.optItem.url.split('/').pop()},
			function(result){
				if($scope.optItem==$scope.currentFolder){
					$scope.toFolder();
				}
				toaster.pop('success','','删除成功');
				$scope.getMainFolder(function(data){
					$scope.folderData[0].subFolder=data;
				});
			},function(data){
				yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
				console.error(data)
				toaster.pop('error','',data.msg)
			},'access'
		);
	}
	$scope.uploadFile = null;
	//base64
	$scope.fileBase64Fun = function(fileArr) {
		angular.forEach(fileArr,function(file){
			if(file.size>(10*1024*1000)){
	    		toaster.pop('warning','','文件大小限制10M！');
	    		return;
	    	}
			var toastInstance = toaster.pop('wait', '', '等待上传，请稍后...', 99999);
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function() {
				file.uploadFile=reader.result;
				var timer = $timeout(function() {
					$scope.upload(file);
					$timeout.cancel(timer);
					toaster.clear(toastInstance);
				}, 300, true);
			}
		})
	
	}
	$scope.upload = function(file) {
		//var toastInstance = toaster.pop('wait', '', '正在上传，请稍后...', 99999);
		$rootScope.modals.uploadingModal=true;
		if($scope.currentFolder.url.indexOf('/')<0){
			var path='';
		}else{
			var path=$scope.currentFolder.url.split('/').pop();
		}
		Upload.upload(
	        { 
	            url: yxIp.requestIp+'folder/upload',
	            fields: {'filename': file.name,path:path,file:file.uploadFile}
        })
        .progress(function (evt) { 
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total); 
                //console.log('progress: ' + progressPercentage + '% ' + evt.config);
              $('.uploadingModal .uploading-currentBar').css({'width':progressPercentage+'%'})
        })
        .success(function (data, status, headers, config) {
        	$rootScope.modals.uploadingModal=false;
        	//toaster.clear(toastInstance);
        	if(data.status!=200){
        		toaster.pop('warning','',data.msg)
        	}else{
        		toaster.pop('success','','上传成功')
        	}
            if($scope.currentFolder.url.indexOf('/')<0){
				$scope.getMainFolder(function(data){
					$scope.currentFolder.subFolder=data;
				});
			}else{
				$scope.getSubFolder($scope.currentFolder,function(data){
					$scope.currentFolder.subFolder=data;
				});
			}  
        })
        .error(function (data, status, headers, config) { 
        	//toaster.clear(toastInstance);
        	$rootScope.modals.uploadingModal=false;
        	yxLocalStorage.arrAdd({type:'error',msg:data,time:new Date()})
            console.log('error status: ' + data,status,headers,config); 
            toaster.pop('error','','上传失败')
        })
	}
	//上传文件
    $scope.$watch('fileData', function() {
    	$scope.showContextmenu=false;
    	 if(!$scope.fileData) {
			return
		};
    	
       
		$scope.fileArr=[$scope.fileData];
		$scope.fileBase64Fun($scope.fileArr);
    });
    	//上传文件
    $scope.$watch('fileData1', function() {
    	if(!$scope.fileData1){
    		return;
    	}
    	$scope.fileBase64Fun($scope.fileData1);
    });
	$(document).keydown(function(event){
		event.stopPropagation();
		if($state.current.name=='main.diagram.fileManage'){
			if(event.keyCode==46){
				$scope.fileDeleteFun();
			}
		}
			
　　});
    
}]);
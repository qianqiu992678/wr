'use strict';
angular.module('app')
	.controller('test2_svgTestCtrl', ['$filter', '$rootScope', '$scope', '$http', '$state', '$timeout', 'toaster', '$stateParams', '$interval', 'yxRequest', '$compile',
		function($filter, $rootScope, $scope, $http, $state, $timeout, toaster, $stateParams, $interval, yxRequest, $compile) {
			console.log('test2_svgTestCtrl');
			//获取svg文件
			$.ajax({
				type: "get",
				url: "src/app/windows/window_test/AiTest.svg",
				dataType: 'text',
				success: function(data) {
					if(global_level > 4) {
						console.log("成功：", arguments);
					}
					var str = $compile(data)($scope);
					$('.test2_svgTest').html(str);
					$scope.domChuLi();
				},
				error: function() {
					if(global_level > 1) {
						console.log("失败：", arguments)
					}
				}
			});
			$scope.objArr = [
				[{
					name: '姓名',
					value: '李磊',
				}, {
					name: '数学',
					value: 95,
				}, {
					name: '语文',
					value: 66,
				}, {
					name: '英语',
					value: 90,
				}],
				[{
					name: '姓名',
					value: '韩梅梅',
				}, {
					name: '数学',
					value: 95,
				}, {
					name: '语文',
					value: 65,
				}, {
					name: '英语',
					value: 95,
				}],
				[{
					name: '姓名',
					value: '小明',
				}, {
					name: '数学',
					value: 95,
				}, {
					name: '语文',
					value: 25,
				}, {
					name: '英语',
					value: 90,
				}],
				[{
					name: '姓名',
					value: '小红',
				}, {
					name: '数学',
					value: 55,
				}, {
					name: '语文',
					value: 85,
				}, {
					name: '英语',
					value: 90,
				}],
				[{
					name: '姓名',
					value: '元静',
				}, {
					name: '数学',
					value: 55,
				}, {
					name: '语文',
					value: 80,
				}, {
					name: '英语',
					value: 90,
				}],
				[{
					name: '姓名',
					value: '建平',
				}, {
					name: '数学',
					value: 95,
				}, {
					name: '语文',
					value: 75,
				}, {
					name: '英语',
					value: 90,
				}],
			]
			$scope.domChuLi = function() {
				$scope.allElements = $('.test2_svgTest *');
				angular.forEach($scope.allElements, function(el, key) {
					if(el.attributes.onclick) {
						let str = el.attributes.onclick.nodeValue,
							obj;
						//console.log(str)

						try {
							obj = JSON.parse(str.substring(7, str.length - 2));
						} catch(e) {
							console.log('json格式出错了：', str)
						}

						//console.log(obj)
						if(obj.compil_info) {
							$(el).removeAttr("onclick");
							if(obj.widget_type == 'image') {
								for(let k in obj) {
									$(el).attr(obj);
								}
								$(el).attr({
									"xlink:href": '/' + obj['xlink:href']
								});
							} else if(obj.widget_type == 'aiText') {
								let addr = obj.address;
								let originStr = $(el).html();
								$(el).html(`${originStr}{{newCurrentData.${obj.signalType}[${addr}].value}}`);

							} else if(obj.widget_type == 'textAi') {
								let addr = obj.address;
								let originStr = $(el).html();
								$(el).html(`{{newCurrentData.${obj.signalType}[${addr}].value}}${originStr}`);

							} else if(obj.widget_type == 'numberValue') {
								//let originStr = $(el).html();
								let leng = obj.valuelength || '3',
									value;
								let unit = obj.unit || '';
								if(obj.afterunit != '0') {
									value = `{{newCurrentData['${obj.signalType}'][${obj.address}].value | number:${leng}}}{{'${unit}'}}`;
								} else {
									value = `{{'${unit}'}}{{newCurrentData['${obj.signalType}'][${obj.address}].value | number:${leng}}}`;
								}
								$(el).html(value);
							} else if(obj.widget_type == 'specialFont') {
								$(el).attr({
									'fill': obj.color || 'red'
								});
								let value = `{{newCurrentData['${obj.signalType}'][${obj.address}].value | mynumber:'${obj.leng}' }}`;
								$(el).html(value);
							} else if(obj.widget_type == 'normalUnnormal') {
								console.log(obj.address)
								$(el).html(`{{newCurrentData.yaoxinObj[${obj.address}].value?'正常':'异常'}}`);
							} else if(obj.widget_type == 'tempText') {
								let originStr = $(el).html();
								$(el).html(`{{originPosition+${originStr}}}`);

							} else if(obj.widget_type == 'histogram') {
								obj.col = parseInt(obj.col);
								obj.row = parseInt(obj.row);
								//console.log($(el).find('[id^="hzZzt"]').attr('x2')-$(el).find('[id^="hzZzt"]').attr('x1'));
								let histogram = {};
								histogram.dSize = {}; //坐标轴尺寸
								histogram.dSize.width = $(el).find('[id^="hzZzt"]').attr('x2') - $(el).find('[id^="hzZzt"]').attr('x1');
								histogram.dSize.height = $(el).find('[id^="zzZzt"]').attr('y2') - $(el).find('[id^="zzZzt"]').attr('y1');
								histogram.originPosition = {}; //图标原点
								histogram.originPosition.x = parseFloat($(el).find('[id^="hzZzt"]').attr('x1'));
								histogram.originPosition.y = parseFloat($(el).find('[id^="hzZzt"]').attr('y1'));
								histogram.itemWidth = histogram.dSize.width / ((obj.col + 1) * obj.row);
								//去掉原有内容
								$(el).find('[id^="hzfgxZzt"]')[0].innerHTML = '';
								$(el).find('[id^="zzfgxZzt"]')[0].innerHTML = '';
								$(el).find('[id^="hzzbZzt"]')[0].innerHTML = '';
								$(el).find('[id^="itemsListTextZzt"]')[0].innerHTML = '';
								$(el).find('[id^="mainHistogramZzt"]')[0].innerHTML = '';
								$(el).find('[id^="zzzbZzt"]')[0].innerHTML = '';
								for(let i = 0; i < obj.row; i++) {
									//横坐标轴标标线
									var lineObj = document.createElementNS("http://www.w3.org/2000/svg", "line");
									if(lineObj) {
										lineObj.setAttribute("x1", histogram.originPosition.x + histogram.itemWidth * (obj.col + 1) * i);
										lineObj.setAttribute("x2", histogram.originPosition.x + histogram.itemWidth * (obj.col + 1) * i);
										lineObj.setAttribute("y1", histogram.originPosition.y - 10);
										lineObj.setAttribute("y2", histogram.originPosition.y);
										lineObj.setAttribute("style", "fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)");
										$(el).find('[id^="hzfgxZzt"]')[0].appendChild(lineObj);
									}
									//横坐标轴标标名
									let hzzbStr = `<text transform="matrix(1 0 0 1 ${histogram.originPosition.x+histogram.itemWidth*(obj.col+1)*i+histogram.itemWidth*(obj.col+1)/2} ${histogram.originPosition.y+25})" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="32.1104">{{${obj.arrData}[${i}][0].value}}</text>`;
									$(el).find('[id^="hzzbZzt"]')[0].innerHTML += hzzbStr;
								}
								//var svgDom;
								//var itemsText;//右上角项目指示（数学，语文，英语）
								for(let i = 0; i < obj.col; i++) {
									let obj1 = {};
									obj1.width = histogram.itemWidth - 3;
									obj1.height = 300;
									obj1.x = histogram.originPosition.x + histogram.itemWidth * (i + 0.5) + 3;
									obj1.y = histogram.originPosition.y - obj1.height;
									//console.log($rootScope.colorRandom(200,100))
									obj1.color = $rootScope.colorRandom(200, 100);
									let svgDom = `<g id="item${i+1}">
								<rect x="${histogram.originPosition.x+histogram.dSize.width+50}" y="${histogram.originPosition.y+histogram.dSize.height+10+i*40}" fill="${obj1.color}" stroke="#000000" stroke-width="0.5" width="80" height="30"/>
								<g class='barZzt${i+1}'>`
									let itemsText = `<text transform="matrix(1 0 0 1 ${histogram.originPosition.x+histogram.dSize.width+140} ${histogram.originPosition.y+histogram.dSize.height+10+i*40+20})" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="32.1104">{{${obj.arrData}[0][${i+1}].name}}</text>`
									for(let j = 0; j < obj.row; j++) {
										console.log(histogram.originPosition.x, histogram.originPosition.x + histogram.itemWidth * (i + 0.5) + 3 + j * (histogram.itemWidth * (obj.col + 1)));
										svgDom += `<rect x="${obj1.x+j*(histogram.itemWidth*(obj.col+1))}" y="${obj1.y}" fill="${obj1.color}" stroke="#000000" stroke-width="0.5" width="${obj1.width}" height="${obj1.height}"/>`
									}
									svgDom += `</g></g>`;
									//console.log(svgDom)
									$(el).find('[id^="itemsListTextZzt"]')[0].innerHTML += itemsText;
									$(el).find('[id^="mainHistogramZzt"]')[0].innerHTML += svgDom;
								}
								//console.log($(el).find('[id^="mainHistogramZzt"]')[0])
								//纵坐标轴标
								for(let i = 0; i <= 5; i++) {
									var lineObj = document.createElementNS("http://www.w3.org/2000/svg", "line");
									if(lineObj) {
										lineObj.setAttribute("x1", histogram.originPosition.x + 10);
										lineObj.setAttribute("x2", histogram.originPosition.x);
										lineObj.setAttribute("y1", histogram.originPosition.y + histogram.dSize.height / 5 * (i));
										lineObj.setAttribute("y2", histogram.originPosition.y + histogram.dSize.height / 5 * (i));
										lineObj.setAttribute("style", "fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)");
										$(el).find('[id^="hzfgxZzt"]')[0].appendChild(lineObj);
									}
									let zzbStr = `<text transform="matrix(1 0 0 1 ${histogram.originPosition.x-30} ${histogram.originPosition.y+histogram.dSize.height/5*(i)})" font-family="'ArialMT'" font-size="32.1104">0</text>`;
									$(el).find('[id^="zzzbZzt"]')[0].innerHTML += zzbStr;
								}
								for(let k in obj) {
									$(el).attr(obj);

								}
							} else if(obj.widget_type == 'linechart') {
								obj.col = parseInt(obj.col);
								obj.row = parseInt(obj.row);
								let linechart = {};
								linechart.data = $scope[obj.arrData]; //数据
								linechart.size = {}; //两轴长度
								linechart.size.x = $(el).find('[id^="hzZXT"]').attr('x2') - $(el).find('[id^="hzZXT"]').attr('x1');
								linechart.size.y = $(el).find('[id^="zzZXT"]').attr('y1') - $(el).find('[id^="zzZXT"]').attr('y2');
								linechart.itemWidth = linechart.size.x / obj.row; //每一项的宽度
								linechart.originPosition = {}; //坐标原点位置
								linechart.originPosition.x = parseInt($(el).find('[id^="hzZXT"]').attr('x1'));
								linechart.originPosition.y = parseInt($(el).find('[id^="hzZXT"]').attr('y1'));
								//console.log(linechart.originPosition)
								//console.log(linechart.itemWidth);
								//console.log(linechart.originPosition)

								//console.log($(el).find('[id^="hzfgxZXT"]').html());
								$(el).find('[id^="hzfgxZXT"]').html(''); //横轴分割线置空
								//console.log($(el).find('[id^="hzfgxZXT"]').html());
								$(el).find('[id^="zzzbZXT"]').html(''); //纵轴轴标置空
								$(el).find('[id^="zzfgxZXT"]').html(''); //纵轴分割线置空
								$(el).find('[id^="mainLineZXT"]').html(''); //主图线条置空
								$(el).find('[id^="mainPointZXT"]').html(''); //主图线点置空
								$(el).find('[id^="itemListZXT"]').html(''); //右上角项目标志置空
								$(el).find('[id^="hzzbZXT"]').html(''); //横轴轴标置空

								for(let i = 0; i < linechart.data.length; i++) {
									let str = `<line fill="none" stroke="#000000" x1="241.737" y1="283.463" x2="241.737" y2="278.141"/>`;
									$(el).find('[id^="hzfgxZXT"]').html(str);
								}
							} else if(obj.widget_type == 'fengshan') {
								//console.log($(el).find('[id^="rotateItems"] path')).
								let fengshan = {};
								fengshan.center = {};
								fengshan.center.x = parseFloat($(el).find('[id^="waikuangFS"]').attr('x'));
								fengshan.center.y = parseFloat($(el).find('[id^="waikuangFS"]').attr('y'));
								fengshan.size = parseFloat($(el).find('[id^="waikuangFS"]').attr('width'));

								$(el).find('[id^="rotateItems"] path').css({
									"transformOrigin": parseInt(fengshan.center.x + fengshan.size / 2) + "px " + parseInt(fengshan.center.y + fengshan.size / 2) + "px"
								})
								//$(el).removeAttr("onclick");
							} else if(obj.widget_type == 'lampB') {
								for(let k in obj) {
									$(el).attr(obj);
									//$(el).removeAttr("onclick");
								}
								$(el).attr({
									"ng-class": "{lampBAlarm:!newCurrentData.yaoxinObj[" + obj.address + "].value}"
								})
							} else if(obj.widget_type == 'lampBS') {
								for(let k in obj) {
									$(el).attr(obj);
									//$(el).removeAttr("onclick");
								}
								$(el).find('[id^="colorIndicate"]').attr({
									'ng-hide': `interval1s&&newCurrentData.yaoxinObj["${obj.address}"].value!=0`
								})
								//$(el).attr({"ng-class":"{lampBSAlarm:!newCurrentData.yaoxinObj["+obj.address+"].value}"})
							} else if(obj.widget_type == 'lampA') {
								$(el).attr({
									"address": obj.address
								})
								$(el).find('[id^="targetEle"]').attr({
									"address": obj.address,
									"ng-click": "lampAWIDGET_fun($event)"
								})
							} else if(obj.widget_type == 'showcontrollor') {
								$(el).find('[id^="controllor"]').attr({
									'ng-click': "showcontrollorWIDGET_fun($event)"
								});
								$(el).find('[id^="closeWIDGET"] [id^="targetEle"]').attr({
									"ng-click": "showcontrollorWIDGET_fun($event,'close')"
								})
								let idStr = $(el).attr('id');
								//console.log(idStr)
								$(el).find('[id^="showItem"]').attr({
									'ng-show': idStr
								});

								//$(el).removeAttr("onclick");
							} else if(obj.widget_type == 'tableList') { //表格
								let tableList = {};
								tableList.size = {}; //表格尺寸
								tableList.data = $scope[obj.arrData];
								tableList.itemCount = {};
								tableList.itemCount.col = tableList.data[0].length;
								tableList.itemCount.row = tableList.data.length + 1;
								tableList.size.width = parseFloat($(el).find('[id^="outline"]').attr('width'));
								tableList.size.height = parseFloat($(el).find('[id^="outline"]').attr('height'));
								tableList.size.x = parseFloat($(el).find('[id^="outline"]').attr('x'));
								tableList.size.y = parseFloat($(el).find('[id^="outline"]').attr('y'));
								tableList.itemSize = {};
								tableList.itemSize.width = tableList.size.width / tableList.itemCount.col;
								tableList.itemSize.height = tableList.size.height / tableList.itemCount.row;
								$(el).html($(el).find('[id^="outline"]'));

								for(let i = 0; i < tableList.itemCount.row; i++) {
									let str = `<line fill="none" stroke="#FFFF00" stroke-width="2" x1="${tableList.size.x}" y1="${tableList.size.y+tableList.size.height-i*(tableList.itemSize.height)}" x2="${tableList.size.x+tableList.size.width}" y2="${tableList.size.y+tableList.size.height-i*(tableList.itemSize.height)}"/>`;
									for(let j = 0; j < tableList.itemCount.col; j++) {
										str += `<text transform="matrix(1 0 0 1 ${tableList.size.x+j*tableList.itemSize.width+6} ${tableList.size.y+tableList.itemSize.height+tableList.itemSize.height*(i+1)-6})" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">{{${obj.arrData}[${i}][${j}].value}}</text>`
									}
									el.innerHTML += str;
								}
								for(let i = 0; i < tableList.itemCount.col; i++) {
									let str = `<line fill="none" stroke="#FFFF00" stroke-width="2" x1="${tableList.size.x+tableList.itemSize.width*i}" y1="${tableList.size.y}" x2="${tableList.size.x+tableList.itemSize.width*i}" y2="${tableList.size.y+tableList.size.height}"/>`;
									if(i > 0) {
										str += `<text transform="matrix(1 0 0 1 ${tableList.size.x+i*tableList.itemSize.width+6} ${tableList.size.y+tableList.itemSize.height-6})" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">{{${obj.arrData}[0][${i}].name}}</text>`
									}
									el.innerHTML += str;
								}
								`<text transform="matrix(1 0 0 1 557.5002 134.4998)" fill="#FFFF00" font-family="'AdobeSongStd-Light-GBpc-EUC-H'" font-size="12">学生</text>`
							} else if(obj.widget_type == 'newPipe') {
								for(let k in obj) {
									$(el).attr(obj);
								}

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
											console.log(pipeObj.startEnd.y2)
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
									console.log(str)
									$(el).find('[id^="fillLine"]').html(str)
								}

							} else if(obj.widget_type == 'pipeWIDGET') {
								for(let k in obj) {
									$(el).attr(obj);
								}
								let pipeObj = {};
								pipeObj.fillColor = obj.fillColor;
								pipeObj.lineColor = obj.lineColor;
								pipeObj.shape = {}; //管道形状：长度，直径
								pipeObj.position = {}; //管道起始位置
								let ax1 = parseFloat($(el).find('[id^="lineA"]').attr('x1'));
								let ay1 = parseFloat($(el).find('[id^="lineA"]').attr('y1'));
								let bx1 = parseFloat($(el).find('[id^="lineB"]').attr('x1'));
								let by1 = parseFloat($(el).find('[id^="lineB"]').attr('y1'));

								let ax2 = parseFloat($(el).find('[id^="lineA"]').attr('x2'));
								let ay2 = parseFloat($(el).find('[id^="lineA"]').attr('y2'));
								let bx2 = parseFloat($(el).find('[id^="lineB"]').attr('x2'));
								let by2 = parseFloat($(el).find('[id^="lineB"]').attr('y2'));
								$(el).find('[id^="lineA"]').attr({
									'stroke': pipeObj.lineColor
								});
								$(el).find('[id^="lineB"]').attr({
									'stroke': pipeObj.lineColor
								});
								if(obj.pipedirect == 'horizontal') { //横向
									pipeObj.shape.diameter = Math.abs(by1 - ay1);
									$(el).attr({
										'diameter': pipeObj.shape.diameter
									});
									pipeObj.shape.leng = (ax2 > bx2 ? ax2 : bx2) - (ax1 < bx1 ? ax1 : bx1);
									pipeObj.position.startx = parseFloat(ax1 > bx1 ? bx1 : ax1);
									pipeObj.position.starty = parseFloat(ay1);
									let str = ``;
									let i = 0;
									while(true) {
										let startx = pipeObj.position.startx + pipeObj.shape.diameter * i;
										if((startx + pipeObj.shape.diameter * 1.5) > (pipeObj.position.startx + pipeObj.shape.leng)) {
											console.log(i)
											break;
										}
										str += `<rect x="${startx}" y="${pipeObj.position.starty+5}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter-10}" fill="${pipeObj.fillColor}" stroke="#FFFF33"/>`;
										i++;
									}
									str += `<rect class='fixed' x="${pipeObj.position.startx+pipeObj.shape.leng-pipeObj.shape.diameter/2}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter}" fill="#000" stroke="#000"/>`;
									str += `<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter/2}" height="${pipeObj.shape.diameter}" fill="#000" stroke="#000"/>`;
									$(el).find('[id^="indicators"]').html(str);
								} else if(obj.pipedirect == 'longitudinal') { //纵向
									pipeObj.shape.diameter = Math.abs(bx1 - ax1);

									$(el).attr({
										'diameter': pipeObj.shape.diameter
									});
									pipeObj.shape.leng = (ay2 > by2 ? ay2 : by2) - (ay1 < by1 ? ay1 : by1);
									pipeObj.position.startx = ax1;
									pipeObj.position.starty = ay1 < by1 ? ay1 : by1;

									let str = ``;
									let i = 0;
									//console.log(pipeObj.position.starty,pipeObj.shape.diameter,pipeObj.position.starty+pipeObj.shape.leng)
									while(true) {
										let starty = pipeObj.position.starty + pipeObj.shape.diameter * i;
										if((starty + pipeObj.shape.diameter * 1.5) > (pipeObj.position.starty + pipeObj.shape.leng)) {
											console.log(i);
											break;
										}
										str += `<rect x="${pipeObj.position.startx+5}" y="${starty}" width="${pipeObj.shape.diameter-10}" height="${pipeObj.shape.diameter/2}" fill="${pipeObj.fillColor}" stroke="#FFFF33"/>`;
										i++;
									}
									str += `<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty+pipeObj.shape.leng-pipeObj.shape.diameter/2}" width="${pipeObj.shape.diameter}" height="${pipeObj.shape.diameter/2}" fill="#000" stroke="#000"/>`;
									str += `<rect class='fixed' x="${pipeObj.position.startx}" y="${pipeObj.position.starty}" width="${pipeObj.shape.diameter}" height="${pipeObj.shape.diameter/2}" fill="#000" stroke="#000"/>`;
									$(el).find('[id^="indicators"]').html(str);
								}
							} else if(obj.widget_type == 'opendoor') {
								for(let k in obj) {
									$(el).attr(obj);
								}
								$(el).attr({
									'ng-show': `interval1s&&newCurrentData.yaoxinObj["${obj.address}"].value!=0`
								})
							} else if(obj.widget_type == 'closedoor') {
								for(let k in obj) {
									$(el).attr(obj);
								}
								$(el).attr({
									'ng-hide': `newCurrentData.yaoxinObj["${obj.address}"].value!=0`
								})
							} else {
								for(let k in obj) {
									$(el).attr(obj);
									$(el).removeAttr("onclick");
								}
							}
						}

					}
				})

				let strData = document.getElementsByClassName('test2_svgTest')[0].innerHTML;
				var file = new File([strData], 'test.svg', {
					type: "text/plain;charset=utf-8"
				});
				saveAs(file);
			}

			$scope.showSwitchCtrl = function(address, e) {
				console.log(3324)
				console.log(arguments)
			}
			//data

		}
	]);
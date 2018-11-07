//----------------
//  PC main版本 V1.0.1
//  增加上传图片指令参数:noedit ： true(不可编辑)  不传或传false则可编辑
//  例： <img-upload imgfilearr='picList' table-name='Car1CarInfo' table-cloumn="行驶证图片" imgmax='3' noedit='true'></img-upload>
//----------------


'use strict';
var app = angular.module('app',['ui.load', 'ui.router', 'ngStorage', 'brantwills.paging', 'oc.lazyLoad', 
	'fullPage.js', 'ngFileUpload','toaster','ngWebSocket']);

/* Controllers */
angular.module('app')
	.controller('AppCtrl', ['$scope', '$localStorage', '$window', '$http', '$state', '$rootScope','yxRequest','yxLogin',
		function($scope, $localStorage, $window, $http, $state, $rootScope,yxRequest,yxLogin) {
			$rootScope.leftLock=true;
			// add 'ie' classes to html
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			isIE && angular.element($window.document.body).addClass('ie');
			isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
			// config
			$scope.app = {
				//name: 'xx派',
				//version: '0.0.2',
				// for chart colors
				color: {
					primary: '#7266ba',
					info: '#23b7e5',
					success: '#27c24c',
					warning: '#fad733',
					danger: '#f05050',
					light: '#e8eff0',
					dark: '#3a3f51',
					black: '#1c2b36'
				},
				settings: {
					themeID: 1,
					navbarHeaderColor: 'bg-white',
					navbarCollapseColor: 'bg-white',
					asideColor: 'bg-black',
					headerFixed: true,
					asideFixed: true,
					asideFolded: false,
					asideDock: false,
					container: false
				}
			}
			$scope.defaultAvatar = $rootScope.defaultAvatar = 'res/img/np.png';

			$scope.logout = function() {
				var token = sessionStorage.getItem("token");
				return $http({
					method: 'POST',
					url: (qson ? testIp+'/logout' : '/logout'),
					params: { 'token': token },
				}).then(function(result) {
					

					var d = result.data;
					if(d.httpCode == 200) { //注销成功
						deleteUserInfo();
						$state.go('access.login');
						sessionStorage.removeItem('token');
					}else if(d.httpCode == 202 || d.httpCode == 401 || d.httpCode == 403){
						$scope.msg = result.msg;
						$state.go('access.login');
					}
				});

				function deleteUserInfo() {
					$.cookie('_ihome_uid', null);
				}
			}

			$localStorage.settings = $scope.app.settings;

			// save settings to local storage  暂不支持自定义布局
			/*if (angular.isDefined($localStorage.settings)) {
			    $scope.app.settings = $localStorage.settings;
			} else {
			    $localStorage.settings = $scope.app.settings;
			}*/
			$scope.$watch('app.settings', function() {
				if($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
					// aside dock and fixed must set the header fixed.
					$scope.app.settings.headerFixed = true;
				}
				// save to local storage
				$localStorage.settings = $scope.app.settings;
			}, true);

			// angular translate
			//$scope.lang = { isopen: false };
			//$scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
			function isSmartDevice($window) {
				// Adapted from http://www.detectmobilebrowsers.com
				var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
				// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
				return(/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
			}

			$.ajaxSetup({
				type: "POST",
				dataType:"json",
				beforeSend: function(evt, request, settings) {
					//request.url = 'iBase4J-Web' + request.url;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					switch(jqXHR.status) {
						case(404):
							//alert("未找到请求的资源");
							break;
					}
				}
			});
			$(document).ajaxSuccess(function(event, xhr, settings) {
				if(settings.dataType=='json'){
					if(xhr.responseJSON.httpCode == 401 || xhr.responseJSON.httpCode == 202 || xhr.responseJSON.httpCode == 403) {
						$state.go('access.login');
						return null;
					} else if(xhr.responseJSON.httpCode == 303) {} else if(xhr.responseJSON.httpCode != 200) {
						// alert(xhr.responseJSON.msg);
					}
					return event;
				}
				
			});
			
//			//公共方法--id转name
//			$rootScope.idName=function(id){
//				var un=$rootScope.empList.empList.filter(function(emp){
//						return emp.id==id;
//					})[0];
//				if(un){
//					return un.name;
//				}
//			};
//			//应发求和
//			$rootScope.getsP=function(sp,arr){
//				angular.forEach(arr,function(d){
//					sp=(sp*1000+d.sal8WagePay*1000)/1000;
//				})
//				return sp;
//			}
//			//定义审批记录处理方法
//			$rootScope.approveLogManage=function(arr,times){
//				for(var i=0;i<arr.length;i++){
//					arr[i].userName=
//						$rootScope.empList.empList.filter(function(emp){
//							return emp.userInfoId==arr[i].userInfoId;
//						})[0].name;
//				};
//				for(var j=0;arr.length>0;j++){
//					times[j]=[];
//					while(arr.length>0){
//						if(arr[arr.length-1].myorder==-1){
//							times[j].unshift(arr.pop());
//							break;
//						}else{
//							times[j].unshift(arr.pop());
//						}
//					};
//					times[j].sort($scope.s);
//				};
//			}
//			//对列表中size小于row填充的方法
//			$rootScope.padding=function(arr,n){
//				if(arr.length!=0){
//					for(;;){
//						if(arr.length<n){
//							arr.push({});
//						}else{
//							break;	
//						} 
//					}
//				}
//			};
			Date.prototype.format = function(fmt) { 
			     var o = { 
			        "M+" : this.getMonth()+1,                 //月份 
			        "d+" : this.getDate(),                    //日 
			        "h+" : this.getHours(),                   //小时 
			        "m+" : this.getMinutes(),                 //分 
			        "s+" : this.getSeconds(),                 //秒 
			        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
			        "S"  : this.getMilliseconds()             //毫秒 
			    }; 
			    if(/(y+)/.test(fmt)) {
			            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			    }
			     for(var k in o) {
			        if(new RegExp("("+ k +")").test(fmt)){
			             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			         }
			     }
			    return fmt; 
			}
		}
	]);

// 下面是qson 自定义

angular.module('app')

	.directive("fileread", ['$rootScope', function($rootScope) {
		return {
			scope: {
				fileread: "=",
				//              filenameread: "="
			},
			link: function(scope, element, attributes) {
				scope.fileread = {
					data: '',
					uploading: false,
					img_path_save: [],
					img_path: [],
				}
				element.bind("change", function(changeEvent) {
					var reader = new FileReader();
					if(!changeEvent.target.files[0]) {
						return
					};
					scope.picFileName = changeEvent.currentTarget.value;
					reader.onload = function(loadEvent) {

						scope.fileread.uploading = true;
						scope.$apply();
						//						            var img=document.createElement("img")
						//						            img.src = loadEvent.target.result;
						//document.body.appendChild(img);
						var img = new Image();
						img.src = loadEvent.target.result;
						img.onload = function() {
							//alert(img.height)

							var maxWidth = 800, //图片resize宽度
								maxHeight = 800, //图片resize高度
								quality = 0.9, //图像质量
								canvas = document.createElement("canvas"),
								drawer = canvas.getContext("2d");

							if(img.height > maxHeight || img.width > maxWidth) {
								if(img.width / img.height > (maxWidth / maxHeight)) {
									
									if(global_level>8){
										console.log("宽 过长")
									}
									
									canvas.width = maxWidth;
									canvas.height = maxWidth * img.height / img.width;
								} else {
								
									if(global_level>8){
										console.log("高过长")
									}
									
									canvas.width = maxHeight * img.width / img.height;
									canvas.height = maxHeight;
								}

							} else {
								
								if(global_level>8){
									console.log("没超出")
								}
								canvas.width = img.width;
								canvas.height = img.height;

							}
							drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
							//					                canvas.style.display='none';
							//document.body.appendChild(canvas)
							
							
							if(global_level>8){
								console.log(img)
							}
							scope.fileread.data = canvas.toDataURL("image/jpg", quality);
						
							if(global_level>8){
								console.log(scope.fileread.data);
							}
							//alert('上传中');
							//tipsbar.show('上传中');
							$.ajax({
								//本地测试数据
								//服务器数据
								type: 'POST',
								//  								url: apiUrlUC + attributes.action,
								//								headers: { "Content-Type": "multipart/form-data" },
								url: qson ? 'http://192.168.0.102:8090/common/image' : '/common/image',
								//  								data: {
								//  									'mact': 'upload_img',
								//  									'file': scope.fileread.data,
								//  								}
								data: $rootScope.setParams({ 'uploadFile': scope.fileread.data, 'uploadFileName': scope.picFileName })
							}).then(function(result) {	
							
								if(global_level>8){
									console.log(result)
								}
								if(result.httpCode == '200') {
									//alert('上传完毕');
									scope.fileread.img_path.push(scope.fileread.data);
									scope.fileread.img_path_save.push(result.imgName);
									scope.fileread.uploading = false;
									//	
								
									if(global_level>8){
										console.log(scope.fileread)
									}
									scope.$apply();
									if(global_level>8){
										console.log(scope.fileread);
										console.log('上传成功');
									}
//									
								} else {
									scope.fileread.uploading = false;
									//									alert(result.errormsg);
									//    									alert('网络异常');
								}
							})
						}
					}
					//scope.filenameread = changeEvent.target.files[0].name;
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		}
	}])

	.directive("dateread", [function() {
		return {
			scope: {
				dateread: "="
			},
			link: function(scope, element, attributes) {
				element.bind("blur", function(changeEvent) {
					// scope.dateread
					scope.$apply(function() {
						scope.dateread = changeEvent.target.value;

					})
				});
			}
		}
	}])
	.directive('modal', function() {
		return {
			template: '<div class="modal xxp-modal fade ">' +
				'<div class="modal-dialog">' +
				'<div class="modal-content">' +
				'<div class="modal-header">' +
				'<a class="xxpicon icon-cross pull-right" title="关闭" data-dismiss="modal" aria-hidden="true"> </a>' +
				'<h4 class="modal-title">{{ title }}</h4>' +
				'</div>' +
				'<div class="modal-body" ng-transclude></div>' +
				'</div>' +
				'</div>' +
				'</div>',
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: true,
			link: function postLink(scope, element, attrs) {
				scope.title = attrs.titlelabel;
				scope.mClass = attrs.mClass;

				scope.$watch(attrs.visible, function(value) {

					if(value == true)
						$(element).modal('show');
					else
						$(element).modal('hide');
				});

				scope.$watch(attrs.width, function(value) {
					if(global_level>8){
						console.log(value);			
					}
					if(value)
						$(element).find(".modal-dialog").css('width', value);
				});

				$(element).on('shown.bs.modal', function() {
					scope.$apply(function() {
						scope.$parent[attrs.visible] = true;
					});
				});

				$(element).on('hidden.bs.modal', function() {
					scope.$apply(function() {
						scope.$parent[attrs.visible] = false;
					});
				});
			}
		};
	})
	.directive('ngRightClick', function($parse) {
	    return function(scope, element, attrs) {
	        var fn = $parse(attrs.ngRightClick);
	        element.bind('contextmenu', function(event) {
	            scope.$apply(function() {
	                event.preventDefault();
	                fn(scope, {$event:event});
	            });
	        });
	    };
	})
	.directive('ngMouseWheel', function($parse) {
	    return function(scope, element, attrs) {
	        var fn = $parse(attrs.ngMouseWheel);
	        element.bind('mousewheel', function(event) {
	            scope.$apply(function() {
	                //event.preventDefault();
	                fn(scope, {$event:event});
	            });
	        });
	    };
	});

// config
window.APP = { version : 'v=20160509' };

angular.module('app')
  .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
	    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
	        // lazy controller, directive and service
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;
	        app.constant   = $provide.constant;
	        app.value      = $provide.value;
	    }
	])
	.config(function(){
        jQuery.validator.setDefaults({
            errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
            errorElement: 'div',
            errorPlacement: function(error, e) {
                var eleErrContains = e.parents('.tdgroup');
                if(eleErrContains.length == 0){
                    eleErrContains = e.parents('.form-group > div');
                }
                eleErrContains.append(error);
            },
            highlight: function(e) {
                $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                $(e).closest('.help-block').remove();
            },
            success: function(e) {
                e.closest('.form-group').removeClass('has-success has-error');
                e.closest('.help-block').remove();
            }
        });
        $.extend({'cookie':function(name, value, options) {
                if(cookieIsEnable){
                    if (typeof value != 'undefined') { // name and value given, set cookie
                        options = options || {};
                        if (value === null) {
                            value = '';
                            options.expires = -1;
                        }
                        var expires = '';
                        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                            var date;
                            if (typeof options.expires == 'number') {
                                date = new Date();
                                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                            } else {
                                date = options.expires;
                            }
                            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                        }
                        var path = options.path ? '; path=' + options.path : '';
                        var domain = options.domain ? '; domain=' + options.domain : '';
                        var secure = options.secure ? '; secure' : '';
                        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
                    } else { // only name given, get cookie
                        var cookieValue = null;
                        if (document.cookie && document.cookie != '') {
                            var cookies = document.cookie.split(';');
                            for (var i = 0; i < cookies.length; i++) {
                                var cookie = jQuery.trim(cookies[i]);
                                // Does this cookie string begin with the name we want?
                                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    }
                }else{
                    alert('cookie 禁用');
                }
                function cookieIsEnable(){
                    return window.navigator.cookieEnabled;
                }
            }
        });
    })
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:false,
          events: true,
          modules: [{
              name: 'toaster',
              files: [
                  'lib/angular/toaster.js',
                  'lib/angular/toaster.css'
              ]
          }]
      });
    }])
    .filter('label', function() { // 显示为标签
		  return function(input, s) {
			  var l = input.split(s);
			  var r = '';
			  for(var i=0; i<l.length; i++) {
				  r += '<label class="label label-info">' + l[i] + '</label>\n';
			  }
			  return r;
		  }
    })
    .filter('helpCenterFilename', function() {  
       return function(input) {  
       	
       	if(global_level>8){
		 	console.log("------------------------------------------------- begin dump of custom parameters");  
          	console.log("input=",input);
          	console.log("------------------------------------------------- end dump of custom parameters");  						
		}
         
          var temp1=input.match(/\.(.+)\./);
          if(temp1){
            return temp1[1];
          }else{
            return "资料";
          }
       };  
     })
    .filter('trustHtml', function ($sce) { // 安全HTML
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })
		.filter('strFilter0', function() { // 字符过滤器“豪华型_A级”
			return function(e) {
				if(e){
					return (e.split("_"))[0]
				}
			}
		})
		.filter('strFilter2', function() { // 字符过滤器“豪华型_A级”
			return function(e) {
				if(e){
					return (e.split("_"))[1]
				}
			}
		})
		.filter('dateFilter', function() { // 过滤日期格式yyyy-MM-dd
			return function(e) {
				if(e){
					return(e = e.substr(0,4)+"-"+e.substr(4,2)+"-"+e.substr(6,2))
				}
			}
		})
		.filter('timeFilter', function() { // 过滤日期格式hh:mm:ss
			return function(e) {
				if(e){
					return(e = e.substr(0,2)+":"+e.substr(2,2)+":"+e.substr(4,2))
				}
			}
		})
		.filter('replaceBR', function($sce) { // 替换换行
			return function(input,type) {
				if(input){
					
					if(global_level>8){
						console.log(type)				
					}
					
					if(type=="br"){
						if(global_level>8){
							console.log(2)			
						}
						return($sce.trustAsHtml(input.replace(/_8_/g,"</br>")))
					}else{
						if(global_level>8){
							console.log(1)		
						}
						return(input.replace(/_8_/g,' '))
					}
				}
			}
		})
		.filter('sitetitle', function($sce) { // 显示地名
		  return function(input) {
		  	var tipstxt='';
		  	if(!input){return tipstxt}
		  	if(input.indexOf('_7_')==-1){return tipstxt}
		    if(input.split('_7_')[0]!=''){
		    		return input.split('_7_')[0];
		    }else if(input.split('_7_')[1]){
		    		return input.split('_7_')[1];
		    }else{
			    	return tipstxt;
		    }
		  }
		})
		.filter('siteaddress', function($sce) { // 显示地址
			
		  return function(input) {
		  	if(!input){return};
		    if(input.split('_7_')[1]){
		    		return (input.split('_7_')[1]+' '+input.split('_7_')[0]);
		    }else{
			    	return input.split('_7_')[0]; 	
		    }
		  }
		})
		.filter('mynumber', function() { // 过滤日期格式yyyy-MM-dd
			
			return function(e,param) {
				//console.log(param)//3,2
				if(e){
					let zhengshu=Number(e.toString().split('.')[0]);
					let xiaoshu=e.toString().split('.')[1]||0;
					if(zhengshu.toString().length>param.split(',')[0]){
						return e='位数超长'
					}
					zhengshu=(Array(Number(param.split(',')[0])).join('0') + zhengshu).slice(-param.split(',')[0]);
					if(!param.split(',')[1]||param.split(',')[1]=='0'){
						return e=zhengshu
					}else{
						xiaoshu=(xiaoshu+Array(Number(param.split(',')[1])).join('0')).slice(0,Number(param.split(',')[1])+1);
						return(e = zhengshu+'.'+xiaoshu)
					}
					
					
				}
			}
		})
		
    .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }
         
          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
}])
.directive('treeView',[function(){
     return {
          restrict: 'E',
          templateUrl: '/treeView.html',
          scope: {
          	  organizationData:'=',
              canChecked: '=',
              textField: '@',
              itemClicked: '&',
              itemCheckedChanged: '&',
              itemTemplateUrl: '@'
          },
          link: function(scope, element, attributes) {

          },
         controller:['$scope', function($scope){
         	$scope.$watch('organizationData',function(newVal,oldVal){
         		if(newVal){
         			$scope.setTreeCount(newVal.deptList,newVal.empList);
         			$scope.setTreeData(newVal.deptList,0);
         		}
         	})
         	
         	
			//设置每个部门的人数
			$scope.setTreeCount = function(deptList,empDeptList){
				if(!deptList){return}
				for(var i=0;i<deptList.length;i++){
					deptList[i].num = [];
					var json = {};
					for(var s=0;s<empDeptList.length;s++){
						if(empDeptList[s].deptCode.indexOf(deptList[i].deptCode) == 0){
							if(empDeptList[s].deptCode[deptList[i].deptCode.length]==undefined||empDeptList[s].deptCode[deptList[i].deptCode.length]=='_'){
								if(!json[empDeptList[s].id]){
									deptList[i].num.push(empDeptList[s]);
									json[empDeptList[s].id] = '0';
								}	
							}
						}
					}
				}
			}
			//设置树形结构
 	
		    $scope.setTreeData = function (data, parentId) {
		        var tree = [];
		        var temp;
		        if(!data){return};
		        for (var i = 0; i < data.length; i++) {
		            if (data[i].parentId == parentId) {
		                var obj = data[i];
		                temp = $scope.setTreeData(data, data[i].id);
		                if (temp.length > 0) {
		                 obj.children = temp;
		                }
		                tree.push(obj);
		            }
		        }
		        $scope.treeData = tree;
		        if(global_level>8){
					console.log($scope.treeData);				
				}
		        return $scope.treeData;
		    }
         	
         	
         	
         	
             $scope.itemExpended = function(item, $event){
                 item.$$isExpend = ! item.$$isExpend;
                 $event.stopPropagation();
             };
             $scope.getItemIcon = function(item){
                 var isLeaf = $scope.isLeaf(item);
                 if(isLeaf){
                     return 'fa kong';
                 }
                 return item.$$isExpend ? 'glyphicon glyphicon-triangle-bottom': 'glyphicon glyphicon-triangle-right';  
             };
             $scope.isLeaf = function(item){
                return !item.children || !item.children.length;
             };
 
             $scope.warpCallback = function(callback, item, $event){
                  ($scope[callback] || angular.noop)({
                     $item:item,
                     $event:$event
                 });
             };
         }]
     };
 }])
.directive("imgUpload", [function(toaster) {
	return {
		restrict: 'AE',

		scope: {
			imgfilearr: "=", //图片对象 必填
			//              imgdataarr: "=", //图片数据 数组 必填
			tableName: '@', //业务类型 必填 
			tableCloumn: '@', //图片类型 必填
			imgmax: '@', //最大图片数量  非必填
			noedit:"@",
		},
		template: '<div class="clearfix">' +
			'    	<div class="upload-imgs" ng-click="showPreview($index)" ng-repeat="item in imgfilearr track by $index" ng-if="item.tableCloumn==tableCloumn">' +
			'    		 <span style="background-image: url({{item.path}});"><b ng-hide="noedit" ng-click="removePic($index)" class="glyphicon glyphicon-remove"></b></span>' +
			'    	</div>' +
			'    	<div class="upload-loading" ng-show="fileread.uploading">' +
			'    		 <b class="fa fa-spin fa-spinner"></b>' +
			'    	</div>' +
			'    <div class="upload-add" ng-hide="fileread.uploading || imgmax<=(imgfilearr|filter:{\'tableCloumn\':tableCloumn}).length || noedit">' +
			'        <label class="uploadPic" data-tap-disabled="true"><div ng-bind-html="imgtxt"></div><input type="file" style="display: none;"/></label>' +
			'    </div>' +
			'</div>'+
			'<div ng-click="closePreview()" ng-show="previewImg" class="preview-mask">'+
				'<div>'+
					'<img class="preview-img" ng-src="{{imgfilearr[index].path}}" alt="err" />'+				
				'</div>'+
			'</div>',

		link: function(scope, element, attributes,sce) {
			//初始化数据
			if(!attributes.imgmax) {
				scope.imgmax = 1000
			} else {
				scope.imgmax = attributes.imgmax
			}
			if(!attributes.tableName) {
				scope.tableName = '业务类型'
			} else {
				scope.tableName = attributes.tableName
			}
			if(global_level>8){
				console.log(attributes.tableCloumn)						
			}
			if(!attributes.tableCloumn) {
				scope.tableCloumn = '图片类型'
			} else {
				scope.tableCloumn = attributes.tableCloumn
			}
			if(global_level>8){
				console.log(scope.imgmax)						
			}
			if(!scope.imgfilearr) {
				scope.imgfilearr = [];
			}
			scope.showPreview=function(index){
				scope.index=index;
				if(global_level>8){
					console.log(scope.index);					
									}
				
				scope.previewImg=true;
			}
			scope.closePreview=function(){
				scope.previewImg=false;
			}
			scope.fileread = {
					uploadFile: '', //数据
					uploading: false,
					uploadFileName: '', // 文件名
				}
				//删除图片方法
			scope.removePic = function(index) {
				scope.imgfilearr.splice(index, 1);
				//scope.imgdataarr.splice(index,1);
			}
			function init(){
				element.find('input').remove();
				if(global_level>8){
						console.log(element.find('input'));				
								}
				var inputTpl = '<input type="file" style="display: none;" capture="camera"/ >';
				element.find('.uploadPic').append(inputTpl);	

		element.find('input').bind("change", function(changeEvent) {
				var reader = new FileReader();
				if(!changeEvent.target.files[0]) {
					return
				};
				reader.onload = function(loadEvent) {
					var filetypes =[".jpg",".png",".jpeg",".gif"];
					var isnext = false;
					var filename1=scope.fileread.uploadFileName.toLowerCase();
			        var fileend = filename1.substring(filename1.lastIndexOf("."));
			        for(var i =0; i<filetypes.length;i++){
				        if(filetypes[i]==fileend){
				            isnext = true;
				            break;
				        }
			        }
			    if(!isnext){alert('上传文件格式错误');return};
					scope.fileread.uploading = true;
					scope.$apply();
					var img = new Image();
					img.src = loadEvent.target.result;
					img.onload = function() {
						var maxWidth = 1200, //图片resize宽度
							maxHeight = 1200, //图片resize高度
							quality = 0.5, //图像质量
							canvas = document.createElement("canvas"),
							drawer = canvas.getContext("2d");
						if(img.height > maxHeight || img.width > maxWidth) {
							if(img.width / img.height > (maxWidth / maxHeight)) {
								if(global_level>5){
										console.log("宽 过长")
									}
								
								canvas.width = maxWidth;
								canvas.height = maxWidth * img.height / img.width;
							} else {
								if(global_level>5){
										console.log("高 过长")
									}
								
								canvas.width = maxHeight * img.width / img.height;
								canvas.height = maxHeight;
							}

						} else {
							if(global_level>8){
										console.log("没超出")
									}
							
							canvas.width = img.width;
							canvas.height = img.height;

						}
						drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
						//					                canvas.style.display='none';
						//document.body.appendChild(canvas)
						if(global_level>8){
									console.log(img)	
								}
						scope.fileread.uploadFile = canvas.toDataURL("image/jpeg", quality);
						if(global_level>8){
										console.log(scope.fileread.data);
								}
						scope.fileread.tableName = scope.tableName;
						scope.fileread.tableCloumn = scope.tableCloumn;
						if(global_level>5){
								console.log('上传中', scope.fileread.uploadFile);		
									}
						
						//										scope.imgdataarr.push(scope.fileread.uploadFile);
						//						                return;

						//获取token
					    scope.getAccess = function() {
					        var access = $.cookie('access');
					        
					        //检测没有access数据
					        if(!access) {
					            return undefined;
					        }
					        //string转换对象
					        access = JSON.parse(access);
					        //返回对应access字段
					        return access;
					    }
						//上传图片操作
							$.ajax({
								//本地测试数据
								//服务器数据
								type: 'POST',
								headers:{
									'access_token': scope.getAccess('access_token'),
	                				'channel': 'BROWSER',
	                				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},            
								url:yxIp.FWip+'/common/image',
								data: scope.fileread
							}).then(function(result) {
								if(global_level>8){
										console.log(result)
								}
								if(result.httpCode == '200') {
									if(global_level>5){
										console.log('上传成功', result);
										console.log(scope.imgfilearr);
									}
										
										scope.imgfilearr.push(result.attach);
										if(global_level>5){
										console.log(scope.imgfilearr);
									}
										
								} else {
									alert(result.msg)
								}
								
									scope.fileread = {
										token:sessionStorage.getItem("token")||'',
										client:'admin',
										uploadFile: '', //数据
										uploading: false,
										uploadFileName: '', // 文件名
									}
									init();
									scope.$apply();
							})
						//上传图片操作完毕
					}
				}
				scope.fileread.uploadFileName = changeEvent.target.files[0].name;
				if(global_level>5){
						console.log('文件名：', scope.fileread.uploadFileName)				
									}
				
				
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
			}
			init();
	
		},
		controller:['$scope','$sce','$attrs',function($scope,$sce,$attrs ){
			$attrs.imgcode == undefined ? $scope.imgtxt = $sce.trustAsHtml("上传</br>图片") : ($attrs.imgcode == '1' ? $scope.imgtxt = $sce.trustAsHtml("正面</br>正页") : ($attrs.imgcode == '2' ? $scope.imgtxt = $sce.trustAsHtml("背面</br>正页") : $scope.imgtxt = $sce.trustAsHtml("背面</br>背页")));
		}],
	}
}])
.directive("approval", ['$rootScope','$filter',function ($rootScope,$filter) {
	return {
		restrict: 'AE',
		scope:{
			approvalData:"=",
			selArr:"=",
			isselDep:"@",
			selEmp:"@",
		},
		transclude: true, 
		template: 
			'<div ng-transclude></div>'+
				'<h5  ng-repeat="item in deptList " ng-show="item.parentId == 0">{{item.deptName}}</h5>'+
				//'<h5 ng-show="activeItem.deptName">{{activeItem.deptName}}</h5>'+
				'<div class="crumbs">'+
					'<span ng-repeat="item in deptList " ng-show="!activeItem.deptName&&item.parentId == 0">{{item.deptName}} </span>'+
					'<span ng-repeat="item5 in crumbname" ng-click="item5.id == activeItem.id?'+"' '"+':back(item5,$index)"><span ng-hide="$index == 0">	></span> {{item5.deptName}} </span>'+
				'</div>'+
				'<div class="organizationData">'+
					'<ul class="dep" >'+
						'<li ng-repeat="item in dataArr "  ng-if="item.parentId == activeItem.id&&!item.name">'+
							'<span class="clickSpan" ng-click="click(item)">{{item.deptName}}</span>'+
							'<input type="checkbox" ng-model="item.checked" ng-change="checkChange(item)" ng-show="isDep" />'+
						'</li>'+
					'</ul>'+
					'<ul class="emp">'+
						'<li ng-repeat="item1 in dataArr "  ng-if="item1.deptCode == activeItem.deptCode&&item1.name">'+
							'<span class="clickSpan">'+
								'<span class="glyphicon glyphicon-user"></span>'+
								'<dl><dt>{{item1.name}}</dt><dd>{{item1.jobName}}</dd></dl>	'+								
							'</span>'+
							'<input type="checkbox" ng-model="item1.checked" ng-change="checkChange(item1)" ng-hide="!selEmp || (dataArr |filter: fstate| filter : {'+"'checked':'true'"+'}).length == selEmp" />'+
							'<input type="checkbox" ng-model="item1.checked" ng-change="checkChange(item1)" ng-show="!selEmp"'+
						'</li>'+
					'</ul>'+
				'</div>'
		,
		link:function(scope,element,attr){
			scope.isDep = attr.isselDep=='true'?true:false;
		},
		controller: ['$scope', '$attrs','$rootScope','$element',function ($scope, $attrs,$rootScope,$element){
			
         	$scope.$watch('approvalData',function(newVal,oldVal){
     			if(newVal&&$scope.selArr){
					$scope.deptList = $scope.approvalData.deptList;
					$scope.dataArr = $scope.approvalData.deptList.concat($scope.approvalData.empList.data);
					$scope.selArr = $scope.dataArr
					$scope.init();

     			}
         	})
         	$scope.$watch('selArr',function(newVal,oldVal){
     			if($scope.selArr.length>0&&$scope.approvalData){
					$scope.deptList = $scope.approvalData.deptList;
					$scope.dataArr = $scope.approvalData.deptList.concat($scope.approvalData.empList.data);
					$scope.dataArr = $scope.selArr;
					$scope.init();
     			}
         	})

			
			$scope.init = function(){
				$scope.crumbname = [];
				$scope.activeItem = { id: 0 };
				$scope.click = function(item){
					$scope.activeItem = item;
					$scope.crumbname.push(item);
				}
				$scope.back = function (arr, index) {
					$scope.crumbname.splice(index + 1, ($scope.crumbname.length - index));
					$scope.activeItem = arr;
				}
				$scope.checkChange = function(obj){
					obj.time = Date.parse(new Date());
					$scope.selArr = $scope.dataArr;
					if(global_level>8){
						console.log(obj);				
									}
					
				}
				$scope.fstate = function(e) {
					if(!e){return};
					if(e.name){
						return true;
					}else{
						return false;
					}
		        }
			}
			$scope.init();
		}],
	}
}])
.directive("checkboxswitch",['$rootScope',function($rootScope){
	return{
		restrict: 'E',
		scope:{
			isChecked:'='
		},
		template: 
			'<span ng-class="{'+"'checkbox-true':isChecked,'checkbox-false':!isChecked}"+'">'+
	    		'<label>'+
	    			'<input type="checkbox" ng-model="isChecked" ng-change="isDisplayChange(isChecked)"/>'+
	    			'<span>{{isChecked?"是":"否"}}</span>'+
	    		'</label>'+
	    	'</span>'
		
	}
}])
//service yxLogin
//功能一：登录请求处理 yxLogin.login(username,credentialType,credentialValue,loginSCB,loginECB)
//功能二：保存access到cookie
//功能三：从cookie读取access属性 yxLogin.getAccess(name)
//功能四：注销登录 yxLogin.logout()
 
angular.module('app').service('yxLogin', ['$http','$rootScope','$timeout','$interval','toaster',function($http,$rootScope,$timeout,$interval,toaster) {
    //设置登录接口地址
    //this.loginUri = yxWebSetting.IAMloginURI;
    //设置登录页地址
    //this.loginUrl = yxWebSetting.FWloginURL;
    
    //方法 - 登录
    //参数 username（string） 用户名 必填
    //参数 credentialType（string） 令牌类型 必填
    //参数 credentialValue（string） 令牌值 必填
    //参数 loginSCB（function） 登录成功回调 非必填
    //参数 loginECB（function） 登录失败回调 非必填
    
    this.login=function(username,password,loginSCB,loginECB){
    	var that=this;
    	//that.saveAccess('token');
        //请求的数据body
        var formdata = {
    		"username":username, 
    		"password":password
    	}
        //封装请求的config
        var configdata={
            'method':'post',
            'url':yxIp.loginAddress+"login",
            'data':formdata,
            'headers': {
                'channel':'BROWSER',
                'Content-Type':'application/json; charset=UTF-8'
            }
        };
        $http(configdata).success(function(data, status, headers, config) {
        	if(global_level>5){console.log('响应成功:',data);}
            if(data.status==200){
	            //调用保存access
	            that.saveAccess(data.token,configdata.data.username);
	            //调用登录成功回调
	            //that.getUserDetail();
	            $rootScope.userInfo={
	            	user:username
	            }
	            //获取文件夹列表
				
	            //console.log($rootScope.userInfo)
	            if(typeof loginSCB == 'function') {
	                loginSCB(data, status, headers, config);
	            }
            }else{
            	if(typeof loginECB == 'function') {
	                loginECB(data,status,headers,config);
	            }
            }
        }).error(function(data, status, headers, config) {
        	if(global_level>1){
					console.log('login失败',config);					
									}
            
            //调用登录失败回调
            toaster.pop('error','',yxWebSetting.niceTip)
        });            
    }
    //获取登录人信息、获取企业
    this.getUserDetail=function(){
    	var that=this;
        var configdata = {
            'method': 'POST',
            'url': yxIp.FWuserIp+'/userinfo/detail',
            'headers': {
                'access_token': that.getAccess('access_token'),
                'channel': 'BROWSER',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
        var that = this;
        if(global_level>5){
			console.log('yxRequest.send请求',configdata);							
									}
//      
        //发送http请求
        $http(configdata).success(function(data, status, headers, config) {
        	//↓↓↓↓↓判断cookie中有无returnUrl，如果有即是业务中请求异常调到登录页，稍后直接调回业务页面
        	var returnUrl = $.cookie('returnUrl')|| '';
        	if(returnUrl != '' && JSON.parse($.cookie('userInfo'))){
   		     	var userInfo = JSON.parse($.cookie('userInfo'));
        		if (userInfo.userID == data.userInfo.id){
        			if(data.operatorID&&userInfo.companyID==data.operatorID){
        				
        				$.cookie('returnUrl', null,{path:'/',domain:yxWebSetting.cookieDomain});
        				window.location.href = window.decodeURIComponent(returnUrl);
        				return;
        			}
					angular.forEach(data.employeeList,function(empData,index,array){
						if(userInfo.companyID == empData.companyInfoId){
	        				$.cookie('returnUrl', null,{path:'/',domain:yxWebSetting.cookieDomain});
	        				window.location.href = window.decodeURIComponent(returnUrl);
	        				return;
						}
					});
        		}
        	}
        	//↑↑↑↑是判断cookie中有无returnUrl，如果有即是业务中请求异常调到登录页，稍后直接调回业务页面
        	
            //调用成功callback
            $rootScope.selCompanyArr = [];
			angular.forEach(data.employeeList,function(empData,index,array){
				$rootScope.selCompanyArr.push({'empID':empData.id,'companyID':empData.companyInfoId,'companyName':empData.companyName,'userID':data.userInfo.id,'userName':data.userInfo.name,'operateCompanyInfoId':empData.operateCompanyInfoId,mobile:data.userInfo.mobile})
			});
			if(data.operatorID){
				$rootScope.selCompanyArr.push({'empID':data.operatorID,'companyID':'-1','companyName':'平台管理员','userID':data.userInfo.id,'userName':data.userInfo.name,mobile:data.userInfo.mobile})
			}
			$('.selectModal').modal('show');
			$rootScope.selectCompany = function(item){
				$.cookie('userInfo', JSON.stringify(item),{path:'/',domain:yxWebSetting.cookieDomain});
				//调到框架首页
				$('.selectModal').modal('hide');
				$timeout(function(){
					//显示等待
					$rootScope.yx_view_loading = true;
					
					if(typeof($rootScope.YXgetRoleInfoData)!= 'undefined'){
						$rootScope.YXgetRoleInfoData();
					}else{
						window.location.href = yxIp.FWipUI + yxIp.FWinitUI;
					}
					
					
				},300)
			}
       }).error(function(data, status, headers, config) {
            alert(yxWebSetting.niceTip);
        });
   }
    
    //方法 - 注销
    this.logout=function(logoutSuccFun,logoutErrFun){
    	var configdata={
            'method':'get',
            'url':yxIp.loginAddress+"logout",
            'data':{},
            'headers': {
                'channel':'BROWSER',
                'Content-Type':'application/json; charset=UTF-8'
            }
        };
  		$http(configdata).success(function(data, status, headers, config) {
  			if(global_level>5){console.log('响应成功:',data);}
            
            if(data.status==200){
	             //清空cookie 里面的access
		        //$.cookie('access', null,{path:'/',domain:yxWebSetting.cookieDomain});
		        $.cookie('access', null);
		        //$.cookie('accessCreateTime', null,{path:'/',domain:yxWebSetting.cookieDomain});
		        $.cookie('accessCreateTime', null);
		        $rootScope.hasUserInfo=false;
		        $rootScope.userInfo=undefined;
		        if(typeof logoutSuccFun =='function'){
		        	logoutSuccFun(data,config);
		        }
            }else{
            	if(typeof logoutErrFun == 'function') {
	                logoutErrFun(data,status,headers,config);
	            }
            }
        }).error(function(data, status, headers, config) {
        	if(global_level>1){console.log('logout ajax失败',config);}
            //调用登录失败回调
            toaster.pop('error','',yxWebSetting.niceTip)
        }); 
    };
    //方法- 获取access的属性  如（access_token,reFresh_token,scope）
    //参数 name（string） access属性名 必填
    this.getAccess = function(name) {
        var access = $.cookie('access');
        //检测没有access数据
        if(!access) {
            return undefined;
        }
        //string转换对象
        access = JSON.parse(access);
        //返回对应access字段
        return access[name];
    }
    //方法- 获取userInfo
    //参数 name（string） access属性名 必填
    this.getUserInfo = function() {
        var userInfo = $.cookie('userInfo');
        //检测没有access数据
        if(!userInfo) {
            return undefined;
        }
        //string转换对象
        userInfo = JSON.parse(userInfo);
        //返回对应access字段
        return userInfo;
    }
    //方法- 保存access数据 用户登录数据
    //参数 obj（obj） access对象 必填
    this.saveAccess = function(obj,uname) {
    	if(global_level>5){
			console.log('保存access数据', obj);							
									}
		
        //$.cookie('access', JSON.stringify(obj),{path:'/',domain:yxWebSetting.cookieDomain});
        $.cookie('access', JSON.stringify(obj));
        //$.cookie('accessCreateTime', (new Date()).getTime(),{path:'/',domain:yxWebSetting.cookieDomain});
        $.cookie('accessCreateTime', (new Date()).getTime());
        $.cookie('username',uname)
    }
    
    
    
}]);


//service yxRequest
//功能一：封装通用http请求
//功能二：刷新token
//功能三：token失效，刷新token，重发请求机制
//调用方式：   yxRequest.send(请求类型,请求url,请求体,成功回调,失败回调,权限);
 
angular.module('app').service('yxRequest', ['$timeout','$http','yxLogin','$interval','toaster','$rootScope', function($timeout,$http,yxLogin,$interval,toaster,$rootScope) {
    //设置刷新token接口地址
    //this.reFreshTokenUri = yxWebSetting.IAMrefreshURI;
    //方法- 发送业务数据请求
    this.send = function(rsMethod,rsUrl, rsData, rsSuccessCallback, rsErrorCallback,classNumber,noSendCallback) {
    		//classNumber==1本次请求需要权限验证
    		if(classNumber==1&&!(yxLogin.getAccess('access_token'))){
    			//alert('请登录后操作');
    			toaster.pop('error','','请登录后操作');
    			return;
    		}
    		if(classNumber==5){
    			if(!$rootScope.userInfo){
    				toaster.pop('warning','','请确认登录信息后重试');
	    			$rootScope.modals.systemLoginModal=true;
	    			if(typeof noSendCallback=='function'){
	    				noSendCallback();
	    			}
	    			return;
    			}else{
    				rsData.user=$rootScope.userInfo.user;
    				rsData.pwd=$rootScope.userInfo.pwd;
    			}
    		}
    		if(classNumber=='access'){
    			if(!$.cookie('access')){
    				$rootScope.modals.systemLoginModal=true;
    				toaster.pop('warning','','此操作需验证用户权限，请登录后重试！');
    				if(typeof noSendCallback=='function'){
	    				noSendCallback();
	    			}
	    			//$rootScope.modals.systemLoginModal=true;
	    			return;
    			}
    		}
    		
			//封装请求config
	        var configdata = {
	            'method': rsMethod,
	            'url': rsUrl,
	            'data': rsData,
	            'headers': {
	                'access_token': $.cookie('access'),
	                'channel': 'BROWSER',
	                //'dataType':'text',
	                'Content-Type': 'application/json; charset=utf-8'
	                //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	            },
	        };
          var that = this;
          if(global_level>5){
				console.log('yxRequest.send请求',configdata);						
									}
		//
        //发送http请求
        $http(configdata).success(function(data, status, headers, config) {
        	if(global_level>5){
				console.log('成功', data);						
			}
            //调用成功callback
            if(data.status == 200){
            	
            	rsSuccessCallback(data);
            }else{
            	rsErrorCallback(data,status);
            }
        }).error(function(data, status, headers, config) {
        	if(global_level>2){
				console.log('失败', data,status);						
			}
			//
            //统一处理异常代码
            //rsErrorCallback(data,status);
            toaster.pop('error','',yxWebSetting.niceTip);
        });
    }

    //RESTful方法- 发送业务数据请求
    this.sendRESTful = function(rsMethod,rsUrl, rsData, rsSuccessCallback, rsErrorCallback) {
        //封装请求config
	        var configdata = {
	            'method': rsMethod,
	            'url': rsUrl,
	            'data': rsData,
	            'headers': {
	                'channel': 'BROWSER',
	                'Content-Type': 'application/json; charset=UTF-8'
	            }
	        };  


          var that = this;
          if(global_level>5){
				console.log('yxRequest.send请求',configdata);						
			}
        //发送http请求
        $http(configdata).success(function(data, status, headers, config) {
        	if(global_level>5){
				console.log('成功', data);						
			}
            //调用成功callback
            rsSuccessCallback(data);
        }).error(function(data, status, headers, config) {
        	if(global_level>2){
				console.log('失败', data,status);						
			}
            //统一处理异常代码
            if(status == -1 ) {
            	alert(yxWebSetting.niceTip);
                //网络异常1秒后重发请求
//              $timeout(function(){
//                  that.send(rsMethod, rsUrl, rsData, rsSuccessCallback, rsErrorCallback);            
//              },1000);
            }else if(status == 499) {
                //调用重新拿token
                yxLogin.reFreshToken(function() {
                    //获取token成功后重发请求
                    that.sendRESTful(rsMethod, rsUrl, rsData, rsSuccessCallback, rsErrorCallback);
                });
           }else if(status == 498) {
                //ACCESS_TOKEN解析失败    调用注销用户登录
           		 yxLogin.logout(window.location.href);
            } else {
                //调用失败callback
                if(typeof rsErrorCallback == 'function') {
                    rsErrorCallback(data,status);
                }
            }
        });
    }


}]);
//service yxWebsocket
//用法：yxWebsocket.websocketWorker(url,onOpenFun,onmessageFun,onerrorFun,onCloseFun)
//功能一：封装websocket服务
angular.module('app').service('yxWebsocket',['toaster','$websocket','$timeout',function(toaster,$websocket,$timeout){
	this.websocketWorker=function(url/*,onOpenFun,onMessageFun,onErrorFun,onCloseFun*/){
		
		var myWS = $websocket(url);
      	return myWS
      	
	}
}]);
angular.module('app').service('yxLocalStorage',['$window',function($window){
	this.set=function (key, value) {
        $window.localStorage[key] = value;
    };        //读取单个属性
    this.get=function (key) {
        return $window.localStorage[key] || false;
    };        //存储对象，以JSON格式存储
    this.setObject=function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
    };        //读取对象
    this.getObject=function (key) {
    	
        return JSON.parse($window.localStorage[key] || '[]');//获取字符串并解析成对象
    };
    
    this.arrAdd=function(obj){
    	let arr=JSON.parse($window.localStorage['__log']||'[]');
    	if(arr.length>200){
    		let strData=$window.localStorage['__log']
    		var file = new File([strData], 'data.txt', { type: "text/plain;charset=utf-8" });
			saveAs(file);
			arr=[];
    	}
    	
    	arr.push(obj);
    	$window.localStorage['__log'] = JSON.stringify(arr);
    }
}])




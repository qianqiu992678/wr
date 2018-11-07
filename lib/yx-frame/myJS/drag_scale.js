var dragScale = function (svgEle,radarEle,resetBtn){
	this.svgEle = svgEle;//svg
	this.resetBtn=resetBtn;//复位按钮
	this.radarBoxEle=radarEle;//小地图
	this.init.apply(this);
	
};
dragScale.prototype = {
	constructor: dragScale,
	_dom: {},
	_x: 0,//drag--
	_y: 0,//drag--
	_top: 0,//drag--
	_left: 0,//drag--
	move: false,//drag--
	down: false,//drag--
	boxEle:null,
	radarAreaSize:{width:0,height:0},//小地图尺寸
	radarCurrentMsg:{width:0,height:0,left:0,top:0},//小地图显示区域  尺寸及位置
	svgSize:{width:0,height:0},//svg元素尺寸
	boxSize:{width:0,height:0},//container的尺寸
	mousePosition:{},
	currentVBArr:[],//viewBox属性值
	originVBArr:[],
	init: function() {
		this.WHRatio={};
		this.radarEle=this.radarBoxEle.children('.areaWrap')
		this.currentRadarEle=this.radarEle.siblings('.currentArea');
		this.radarAreaSize.width=parseInt(this.radarBoxEle.css('width'));
		
		this.boxEle=this.svgEle.parent('.dqmx-svgContainer');
		this.svgSize.width=parseInt(this.svgEle.css('width'));
		this.svgSize.height=parseInt(this.svgEle.css('height'));
		this.boxEle.css({'width':'100%','height':'100%'});
		this.boxSize.width=parseInt(this.boxEle.css('width'));
		this.boxSize.height=parseInt(this.boxEle.css('height'));
		this.WHRatio.box=this.boxSize.width/this.boxSize.height;
		this.WHRatio.svg=this.svgSize.width/this.svgSize.height;
		
		if(this.boxSize.width>this.svgSize.width){
			this.boxEle.css('width',this.svgSize.width+'px')
		}
		
		if(this.boxSize.height>this.svgSize.height){
			this.boxEle.css('height',this.svgSize.height+'px')
		}
		this.boxSize.width=parseInt(this.boxEle.css('width'));
		this.boxSize.height=parseInt(this.boxEle.css('height'));
		this.currentVBArr=this.svgEle[0].attributes.viewBox.nodeValue.split(' ');
		
		this.radarAreaSize.height=this.radarAreaSize.width*this.svgSize.height/this.svgSize.width;
		this.radarBoxEle.css({'height':this.radarAreaSize.height+'px'})
		
		//this.originVBArr=this.svgEle[0].attributes.viewBox.nodeValue.split(' ');
		
		this.radarCurrentMsg.left=this.currentVBArr[0]/this.svgSize.width*this.radarAreaSize.width;
		this.radarCurrentMsg.top=this.currentVBArr[1]/this.svgSize.height*this.radarAreaSize.height;
		this.goRadarCurrent();
		this.bindEvent();
		let radarVBArr=[0,0,0,0];
		
		let xX=this.svgSize.width*this.svgSize.width/this.radarAreaSize.width;
		let xY=xX*this.svgSize.height/this.svgSize.width;
		let yY=this.svgSize.height*this.svgSize.height/this.radarAreaSize.height;
		if(xY>yY){
			this.radarBoxEle.children('.areaMap').children('svg')[0].setAttribute("viewBox",`0 0 ${xX} ${xY}`);
		}else{
			let yX=yY*this.svgSize.width/this.svgSize.height;
			this.radarBoxEle.children('.areaMap').children('svg')[0].setAttribute("viewBox",`0 0 ${yX} ${yY}`);
		}
		
		////初始化缩放
		
		if(this.WHRatio.box>this.WHRatio.svg){//box的宽度大，，以高度来计算
			this.boxEle.css('width',this.boxSize.height*this.svgSize.width/this.svgSize.height+'px');
		}else{
			this.boxEle.css('height',this.svgSize.height*this.boxSize.width/this.svgSize.width+'px');
		}
		this.boxSize.width=parseInt(this.boxEle.css('width'));
		this.boxSize.height=parseInt(this.boxEle.css('height'));
		let arr=[0,0];
		arr[2]=this.svgSize.width*this.svgSize.width/this.boxSize.width;
		arr[3]=arr[2]/this.WHRatio.svg;
		this.mouseScroll(1,arr);	
		this.originVBArr=arr;
		this.maxVB={};
		this.maxVB.width=arr[2];
		this.maxVB.height=arr[3];
		
	},
	bindEvent: function() {
		var that = this;
		$("body.station").unbind( "mouseup" );
		$("body.station").unbind( "mousemove" );
		$("body.station").unbind( "mousedown" );
		$('body.station').on('mousedown', 'svg', function(e) {
			e && e.preventDefault();
			if(!that.move) {
				that.mouseDown(e);
			}
		});
		$('body.station').on('mouseup', 'svg', function(e) {
			that.mouseUp(e);
		});
		$('body.station').on('mousemove', 'svg', function(e) {
			if(that.down) {
				that.mouseMove(e);
			}
		});
		this.radarEle.unbind('click');
		this.radarEle.on('click',function(e){
			that.radarCurrentMsg.left=e.offsetX-that.radarCurrentMsg.width/2;
			that.radarCurrentMsg.top=e.offsetY-that.radarCurrentMsg.height/2;
			
			let vbArr=JSON.parse(JSON.stringify(that.currentVBArr));
			vbArr[0]=that.svgSize.width*that.radarCurrentMsg.left/that.radarAreaSize.width;
			vbArr[1]=that.svgSize.height*that.radarCurrentMsg.top/that.radarAreaSize.height;
			if(vbArr[0]>=that.svgSize.width-that.boxSize.width*that.currentVBArr[2]/that.svgSize.width){
				vbArr[0]=that.svgSize.width-that.boxSize.width*that.currentVBArr[2]/that.svgSize.width;
			}
			if(vbArr[0]<0){
				vbArr[0]=0;
			}
			if(vbArr[1]>=that.svgSize.height-that.boxSize.height*that.currentVBArr[3]/that.svgSize.height){
				vbArr[1]=that.svgSize.height-that.boxSize.height*that.currentVBArr[3]/that.svgSize.height
			}
			if(vbArr[1]<0){
				vbArr[1]=0;
			}
			that.moveToPosition(vbArr)
		})
		this.boxEle[0].onmousewheel=this.scrollFunc.bind(this);
		this.boxEle[0].addEventListener('DOMMouseScroll',this.scrollFunc.bind(this),false);
		this.resetBtn.unbind('click')
		this.resetBtn.on('click',function(){
			that.moveToPosition(that.originVBArr)
		})
	},
	mouseMove: function(e) {
		
		e && e.preventDefault();
		this.move = true;
		
			//dom = $('.dqmx-svgContainer');
		let vbArr=this.currentVBArr;
		
		var x = (this._x - e.clientX)*vbArr[2]/this.svgSize.width,
			y = (this._y - e.clientY)*vbArr[2]/this.svgSize.width;
		let vb0=parseFloat(vbArr[0])+x;
		let vb1=parseFloat(vbArr[1])+y;
		
		if(vb0<0){
			vb0=0;
		}
		if(vb0>=this.svgSize.width-this.boxSize.width*this.currentVBArr[2]/this.svgSize.width){
			vb0=this.svgSize.width-this.boxSize.width*this.currentVBArr[2]/this.svgSize.width;
			if(vb0<0){
				vb0=0;
			}
		}
		
		if(vb1<0){
			vb1=0;
		}
		if(vb1>=this.svgSize.height-this.boxSize.height*this.currentVBArr[3]/this.svgSize.height){
			vb1=this.svgSize.height-this.boxSize.height*this.currentVBArr[3]/this.svgSize.height
			if(vb1<0){
				vb1=0;
			}
		}
		this.radarCurrentMsg.left=vb0/this.svgSize.width*this.radarAreaSize.width;
		this.radarCurrentMsg.top=vb1/this.svgSize.height*this.radarAreaSize.height;
		this.svgEle[0].setAttribute("viewBox", vb0+' '+vb1+' '+vbArr[2]+' '+vbArr[3]);
		
		this.goRadarCurrent();
	},
	mouseUp: function(e) {
		e && e.preventDefault();
		this.move = false;
		this.down = false;
		this.currentVBArr=this.svgEle[0].attributes.viewBox.nodeValue.split(' ');
		this.svgEle.css('cursor', '');
	},
	mouseDown: function(e) {
		this.currentVBArr=this.svgEle[0].attributes.viewBox.nodeValue.split(' ');
		this.move = false;
		this.down = true;
		this._x = e.clientX;
		this._y = e.clientY;
		this.boxSize.width=parseInt(this.svgEle.parent('.dqmx-svgContainer').css('width'));
		this.boxSize.height=parseInt(this.svgEle.parent('.dqmx-svgContainer').css('height'));
		this._top = $('.dqmx-svgContainer').scrollTop();
		this._left = $('.dqmx-svgContainer').scrollLeft();
		this.svgEle.css('cursor', 'move');
	},
	scrollFunc: function(e) {
		this.mousePosition.left=e.layerX;
		this.mousePosition.top=e.layerY;
		e=e || window.event;  
		e.preventDefault();
        if(e.wheelDelta){//IE/Opera/Chrome  
            //自定义事件：编写具体的实现逻辑  
            let scaleTimes=e.wheelDelta>0?'0.9':'1.1';
            this.mouseScroll(scaleTimes);
        }else if(e.detail){//Firefox
            //自定义事件：编写具体的实现逻辑  
            let scaleTimes=e.detail<0?0.9:1.1;
            this.mouseScroll(scaleTimes); 
        }
	},
	mouseScroll: function(scaleTimes,arr) {
		
		if(!arr){
			var vbArr=this.currentVBArr;
			if(vbArr[2]*scaleTimes>this.maxVB.width){
				vbArr[0]=vbArr[1]=0;
				vbArr[2]=this.maxVB.width;
				vbArr[3]=this.maxVB.height;
			}else{
				vbArr[0]=(vbArr[2]-vbArr[2]*scaleTimes)/this.svgSize.width*this.mousePosition.left+parseFloat(vbArr[0]);
				vbArr[1]=(vbArr[3]-vbArr[3]*scaleTimes)/this.svgSize.height*this.mousePosition.top+parseFloat(vbArr[1]);
				vbArr[2]=vbArr[2]*scaleTimes;
				vbArr[3]=vbArr[3]*scaleTimes;
				if(vbArr[0]<0){
					vbArr[0]=0
				}else if(vbArr[0]>this.svgSize.width-vbArr[2]*this.boxSize.width/this.svgSize.width){
					vbArr[0]=this.svgSize.width-vbArr[2]*this.boxSize.width/this.svgSize.width
				};
				if(vbArr[1]<0){
					vbArr[1]=0
				}else if(vbArr[1]>this.svgSize.height-vbArr[3]*this.boxSize.height/this.svgSize.height){
					vbArr[1]=this.svgSize.height-vbArr[3]*this.boxSize.height/this.svgSize.height
				};
				
			}
			
		}else{
			var vbArr=arr;
		}
		this.svgEle[0].setAttribute("viewBox", vbArr[0]+' '+vbArr[1]+' '+vbArr[2]+' '+vbArr[3]);
		this.currentVBArr=this.svgEle[0].attributes.viewBox.nodeValue.split(' ');
		this.radarCurrentMsg.left=this.currentVBArr[0]/this.svgSize.width*this.radarAreaSize.width;
		this.radarCurrentMsg.top=this.currentVBArr[1]/this.svgSize.height*this.radarAreaSize.height;
		this.goRadarCurrent()
	},
	moveToPosition:function(endPosition){
		let that=this;
		let number=50;
		let d0=(endPosition[0]-that.currentVBArr[0])/number;
		let d1=(endPosition[1]-that.currentVBArr[1])/number;
		let d2=(endPosition[2]-that.currentVBArr[2])/number;
		let d3=(endPosition[3]-that.currentVBArr[3])/number;
		let i=1;
		let timer= setInterval(function(){
			i+=1;
			if(i<=number){
				that.svgEle[0].setAttribute("viewBox", parseFloat(that.currentVBArr[0])+d0*i+' '+(parseFloat(that.currentVBArr[1])+d1*i)+' '+(parseFloat(that.currentVBArr[2])+d2*i)+' '+(parseFloat(that.currentVBArr[3])+d3*i));
				
			}else{
				clearInterval(timer);
				timer=null;
				that.currentVBArr=that.svgEle[0].attributes.viewBox.nodeValue.split(' ');
				that.radarCurrentMsg.left=that.currentVBArr[0]/that.svgSize.width*that.radarAreaSize.width;
				that.radarCurrentMsg.top=that.currentVBArr[1]/that.svgSize.height*that.radarAreaSize.height;
				that.goRadarCurrent();
			}
		},5)
	},
	goRadarCurrent:function(){
		this.radarCurrentMsg.width=this.boxSize.width/(this.svgSize.width*this.svgSize.width/this.currentVBArr[2])*this.radarAreaSize.width;
		this.radarCurrentMsg.height=this.boxSize.height/(this.svgSize.height*this.svgSize.height/this.currentVBArr[3])*this.radarAreaSize.height;
		
		
		this.currentRadarEle.css({width:this.radarCurrentMsg.width+'px',height:this.radarCurrentMsg.height+'px',top:this.radarCurrentMsg.top+'px',left:this.radarCurrentMsg.left+'px'})
	}
	
};

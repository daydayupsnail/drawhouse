/**

* @module
* @description 初始化墙线、墙数组等；<br/>墙体各种事件
* 模块调用返回值是 walls_obj {@link module:thing-main/walls.walls_obj}

*/

var Beelines = require("../com/beelines.js"),
	Wall = require("./wallevt.js"),
	stylepen = require('../style-pen');


	
	// vertexfocusedwall = require('./vertex-focused-wall'),
/**
 * @namespace
 * @description 模块实例化的返回值
 * @alias module:thing-main/walls.walls_obj
 */
var obj = {};
var stage,
	stagefun,
	drawstack,
	sibling,
	rooms,
	intersections,
	beelinesfun=Beelines(),
	beelines=beelinesfun.shape,
	spotstyle = stylepen.spotstyle,
	style = stylepen.wallstyle,
	intersectionwall,
	doorsarray,
	windowlinesarray,
	approach;

var wall,
	wallsarray;

/**

* @constructor 
* @augments Beelines
* @description 墙集合
* @param {string} linecolor
* @param {string} linesize

*/
function Wallsarray(linecolor,linesize){
	beelines.call(this,linecolor,linesize);
	this.name="wallsarray";
	this.childname="wall";
	this.measureshow=true;


	

}

var aBeelines= new Beelines();

/*START 添加的其他原型方法*/
aBeeline.deleteone=function (index,notpust) {
  //...
}
aBeeline.recoverone=function  (onedata) {
    this.push(onedata.data,true)
    onedata.data.recover(onedata);
    onedata.data.hasexist=true;
    rooms.create();
    intersectionwall.clearempty();
}
/*END 添加的其他原型方法*/

Wallsarray.prototype = aBeeline;



var matchlinedom={
	"nom":0,
	"abs":12
};

/*START 绑定的事件*/
 /**
 * @namespace 
 * @memberof module:thing-main/walls.walls_obj
 * @description 墙体的事件
 * @alias walls_event
 */
var event={  //绑定在stage 的事件
	onfocus:false, //点击出发的事件
	clickstate:false, //点2次才是一次绘制，true为点了一次
	firstdraw:false,
	movedline:null, //拖动的一条线
	oldpoint:null,
	ischange:false, // 是否 拖动 点或线
	ischangeing:false, //movealine 用于 需要 二次激活的
	changearr:[], //拖动 点或线 激活的线 数组
/** 
* 下面这个是不管用的
* @description 去掉画墙的痕迹 
* @function
* @param {point} json 点的x，y坐标 
* @param {evttype} num2 被加数 
* @param {ename} String 触发的目标名字 
* @param {etarget} num2 触发的目标 
* @return {} result json 结果,result.iftrue 为真 则为成功触发了这次事件 
*/ 
	clear:function(point,evttype,ename,etarget){
		var _this=event;
		if(!_this.onfocus){
			return null;
		}
		var basicclickstate;
		basicclickstate=this.clickstate;
		this.clickstate=false;
		this.firstdraw=false;
		// wall.first={x:null,y:null};
		// wall.last={x:null,y:null};
		wall.clear();
		approach.event.clear();
		intersectionwall.cleardraw();
		intersections.clear();
		if(!basicclickstate){
			intersectionwall.hiddenall();
		}
		stage.update();
		return {
			iftrue:true,
			type:"wall",
			hasbreaked:basicclickstate
		};
	},
	setdraw:function(tofocus,type){
		var _this=event;
		_this.onfocus=tofocus;
		if(_this.onfocus){ //当前事件并且没被激活
			if(type){
				wall.setlinedom(matchlinedom[type]);
			}else{
				wall.setlinedom(matchlinedom["nom"]);
			}
			console.warn("draft 废弃了");
			//draft.penciltype=0;
			// drawCanvasid.className="pencilcursor"; 
		}else{
			_this.clear();
		}
		_this.clickstate=false;
	},
	draw:function(point,evttype,ename,etarget){
		var _this=event;
		if(!_this.onfocus){
			return null;
		}
		var usepoint=point;
		// evttype 1 up 2 move
		wall.hasfirstclick=false;

		if(evttype==1){	//第一步骤
			if(!this.clickstate){
				usepoint=approach.event.run(point,evttype,ename,etarget,
			[approach.point,approach.pointinline,approach.line],true);
				wall.setFlPoint(usepoint,usepoint);

				
				this.clickstate=!this.clickstate;
				this.firstdraw=false; //值没用

				stage.update();
				
			}else{ //第三步
				if(wall.first.x&&wall.first.x==wall.last.x&&wall.first.y==wall.last.y){				// return;
					//终点、起点重复事件
					return;
				}else if(wall.first.x){
					var newline=wall.clone(wallsarray.num);
					// newline.changemeasure(false);
					createjs.Stage.prototype.addChild.apply(stage,newline.getShape(stagefun));
					wallsarray.push(newline); 
					drawstack.push({status:1,datas:[{data:newline,from:1}]});

					var basiclast={
						x:wall.last.x,
						y:wall.last.y
					}; //经过 下面 wall 被改了

					var len=Dm.accountlength(newline.first,newline.last);

					usepoint={x:basiclast.x,y:basiclast.y};
					stage.update();
					
					wall.setFirstPoint({x:usepoint.x,y:usepoint.y});


					rooms.create();
					
					intersectionwall.setfirst(newline.first,newline.last,newline);

					stage.update();
				}
			}
			return {
				iftrue:true
			};
		}else if(evttype==2&&this.clickstate){	//	第二步
			wall.hasfirstclick=true;
			usepoint=approach.event.run(point,evttype,ename,etarget,
			[approach.pointinline,approach.verticalLine,approach.point,approach.line],true);
			wall.setLastPoint({x:usepoint.x,y:usepoint.y});
			intersectionwall.setlast(usepoint);

			stage.update();

			// if(!ifpointfocused)
			// 	iflinetocoordinate=wall.getcoordinateclosed(nearangle,{x:usepoint.x,y:usepoint.y});
			// usepoint={x:wall.last.x,y:wall.last.y};
			// lastpointer.graphics.clear().beginFill(spotstyle.color).drawCircle(usepoint.x,usepoint.y, spotstyle.size);
		}else if(evttype==2){
			usepoint=approach.event.run(point,evttype,ename,etarget,
			[approach.point,approach.pointinline,approach.line],true);
		}
		return {
			iftrue:true
		};
	},
	pointfocus:function(point,evttype,ename,etarget,ifdraw){
		//当不画的时候，获取焦点
		var _this=event;
		if(ifdraw){

			return null;
		}
		var usepoint=approach.event.run(point,evttype,ename,etarget,
			[approach.point]);
		// approach.event.point
	},
	movealine:function(point,evttype,ename,etarget){ //选中一条线，移动
		var usepoint=point;
		//触发
		// var protothis=this?this:draft.wall;
		var protothis=event;
		if(!(!protothis.ischange||protothis.ischange=="line")){
			return;
		}

		

		protothis.movedline=etarget.mzshape;
		var nowfirst,nowlast;
		if(protothis.oldpoint){
			//oldarr 要改的线
			//arr 一会要入栈的线
			//newarr 改完的线

			var result=sibling.byline.run(protothis.movedline,protothis.oldpoint,usepoint);
			var oldarr=result.oldarr; 
			var arr=[];
			arr.push({data:{line:protothis.movedline,point:protothis.movedline.getFlPoint()},from:1});
			Array.prototype.push.apply(arr,oldarr);

			if(!protothis.ischangeing){
				drawstack.push({status:2,datas:arr});
			}
			
			event.changearr=result.newarr;
			console.log("movealine");
			protothis.ischangeing=true;

		}
		protothis.oldpoint={x:usepoint.x,y:usepoint.y};
		protothis.ischange="line";
		return {
			iftrue:true
		};	
	},
	movealineover:function(){
		sibling.byline.free();

		event.oldpoint=null;
		event.movedline=null;

		event.drawbasic();

		event.ischange=false;
		event.ischangeing=false;

		// intersections.getpbywalls();
		console.log("movealineover");
	},
	moveapoint:function(point,evttype,ename,etarget,oldpoint){//选中点，对线变形
		var usepoint=point;
		var protothis=event;

		if(!(!protothis.ischange||protothis.ischange=="point")){
			return;
		}
		//oldarr 要改的线
		//arr 一会要入栈的线
		//newarr 改完的线
		var finalpoint={
			x:point.x,
			y:point.y
		};

		usepoint=approach.event.run(point,evttype,ename,etarget,
		[approach.point,approach.pointinline,approach.line],false);

		if(protothis.oldpoint){
			// console.log(usepoint.x);
			// console.log(usepoint.y);
			// console.log("set");
			// console.log(protothis.oldpoint.x);
			// console.log(protothis.oldpoint.y);

			var result=sibling.bypoint.run(usepoint,protothis.oldpoint);
		

			var oldarr=result.oldarr;
			if(!protothis.ischangeing){
				drawstack.push({status:2,datas:oldarr});	
			}	
			protothis.changearr=result.newarr;		
			protothis.ischangeing=true;
			event.changearr=result.newarr;
			finalpoint=result.point;
			// intersections.getpbywalls(true);
		}
		protothis.oldpoint=oldpoint;
		protothis.ischange="point";
		return {
			iftrue:true,
			point:finalpoint,
			ifalongout:true
		};
	},
	drawbasic:function(temparr){
		var arr = temparr||event.changearr,
			i=arr.length,
			one;
		while(i--){
			one=arr[i].line;
			one.clickactive=false;
			one.drawLine();
		}
		event.changearr=[];
		rooms.create();
		// intersections.getpbywalls();
	},
	moveapointover:function(){
		// event.oldpoint=null;
		sibling.bypoint.free();
		event.drawbasic();
		event.oldpoint=null;
		event.ischange=false;
		event.ischangeing=false;
		approach.event.clear();
		console.log("moveapointover");
	},
	linechanged:function(){
		//画 ,删除 ,修改位置后调用

	}
};

/*END 绑定的事件*/

var init=function(){ //需要传递给别人的数据
	Wall.adddata({	
		// "moveapoint":event.moveapoint,
		// "moveapointover":event.moveapointover,
		"movealine":event.movealine,
		"movealineover":event.movealineover
	});
	approach.adddata({	
		"moveapoint":event.moveapoint,
		"moveapointover":event.moveapointover
	});
/**
 * @description 画墙的那条线,一个实例<br/>画确定的过程，是在clone它的状态
 * @name wall
 * @member {Wall} wall
 * @inner
*/
	wall = new Wall(null,null,style.color,style.size,style.len);
	wall.changemeasure(true);
/**
 * @description 墙线的集合,一个实例
 * @name wallsarray
 * @member {Wallsarray} wallsarray
 * @inner
*/
	wallsarray = new Wallsarray();
	createjs.Stage.prototype.addChild.apply(stage,wall.getShape(stagefun));

	
}

var run=function(mdata){ //需要从stage获取数据,
	drawstack = stagefun.drawstack;
	rooms = stagefun.rooms;
	Wall.event.init(stagefun);
	intersectionwall=Intersectionwall(stagefun);
    intersections=stagefun.intersections;

    doorsarray=mdata.doorsarray;

    windowlinesarray=mdata.windowlinesarray;

    wallsarray.addstage(stagefun);
    doorsarray.addstage(stagefun);
    windowlinesarray.addstage(stagefun);

	sibling = new Sibling(stagefun,wallsarray,Wall); //里面有依赖。还是后执行比较好

}

module.exports=function(tempstagefun,tempapproach){
	stagefun=tempstagefun;
	stage = stagefun.stage;
	// 
	approach=tempapproach;
	approach.wallevent=event;

	stagefun.wallevt=Wall;

	init();


 /** 
  * @memberof module:thing-main/walls.walls_obj
  * @description 传出wallsarray 
  * @name shape
 */
	obj.shape=wallsarray;
 /** 
  * @memberof module:thing-main/walls.walls_obj
  * @description 其他需要传出的引用值，包括wall，wallsarray 
  * @name mdata
 */
	obj.mdata={
		wall:wall,
		wallsarray:wallsarray,
		intersectionwall:intersectionwall  //这个值没有传出去
	}
	// obj.approach=approach;
 /** 
   * 在ready后，运行的函数，最后会在stage{@link stage}调用，就是{@link module:thing-main/walls.walls_obj.walls_event} 
   * @memberof module:thing-main/walls.walls_obj
   * @name event
 */
	obj.event = event;
 /** 
   * 在ready后，运行的函数，最后会在stage{@link stage}调用 
   * @memberof module:thing-main/walls.walls_obj
   * @name run
 */
	obj.run=run;


	return obj;
}

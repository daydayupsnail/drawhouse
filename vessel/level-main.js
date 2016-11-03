/*
	有哪些事件
	--
	户型图主题结构层
	当前层次的事件 是主要事件注入的地方
	其他层次灯
*/
var objparent = require("../com/level");
	
var	Wall = require("../thing-main/wall"),
	Walls = require("../thing-main/walls"),
	Doors = require("../thing-main/doors"),
	Door = require("../thing-main/door"),
	Windowlines = require("../thing-main/windowlines"),
	Windowline = require("../thing-main/windowline"),
	Area = require("../thing-main/areaevt");
	ApproachWall = require("../thing-main/approach-wall");
	Staffroom = require("../thing-main/staff-room"),
	Imgback = require("../thing-main/img-background"),
	Room = require('../thing-main/room'),
	Rooms = require('../thing-main/rooms'),
	Roomslastdata = require("../thing-main/rooms-lastdata.js"),
	Lineinneraroom = require("../thing-main/lineinneraroom.js"),
	Staffhouse=require("../thing-main/staff-house"),
	Boxbackground= require('../thing-main/box-background');

var Intersections=require("../thing-main/intersections");// 相交点 为了补交
var Intersectionangle=require('../thing-main/intersection-angle');	//相交的角度 显示角度


	
var obj={},shape,
	stage,stagefun; //shape 才是createjs的元素

var walls,wall,doors,door,windowline,windowlines,
	wallsarray,doorsarray,windowlinesarray,area,
	staffroom,
	lineinneraroom,
	rooms,roomobj,roomslastdata,staffhouse;
console.warn("单个wall引入 是需要删 的");

var floatnormal;

/*START 当前层次的事件*/
var approach;
var event;

var states;
var datachangearr=[];
 
var mdata={  //要传递到

}
/*END 当前层次的事件*/

//定义
function addmdata(data){
	for(i in data){
		var one = data[i];
		mdata[i]=one;
	}
}
function positionself(x,y){
	shape.x=x;
	shape.y=y;
}

// var initaobj=function(fun,funout,shapeout){  //这样传进去的值不是引用
// 	funout = fun(stagefun);
// 	addmdata(funout.mdata);
// 	shapeout=funout.shape;
// 	if(funout.run){
// 		run.arr.push(funout.run);
// 	}
// }
	

function initorganization(stage){

	// initaobj(Walls,walls,wallsarray);
	// initaobj(Doors,doors,doorsarray);
	// initaobj(Windowlines,windowlines,windowlinesarray);

	Boxbackground(stagefun);


	walls = Walls(stagefun,ApproachWall);
	addmdata(walls.mdata);
	wallsarray = walls.shape;
	if(walls.run){
		run.arr.push(walls.run);
	}

	doors = Doors(stagefun,wallsarray);
	addmdata(doors.mdata);
	doorsarray = doors.shape;
	if(doors.run){
		run.arr.push(doors.run);
	}
	windowlines = Windowlines(stagefun,wallsarray);
	addmdata(windowlines.mdata);
	windowlinesarray = windowlines.shape;
	if(windowlines.run){
		run.arr.push(windowlines.run);
	}

	area = Area(stagefun,wallsarray,ApproachWall);
	addmdata(area.mdata);
	if(area.run){
		run.arr.push(area.run);
	}
	
	imgback = Imgback(stagefun);


	staffroom=Staffroom(stagefun,wallsarray);
	if(staffroom.run){
		run.arr.push(staffroom.run);
	}
	

	ApproachWall.init(stage,walls.mdata);


	roomobj = Room(stagefun);
	addmdata(roomobj.mdata);
	if(roomobj.run){
		run.arr.push(roomobj.run);
	}


	rooms = Rooms(stagefun,walls,roomobj.shape);	
	addmdata(rooms.mdata);
	if(rooms.run){
		run.arr.push(rooms.run);
	}

	roomslastdata = Roomslastdata(stagefun)

	staffhouse=Staffhouse(stagefun,wallsarray,stagefun.wallevt,rooms);

	lineinneraroom=Lineinneraroom(stagefun,wallsarray,rooms);


	Intersectionangle(stagefun,wallsarray); //要在 intersections 前面

	Intersections(stagefun,wallsarray,walls.mdata.wall);



	event={
		clear:{
			basic:[
				walls.event.clear,
				area.event.clear,
				doors.event.clear,
				windowlines.event.clear
			]
		},
		mouse:{
			up:[
				walls.event.draw,
				area.event.draw,
				doors.event.draw,
				windowlines.event.draw,
				rooms.event.mouse.up
			],
			down:[],
			move:[
				walls.event.draw,
				area.event.draw,
				doors.event.draw,
				windowlines.event.draw,
				walls.event.pointfocus  //顶点选中移动
				// walls.event.move,
				// doors.event.move,
				// windowlines.event.move
			],
		},
		press:{
			move:[
				// walls.event.movealine,
				// walls.event.moveapoint,
				// doors.event.resize,
				// windowlines.event.resize,
			],
		},
		click:{  //单次点击放在up里
			db:[],
			// restore:[]
		}
	};

	//这个approach 废弃了
	approach={  // 所有的接近都和move 有关系，只需判断move
		mouse:{
			up:[],
			down:[],
			move:[ 
				// windowlines.approach.point,
				// windowlines.approach.line,
				// doors.approach.point,
				// doors.approach.line,
				// walls.approach.point,
				// walls.approach.line,
				// walls.approach.verticalLine,
			],
		},
		press:{
			move:[],
		},
		// click:{  //单次点击放在up里
		// 	db:[walls.event.draw],
		// }
	};

	states={
		"wall":{
			"fun":walls.event.setdraw
		},
		"area":{
			"fun":area.event.setdraw
		},
		"door":{
			"fun":doors.event.setdraw
		},
		"windowline":{
			"fun":windowlines.event.setdraw
		},
		"imgback":{
			"fun":imgback.event.addbackground
		},
		"approach":{
			"func":ApproachWall.event.switch
		},
		"staff": {
			"fun":staffroom.getshow
		}
	};
}

var run={
	arr:[],
	fun:function(){
		var i=run.arr.length,one;
		while(i--){
			one=run.arr[i];
			one(mdata);  //mdata 这个目前只在walls
		}
	}
}

module.exports=function(parent,opts){
	if(!parent){
		return;
	}
	stagefun= parent;
	stage = parent.stage;
	obj = objparent(stage);
	shape = obj.shape; //container

	positionself(0,0);
	initorganization(stage);

	obj.event=event;
	obj.approach=approach;
	obj.states=states;
	obj.mdata=mdata;
	obj.datachangearr=datachangearr;
	obj.run=run.fun;
	console.log(obj);

	return obj;
}

/*
	主要的舞台
	分为了几个层次
	事件调用区域
	-- 
	只能在主程序引入
	--接口
	//add 添加元素
	//run 正式运行,在所有页面的注入完成

	event 当前舞台的事件响应
	eventarr 需要响应的具体时间数组
	approach 点接近，修改的点
	states  传入 page 绑定的事件
	mdata 从子项目传进来的数据
*/
var stageparent = require('../com/stage.js');
var level1 = require('./level-main.js'); //目前控制的主舞台

var levelindex,levels=[];
var obj={},stage;  //stage 才是createjs的元素

//从其他地方传进来的事件
var drawstates,scrollsize;  //当前画图状态

var approach={
	mouse:{
		up:[],
		down:[],
		move:[],
	},
	press:{
		move:[],
	},
	click:{  //单次点击放在up里
		db:[],
	}
}
var eventarr={
	clear:{
		basic:[]
	},
	mouse:{
		up:[],
		down:[],
		move:[],
	},
	press:{
		move:[],
	},
	click:{  //单次点击放在up里
		db:[],
	}
}

var mdata={

}

var runarr=[];

//直接注册到stage 上的事件
//事件类型(evttype:1 up;2 move;3 press;4 pressup)
var event={
	clear:{
		basic:function(evt){
			var usepoint={x:evt.stageX,y:evt.stageY},
				etarget=evt.target,ename=etarget.name;
			var noweventarr=eventarr.clear.basic[levelindex];
			if(!noweventarr){
				return;
			}
			var i=noweventarr.length,result;
			while(i--){
				var one=noweventarr[i];
				result=one(usepoint,2,ename,etarget);
				if(result&&result.iftrue){
					break;
				}
			}
			if(result&&result.hasbreaked){
				return true;
			}
			return; 
		}
	},
	mouse:{
		up:function(evt){
			var noweventarr=eventarr.mouse.up[levelindex];
			if(!noweventarr){
				return;
			}
			var usepoint={x:evt.stageX,y:evt.stageY},
				etarget=evt.target,ename=etarget.name;
			// drawstates.changemouse(ename);

			// if(event.button==2){  //右键取消画笔
			if(evt.nativeEvent.button==2){  //右键取消画笔
		          var hasbreaked=event.clear.basic(evt);
		          if(!hasbreaked){ //对于2次up完成的，正好画了第一次，即为 true
			          drawstates.lastevent.run();
			        
		          }
		          return false;
			}
			var i=noweventarr.length,iftrigger;
			while(i--){
				var one=noweventarr[i];
				var result=one(usepoint,1,ename,etarget);
				if(result&&result.iftrue){
					iftrigger=true;
					break;
				}
			}
			if(!iftrigger&&ename=="stagedrawCanvas"){
				event.mouse.clear();
			}
			stage.update();
		},
		down:function(evt){
			/*var nowapproach=approach.mouse.up[levelindex];
			var noweventarr=eventarr.mouse.up[levelindex];
			if(!nowapproach){}
			if(!noweventarr){
				return;
			}

			while(i--){
				var one=noweventarr[i];
				result=one(usepoint,1,ename,etarget);
				if(result){
					break;
				}
			}*/

		},
		move:function(evt){
			var usepoint={x:evt.stageX,y:evt.stageY},
				etarget=evt.target,ename=etarget.name;
			var noweventarr=eventarr.mouse.move[levelindex];
			if(!noweventarr){
				return;
			}
			scrollsize.setpos(usepoint);
			var i=noweventarr.length;
			while(i--){
				var one=noweventarr[i];
				var result=one(usepoint,2,ename,etarget,drawstates.draw());
				if(result&&result.iftrue){
					break;
				}
			}
			stage.update();
		},
		clear:function(){
			eventout.click.clear();
		}
	},
	press:{
		move:function(evt){
			var usepoint={x:evt.stageX,y:evt.stageY},
				etarget=evt.target,ename=etarget.name;
			var noweventarr=eventarr.press.move[levelindex];
			if(!noweventarr){
				return;
			}
			var i=noweventarr.length,iftrigger;
			while(i--){
				var one=noweventarr[i];
				result=one(usepoint,3,ename,etarget);
				if(result&&result.iftrue){
					iftrigger=true;
					break;
				}
			}
			if(iftrigger){
				drawCanvasid.className="movecursor" ; 
			}else{

			}
			stage.update();
		},
		up:function(evt){ 
			// var usepoint={x:evt.stageX,y:evt.stageY},
			// 	etarget=evt.target,ename=etarget.name;
			// var nowapproach=approach.click.db[levelindex];
			// var noweventarr=eventarr.click.db[levelindex];
			// if(!nowapproach){}
			// if(!noweventarr){
			// 	return;
			// }
			// var i=noweventarr.length;
			// while(i--){
			// 	var one=noweventarr[i];
			// 	result=one(usepoint,4,ename,etarget);
			// 	if(result&&result.iftrue){
			// 		break;
			// 	}
			// }
			// stage.update();
		}
	},
	click:{ 
		db:function(evt){ //事件不生效
			// var usepoint={x:evt.stageX,y:evt.stageY},
			// 	etarget=evt.target,ename=etarget.name;
			// var nowapproach=approach.click.db[levelindex];
			// var noweventarr=eventarr.click.db[levelindex];
			// if(!nowapproach){}
			// if(!noweventarr){
			// 	return;
			// }
			// var i=noweventarr.length;
			// while(i--){
			// 	var one=noweventarr[i];
			// 	result=one(usepoint,4,ename,etarget);
			// 	if(result&&result.iftrue){
			// 		break;
			// 	}
			// }
			// stage.update();
		}
	}
}

//注册到stagefun的事件
//注册对象是不同的，注册事件是共享的。
var eventout={
	focus:{
		obj:null,
		set:function(sendobj){
			if(this.obj&&sendobj){  //当前只能有一个激活状态
				return;
			}
			this.obj=sendobj;
			return true;
		}
	},
	click:{
		obj:null,
		clickfun:function(type,usepoint){
			floatnormal.setfocus(this.obj,type,usepoint);
		},
		clear:function(){
			if(this.obj){
				floatnormal.losefocus();
				this.obj=null;
				if(this.clickupfun){
					this.clickupfun();
				}
			}
		},
		ifrun:function(){ //在press 和 draw 的时候不能响应
			if(drawstates.draw()){
				return true;
			}
		},
		clickupfun:null,//失去点击的事件
		set:function(sendobj,type,usepoint,clickfun,clickupfun){
			// if(this.clickupfun&&this.obj&&this.obj.name!=sendobj.name){
			if(this.ifrun()){
				return;
			}

			if(this.clickupfun){
				this.clickupfun();
			}
			if(clickfun){
				clickfun(usepoint);
			}
			this.obj=sendobj;
			if(sendobj){
				this.clickfun(type,usepoint);
			}
			this.clickupfun=clickupfun;

		}
	}
}

var states = {
	// "wall":{
	// 	"fun":wall.event.setdraw,
	// 	"level":2
	// },
};


var datachangearr=[];  //数据更新要修改的
console.warn("datachangearr 需要废除");

function attachevent(){
	stage.on("stagemouseup",event.mouse.up);
	stage.on("stagemousemove",event.mouse.move);
	stage.on("pressmove",event.press.move);
	// stage.on("dblclick",event.click.db);
}

function addlevelassemblage(){ //添加层
	addlevel(level1);
}

/*START 基础函数*/
function addlevel(levelfun){
	var level=levelfun(obj); //在这一步，会修改这个环境下的obj
	stage.addChild(level.shape);
	levels.push(level);
	var index = levels.length-1;
	level.indexinfather=index;

	//event 事件
	var i,j,leveli,levelj;
	for(i in level.event){
		leveli= level.event[i];
		for(j in leveli){
			levelj = leveli[j];
			eventarr[i][j][index]=levelj;
		}
	}

	//approach move 接近事件
	for(i in level.approach){
		leveli= level.approach[i];
		for(j in leveli){
			levelj = leveli[j];
			approach[i][j][index]=levelj;
		}
	}
	
	//states 界面状态事件
	for(i in level.states){
		leveli = level.states[i];
		leveli.level=index;
		states[i]=leveli;
	}
	//levelj  应该是一个数组，该层的事件数组

	for(i in level.datachangearr){
		var one =level.datachangearr[i];
		datachangearr.push(one);
	}

	//这个就是 传递的其他参数
	for(i in level.mdata){
		var one =level.mdata[i];
		mdata[i]=one;
	}

	if(level.run){
		runarr.push(level.run);
	}
}

function chooselevel(index){
	levelindex=index;	
}

/*END 基础函数*/

/*START 页面事件*/
function initpageevent(pageevt){
	drawstates=pageevt.drawstates;

}

function init(pageevt){
	initpageevent(pageevt);
	addlevelassemblage();

	floatnormal = Floatnormal(obj);


}
/*END 页面事件*/

var run=function(){ //所有依赖加载完毕，运行stage
	attachevent();
	chooselevel(0);

	//每个层的run 
	var i=runarr.length,one;
	while(i--){
		one=runarr[i];
		one();
	}

	stage.enableMouseOver(10);

	//下面是run 才会调用的
	scrollsize=Scrollsize(obj);		
}



module.exports=function (datas,id,pageevt) {
	if(!id){
		console.error("正确的 canvas");
		return;
	}
	stage=stageparent(id);

	obj.pageevt=pageevt;
	obj.stage=stage;
	obj.states=states; 
	obj.mdata = mdata;
	obj.evt =eventout;

	init(pageevt);

	datas.setlines(mdata);

	// 从levelmain得到 
	// obj.wallsarray=wallsarray;
	// obj.doorsarray=doorsarray;
	// obj.windowlinesarray=windowlinesarray;



	obj.run=run;

	return obj;
};

module.exports.tochange=function(){
	var i=datachangearr.length;
	while(i--){
		var one=datachangearr[i];
		one();
	}
}




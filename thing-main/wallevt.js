/*
	墙 绑定事件

	wall的克隆极度不靠谱。很多关于门窗的辅助信息都没有
*/
var Wall=require('./wall'),
	matchtype=require('../data/data-type.js');
matchtype=matchtype.wall;

var basicdata={},
	stagefun,
	stage,
	evt_stage,
	drawstates;

function Wallevt(first,last,linecolor,linesize,changecolor,basicangle,piangle,linedom,linelength,roomnum,modaldata){
	Wall.call(this,first,last,linecolor,linesize,changecolor,basicangle,piangle,linedom,linelength,roomnum,modaldata);
	

}
var awall= new Wall();

/*START 添加的其他原型方法*/
awall.addevt=function(tempstage){
    var _this=this;
    this.shapes.lineshape.on("pressmove",function(evt){
        event.press.line.move(evt,_this);
    });

    this.shapes.lineshape.on("pressup",function(evt){
        event.press.line.up(evt,_this);
    });
    this.shapes.lineshape.on("click",function(evt){
        event.mouse.line.click(evt,_this);
    });	

}
awall.outinput = { //通过输入修改值
    thick:function(size){
        wallthis.linesize=size;
        wallthis.drawLine();
    }
};
/*END 添加的其他原型方法*/

Wallevt.prototype= awall;

var event={
	onfocus:true,
	init:function(tempstagefun){
		stagefun=tempstagefun;
		stage=stagefun.stage;
		drawstates = stagefun.pageevt.drawstates;
		evt_stage =stagefun.evt;
	},
	mouse:{
		line:{
			over:function(evt,_this){
				var _=event;
				if(!_.onfocus||drawstates.draw()){
					return;
				}
				var usepoint={x:evt.stageX,y:evt.stageY},
					target=evt.target;
				// _.firstdot.show(_this,_this.first);
				// _.lastdot.show(_this,_this.last);
				if(!evt_stage.focus.set(target.mzshape)){
					return;
				}
				target.mzshape.clickactive=true;
				target.mzshape.drawLine();
			},
			out:function(evt,_this){
				var _=event,
					target=evt.target;
				if(!_.onfocus||drawstates.draw()){
					return;
				}
				if(!evt_stage.focus.set()){
					return;
				}
				target.mzshape.clickactive=false;
				target.mzshape.drawLine();
				evt_stage.focus.set();
				// _.firstdot.hidden(rname);
				// _.lastdot.hidden(rname);
			},
			click:function(evt,_this){
				var _=event,
					target=evt.target,
					mzshape = target.mzshape,
					usepoint={x:evt.stageX,y:evt.stageY};
				var sendname=matchtype[mzshape.linedom.typeid].abbr;
				sendname+="wall";
				evt_stage.click.set(mzshape,
					sendname,
					usepoint,
					function(){
						mzshape.clickactive=true;
						mzshape.drawLine();
					},function(){
						mzshape.clickactive=false;
						mzshape.drawLine();
				});
			}
		}
	},
	press:{
		line:{
			move:function(evt,_this){
				var _=event;
				if(!_.onfocus||drawstates.draw()){
					return;
				}
				var usepoint={x:evt.stageX,y:evt.stageY},
					etarget=evt.target,ename=etarget.name;
				// _.firstdot.show(_this,_this.first);
				// _.lastdot.show(_this,_this.last);
				etarget.mzshape.clickactive=true;
				runevent("movealine")(usepoint,3,ename,etarget);
			},
			up:function(evt,_this){
				var _=event;
				if(!_.onfocus||drawstates.draw()){
					return;
				}
				var usepoint={x:evt.stageX,y:evt.stageY},
					etarget=evt.target,ename=etarget.name;
				// _.firstdot.show(_this,_this.first);
				// _.lastdot.show(_this,_this.last);
				etarget.mzshape.clickactive=false;
				runevent("movealineover")(usepoint,4,ename,etarget);

			}
		}
	}
}

/* START 事件处理辅助函数*/
var runevent=function(data){
	if(typeof(basicdata[data])!="function"){
		console.warn(data+"函数不存在");
		return;
	}
	return basicdata[data];
}
/* END 事件处理辅助函数*/

module.exports=Wallevt;

module.exports.event=event;
module.exports.adddata=function(data){
	for(var i in data){
		if(basicdata[i]){
			console.warn(basicdata[i]+"已经存在");
			return;
		}
		basicdata[i]=data[i];
	}
}
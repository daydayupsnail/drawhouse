var Dm=require("./common");
/**


* @constructor Beeline
* @summary 线段
* @description 必须new实现。墙门窗基类<br/>默认是没有stage的
* @param {object} first 着笔点，第一次up 
* @param {object} last 落笔点，第二次up
* @param {string} linecolor 线的颜色
* @param {number} linesize 笔的粗细
* @param {string} changecolor 线激活的颜色，有的地方没有用到这个值，默认红色
* @param {number} basicangle 右下左上的pi角度
* @param {number} piangle 偏离水平线的非pi角度
* @param {object} linedom {typeid，typename}类型
* @param {object} linelength last到first的长度
* @param {object} roomnum 属于哪一个房间

*/
function beeline(first,last,linecolor,linesize,changecolor,basicangle,piangle,linedom,linelength,roomnum){
		//itsline 单个值，要求有 first last angle(180记)
		// return {
		this.first=first?{x:first.x,y:first.y}:null;  //当前坐标下的实际使用值，当坐标变化时，要小心
		this.last=last?{x:last.x,y:last.y}:null; 

        this.linecolor=linecolor;
        this.linesize=linesize;
        this.linelength=linelength;
        
        this.indexnum;  

        this.changecolor=changecolor?changecolor:"red";
        this.linedom=linedom?linedom:{typeid:null,typename:null};
        this.hasmatch=false;//用于智能匹配

        this.angle; //离水平线的角度
        this.piangle=piangle?piangle:0; //离水平线的pi角度
        this.basicangle=basicangle?basicangle:0; //右下左上pi角度

        //rotation 是

        if(roomnum||roomnum===0){
	        this.roomnum=[roomnum];
        }else{
        	this.roomnum=[];
        }
        this.sendangle; //上右下左
        this.sendpiangle; //

        this.shapes={};

        this.clickactive=false;

		// };
		// return {

		// };
		//
		this.getsubline = function(point,isDown,len){  //垂直的点
			var useangle = this.basicangle;
			var point=point;
    		var lastpoint = {x:null,y:null};
    		if(isDown){
				lastpoint.x=point.x+Math.sin(useangle)*len;
				lastpoint.y=point.y-Math.cos(useangle)*len;
			}else{
				lastpoint.x=point.x-Math.sin(useangle)*len;
				lastpoint.y=point.y+Math.cos(useangle)*len;
			}
			return lastpoint;
		};
		//计算线的点
		this.linpoint=function(firstPoint,length,isPLus){
			var useangle = this.basicangle;
			var pointO={x:null,y:null};
			console.log(firstPoint);
			console.log(length);
			console.log(useangle);
			if(isPLus){
				pointO.x=firstPoint.x-Math.sin(useangle)*length;
				pointO.y=firstPoint.y+length*Math.cos(useangle);
			}else{//向上
				pointO.x=firstPoint.x+Math.sin(useangle)*length;
				pointO.y=firstPoint.y-length*Math.cos(useangle);
			}
			
			return pointO;

		}
       
}

beeline.prototype={
	pixelRate :　1,
	// staffshape.pixelRate,
    /**
     * 输入x判断在 first 和last 之间
     * @summary 当线不是90,270度
     * @returns boolean
     * @memberof beeline.prototype
     */
	xinline : function(evtx){ //x 在线的区域，多用于水平线
    	var one=Math.abs(evtx-this.first.x)+Math.abs(evtx-this.last.x)==Math.abs(this.last.x-this.first.x);
    	// var sec=evtx!=this.first.x&&evtx!=this.last.x;
		return one;
	},
    /**
     * 输入y判断在 first 和last 之间
     * @summary 当线是90,270度
     * @returns boolean
     */
    yinline : function(evty){ //y 在线的区域，多用于竖直线
		var one=Math.abs(evty-this.first.y)+Math.abs(evty-this.last.y)==Math.abs(this.last.y-this.first.y)
		// var sec=evty!=this.first.y&&evty!=this.last.y;
		return one;
	},
    /**
     * 获取线段长度
     * @returns number
     */
	getlength :function(){
		return Dm.accountlength(this.first,this.last);
	},
     /**
     * 判断输入的2个点相等
     * @returns boolean
     */
	sameapoint :function(first,last){
		return first.x==last.x&&first.y==last.y;
	},
	
	getotherpoint:function(point){
		if(this.first.x==point.x&&this.first.y==point.y){
			return {
				point:this.last,
				orient:"last"
			};
		}else if(this.last.x==point.x&&this.last.y==point.y){
			return {
				point:this.first,
				orient:"first"
			};
		}
		return {};
	},
	getcenterp : function(first,last){
		var firstp=first?first:this.first;
		var lastp=last?last:this.last;
		return {x:(firstp.x+lastp.x)/2,y:(firstp.y+lastp.y)/2};
	},
	xnearline : function(evtx,dis){
		var first,last;
		if(this.first.x<this.last.x){
			first=this.first.x-dis;
			last=this.last.x+dis;				
		}else{
			first=this.last.x-dis;
			last=this.first.x+dis;
		}
		var one=Math.abs(evtx-first)+Math.abs(evtx-last)==Math.abs(last-first);
		return one;
	},
	dataclone : function(first,last,indexnum,onedata){  //在wall 里面被覆盖了
		var newdata;
		if(onedata){
			newdata={first:onedata.first, // 显示 ，打断 line
				last:onedata.last,
				datatype:onedata.datatype,
				angle:onedata.angle,
				linecolor:onedata.linecolor,
				linesize:onedata.linesize,
				linedom:onedata.linedom,
				indexnum:onedata.indexnum
			};
			newdata=this.dataother(newdata,onedata);
		}else{  //专用于 breakline
			newdata={first:first,
				last:last,
				centerp:this.getcenterp(first,last),
				linecolor:this.linecolor,
				basicangle:this.basicangle,
				halfsize:this.gethalfsize(first,last),
				indexnum:indexnum,
				typeid:this.getlinedom().typeid,
				roomnum:this.roomnum
			};
			newdata.modaldata=this.dataother({},this.modaldata);
		}
		return newdata;
	},
	dataother:function(newa,olda){ // 从库里带的其他数据
		//注意 name 要按照type生成
		//type 要画 双开门的时候用
		var arr=["type","modelPath","picturePath","isIntersectWall",
		"isVisable","wallFace",
		"isDoorMirror","isOuterWall","isMainDoor","decType"];
		for(var i in arr){
			var one=arr[i];
			newa[one]=olda[one];
		}
		return newa;
	},
	deletefromstage:function  (stage) {
		createjs.Stage.prototype.removeChild.apply(stage,this.getShape());
	},
	ynearline : function(evty,dis){
		var first,last;
		if(this.first.y<this.last.y){
			first=this.first.y-dis;
			last=this.last.y+dis;				
		}else{
			first=this.last.y-dis;
			last=this.first.y+dis;
		}
		var one=Math.abs(evty-first)+Math.abs(evty-last)==Math.abs(last-first);
		return one;
	},
	samealine : function(otherline){
		if(this.first.x==otherline.first.x&&this.first.y==otherline.first.y&&this.last.x==otherline.last.x&&this.last.y==otherline.last.y)
			return true;
		return false;
	},
	setlinedom : function(typeid,typename){
		// this.linedom.=;
		if(!this.linedom){
			this.linedom={};
		}
		this.linedom.typeid=typeid;
		this.linedom.typename=typename;
	},
	drawLine : function(){

	},
	gethalfsize : function(first,last){
		var firstp=first?first:this.first;
		var lastp=last?last:this.last;
		var widthlen=Dm.accountlength(firstp,lastp)/2;
		var heightlen=this.linesize/2;
		return {wl:widthlen,hl:heightlen};
	},
	setFLpos : function(first,last,basicangle){
		this.first={
			x:first.x,
			y:first.y
		};
		this.last={
			x:last.x,
			y:last.y
		};;
		this.basicangle=basicangle;
		this.drawLine();
	},
	getlinedom : function(){
		if(this.linedom.typeid&&!this.linedom.typename){
			var type={
				0:"直墙",
				2:"弧墙",
				3:"单开门",
				4:"双开门",
				5:"推拉门",
				6:"平开窗",
				7:"飘窗"
			};
			this.linedom.typename=type[this.linedom.typeid];
		}
		return this.linedom;
	},
	nearflpoint : function(onep,nearradius){
		if(Wallsarray.prototype.nearonepoint.call(this,onep,this.first,nearradius)) return 1;
		else if(Wallsarray.prototype.nearonepoint.call(this,onep,this.last,nearradius)) return 2;
		else return 0;
	},
	pressapoint : function(type,nextpoint){ //按下一个点，改变
		// var changepoint=type==1?this.first:this.last;
		// var cl=this.changelen(changepoint,nextpoint);
		// if(this.first.x!=this.last.x){
		// 	changepoint.x=nextpoint.x;
		// 	changepoint.y+=cl.xl*Math.tan(this.basicangle);
		// }else{
		// 	changepoint.y=nextpoint.y;
		// }
		// this.drawLine();
	},
	changelen : function(oldpoint,nextpoint){
		return {xl:nextpoint.x-oldpoint.x,yl:nextpoint.y-oldpoint.y};
	},
	getapoint : function(evtx,evty){ //door 、windowline 靠近的点位置
		var point={x:0,y:0};
		if(this.angle<45&&evtx){ //注意每次只有一个参数用到~  
			point.x=evtx;  
			point.y=(this.last.y-this.first.y)/(this.last.x-this.first.x)*(point.x-this.first.x)+this.first.y;
		}else if(this.angle>=45&&evty){
			point.y=evty;
			point.x=(this.last.x-this.first.x)/(this.last.y-this.first.y)*(point.y-this.first.y)+this.first.x;
		}
		return point;
	},
	accountparallel : function(dis,orient,angle,first,last){  //angle 必须是右下左上的pi

		var usefirst=first?first:this.first;
		var uselast=last?last:this.last;
		var useangle=angle?angle:this.basicangle;
		useangle=useangle+Math.PI/2;
		var ychange=dis*Math.sin(useangle);
		var xchange=dis*Math.cos(useangle);
		var line={first:{},last:{}};
		if(orient==2){ //向着后方
		//1 是向着前方的     
			xchange=(-xchange);
			ychange=(-ychange);
		}
		line.first.x=usefirst.x+xchange;
		line.first.y=usefirst.y+ychange;
		line.last.x=uselast.x+xchange;
		line.last.y=uselast.y+ychange;
		return line;
	},
    clear : function(){
        for(var one in this.shapes){
        	this.shapes[one].graphics.clear();
        }
    },
	drawhitbox : function(width){ //
		// this.hitbox.graphics.clear().beginFill("rgba(0,0,0,0.01)").drawRect(0, 0,this.width,this.height); 
		// this.hitbox.graphics.clear().beginFill("red").drawRect(0, 0,this.width,this.height); 
	},
	getbasicshape : function(){
		return this.hitbox;
	}
}

module.exports=beeline;
/*
	墙
	具体的画步骤:draft,
	线:Wall, 原来是Line
	鼠标事件:mouse,

	管理标尺  Staffwall.set  二级标尺 还有   门分墙的标尺

	墙体擦除
		this.clear 
	墙体删除（撤销，恢复里的）
		walls.deleteone
	墙体删除（删除数据，用在断墙里）
		this.deletefromstage 


	可能会有坑
		wall 没有绑定 staffwall 这是个坑
		注意没有销毁原来的 this.wall 属性
		app 和 wall , windowline 数据不统一.
			app要保证 至少 个数，有没有这个door 是准确的。
		切忌给 first last 赋引用值

	废弃  
		0803版本 有自己的 getsubline
*/
var Beeline = require('../com/beeline');

var stylepen = require('../style-pen');

/**


* @constructor Wall
* @summary 墙线
* @description 必须new实现。<br/>stage在 getShape 传入为 this.stage
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
* @param {object} modaldata 附带的墙贴纸等数据，在已有完整json里得到
* @augments Beeline


*/

function Wall(first,last,linecolor,linesize,changecolor,basicangle,piangle,linedom,linelength,roomnum,modaldata){

	//使用需要计算        
   	Beeline.call(this,first,last,linecolor,linesize,changecolor,basicangle,piangle,null,linelength,roomnum);
    // this.middlepoint;
    // this.linelength;
	this.basicangle=basicangle; 

	this.first=first?{
		x:first.x,
		y:first.y
	}:{}; //左上开始顺时针
	this.last=last?{
		x:last.x,
		y:last.y
	}:{};
    this.linedom =linedom?{typeid:linedom.typeid,typename:linedom.typename}:{};

    this.lineshape=new createjs.Shape(); //shape; 所有涉及shape注意深度复制
    this.name="wall";
    this.lineshape.name="wall";


    this.measureshape=new createjs.Shape();
    this.measuretext=new createjs.Text("ddd", "14px Arial", "#000");
    this.measuretext.textBaseline = "ideographic";
    this.measureshape.visible=false;
    this.measuretext.visible=false;
    this.pixellen; 
    this.modaldata=modaldata?modaldata:{};


    this.shapes={
    	measureshape:this.measureshape,
    	lineshape:this.lineshape
    }
    this.shapes.lineshape.mzshape=this;
    this.hitbox=new Hitbox(this,this.shapes.lineshape);

    this.hasexist=true; // 用来判断 是否被 删除了

    this.isDown=true; // 此时 getsubline 是 true

    // this.isXDown=false;
    // this.isYDown=false;

    this.doors=[]; // 命名符合一定规则，可以依赖编程
    this.doorsnum=0;
    this.windowlines=[];
    this.windowlinesnum=0;
    this.apps=[];
    this.appsnum=0;

    this.hasfirstclick=false;

    this.lineheight=2800*pixerate; //墙高 ，现在都是固定的值 

    this.vectorbymiddle={ //房间 中心 ，到 终点的向量
    }
    
    this.staffwall=new Staffwall(this);

    this.breakarr=[]; //被门窗隔开后的点数组


    this.stagefun;  //在getshape 初始化这个值
    this.stage;
 
/*
	END 算法需要的属性
*/
}

var aBeeline =  new Beeline();

/*START 添加的其他原型方法*/
aBeeline.getName=function(){
  return this.name;
}
// ...
/*END 添加的其他原型方法*/


Wall.prototype= aBeeline;
module.exports=Wall;





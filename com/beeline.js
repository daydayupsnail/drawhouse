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
function Beeline(first,last,linecolor,linesize,changecolor,basicangle,piangle,linedom,linelength,roomnum){
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

		
		
       
}

Beeline.prototype={
	pixelRate :　1,
	// staffshape.pixelRate,
    /**
     * 输入x判断在 first 和last 之间
     * @summary 当线不是90,270度
     * @returns boolean
     * @memberof Beeline.prototype
     */
	xinline : function(evtx){ //x 在线的区域，多用于水平线
    	var one=Math.abs(evtx-this.first.x)+Math.abs(evtx-this.last.x)==Math.abs(this.last.x-this.first.x);
		return one;
	},
    other:function(){
      //... 省略了若干基础方法
    }
}

module.exports=Beeline;
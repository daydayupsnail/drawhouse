var Dm=require("./common"),
	stylepen = require('../style-pen');

var obj={};
var stagefun,
	stage,
	spotstyle=stylepen.spotstyle;

/**

* @constructor 
* @summary 线段集合类
* @alias Beelines
* @description 必须new实现。<br/>描述了线段与数组有关的操作<br/>只能在工程中创建一个，传递引用值
* @param {string} linecolor 线段颜色，基本没用到
* @param {string} linesize 线段粗细，基本没用到

*/
function Beelines(linecolor,linesize){                            
	this.lines=[];
	this.linecolor=linecolor;
	this.linesize=linesize;
	this.length=this.lines.length;
	this.num=0; //这个 是只会增加不会变少的
	this.name="linesarray";
	this.childname="line";
	

	this.stagefun;
	this.stage;

}
Beelines.prototype={
    get : function(num){
		for(var i in this.lines){
			var oneline=this.lines[i];
			if(oneline.indexnum==num)
				return oneline;
		}  //由于有删除功能，不能用length，indexnum 不是顺序号
		return null;
	},
    clone : function () {
		var alinesarray = new Beelines();
		var i=0,ti=this.lines.length;
		while(i<ti){
			var oldone=this.lines[i];
			var newone=oldone.clone(oldone.indexnum);
			alinesarray.push(newone);
			i++;
		}
		return alinesarray;
	}
    clearalllines : function(){
		//不能重新生成新变量
		//在breakwall 用
		var i=this.lines.length;
		while(i--){
			this.lines.pop();
		}
	},
    other : function(){
      /*
        省略了
        处理添加，删除，更新线的一些代码。
        按照特定规则获取一些线。
        ...
      */
    }
};
module.exports=function(){
	obj.shape=Beelines;
	return obj;
};

/**
 * @file 运行入口函数，阐明了主体逻辑
*/
var PageEvent = require('./page/main.js'),
	StageMain=require('./vessel/stage-main.js'),
	StageSize=require('./vessel/stage-size.js'),
	DataJson = require('./data/data-json.js'),
	DataHistory = require('./data/data-history.js'),
	Datas = require('./data/datas.js'),
	Getdata=require("./data/getdata.js");



/*START 实例化*/
var datas=Datas;

//舞台页面的依赖 
/**
 * @file step1.初始化页面函数。
 * {@link module:page/main}
*/
var pageevent = PageEvent(Getdata),
	stagefun = StageMain(Datas,stagefunid,pageevent.event) //主要的舞台
	mainstage= stagefun.stage;
PageEvent.addmdata(datas.getlines());

//左侧舞台 旋转，缩放
var stagesize=StageSize(stagesizeid,stagefun);




// datas 不能传递自身了，不然就会重新复制
//注入json画图数据
var datajson = DataJson(datas.getlines(),stagefun);
/*	传递
	stagefun--
	stage
	wallsarray 
	doorsarray
	windowlinesarray 
	
	datajson--
	dataHistory 
*/


//引入画笔的历史库
var	dataHistory = DataHistory(datas.getlines(),stagefun);
/*	传递
	stagefun--
	stage
	wallsarray 
	doorsarray
	windowlinesarray 
	
	dataHistory--
	dataHistory 直接就是数组
*/

/*END 实例化*/

/*
	交互处理
*/
var states={
	"smart":{
		"fun":datajson.tojsonaffiars
	},
	// "initdata":{
	// 	"fun":mainstage.addback;  //这个是外部调用的
	// }
};
PageEvent.addstates(stagefun.states);
PageEvent.addstates(datajson.states);
PageEvent.addstates(dataHistory.states);
PageEvent.addstates(states);


//开始运行、
var run=function(){
  stagefun.run();
  pageevent.run(stagefun);
  datajson.run();
}

run();


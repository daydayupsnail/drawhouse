/*
	对画笔样式的控制
*/
var style={
	"basicpensize":4,   
	"windowstyle":{
		"color":"#000",
		"size":this.basicpensize,
		"len":48,
		"changecolor":"red",
		"inlinegap":2
	},"doorstyle":{
		"color":"#000",
		"size":this.basicpensize,
		"len":48,
		"changecolor":"red"
	},"wallstyle":{
		"color":"#000",
		"size":"basicpensize",
		"len":48,
		"changecolor":"red"
	},"spotstyle":{//画笔落得点  
		"color":"#ccc",  
		"size":5,  
	},"closeddis":{ // 各种接近的距离
		"line":10  
	}
}
module.exports=style;
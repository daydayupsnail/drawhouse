# drawhouse
画户型图墙线代码示意。

##
使用了createjs，gulp，代码遵循commonjs规范进行模块化,按照jsdoc规范进行了注释。

### 代码结构

main文件是整体的入口。引入了页面的主模块page/main，主要舞台vessel/stage-main，处理户型图数据的模块data/data-json，历史画笔模块data/data-history等。在依次实例化后，注册彼此的依赖关系,然后运行程序。

stage-main实例化时，注册多个层次结构，例如level-main。在addlevel的函数中，会把level的各种event事件，绑定到stage-main上。level-main实例化时，会触发墙线的实例化。

墙线的继承关系为 <br/>
beeline（基础线）->wall（没有事件的墙线）->wallevt（拥有绑定独立事件的墙线）<br/>
beelines（基础线集合）->walls（墙线集合，基本元素是wallevt）

### 优化
更深层次的使用观察者模式，优化不同结构间触发响应的依赖关系。
目录结构可以更加细化。
有更好的想法，欢迎一起讨论
O(∩_∩)O 

### 代码未包含的内容
代码不能独立运行，缺少很多依赖模块。
墙线代码中还包括，贴近规则，标尺等结构。
门窗等模块，与墙线相同，继承自beeline的相应模块。


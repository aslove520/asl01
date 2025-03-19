var game = {
    pass : [    //每一关的数据
        {
            maps : [
                1,1,3,3,3,3,1,1,						
                1,1,3,2,2,3,1,1,
                1,3,3,0,2,3,3,1,
                1,3,0,0,0,2,3,1,
                3,3,0,0,0,0,3,3,
                3,0,0,3,0,0,0,3,
                3,0,0,0,0,0,0,3,
                3,3,3,3,3,3,3,3
            ],
            cols : 8,
            boxs : [
                { x : 4 , y : 3 },
                { x : 3 , y : 4 },
                { x : 4 , y : 5 },
                { x : 5 , y : 5 }
            ],
            person : { x : 3 , y : 6 }
        },
        {
            maps : [
                1,1,1,1,3,3,3,3,3,3,3,1,
                1,1,1,1,3,0,0,3,0,0,3,1,
                1,1,1,1,3,0,0,0,0,0,3,1,
                3,3,3,3,3,0,0,3,0,0,3,1,
                2,2,2,3,3,3,0,3,0,0,3,3,
                2,0,0,3,0,0,0,0,3,0,0,3,
                2,0,0,0,0,0,0,0,0,0,0,3,
                2,0,0,3,0,0,0,0,3,0,0,3,
                2,2,3,3,3,3,0,3,0,0,3,3,
                3,3,3,3,3,0,0,0,0,0,3,1,
                1,1,1,1,3,0,0,3,0,0,3,1,
                1,1,1,1,3,3,3,3,3,3,3,1
    
            ],
            cols : 12,
            boxs : [
                {x : 5 , y : 6},
                {x : 6 , y : 3},
                {x : 6 , y : 5},
                {x : 6 , y : 7},
                {x : 6 , y : 9},
                {x : 7 , y : 2},
                {x : 8 , y : 2},
                {x : 9 , y : 6}
            ],
            person : { x : 5 , y : 9 }
        }
    
    ],
    now:0,
    gridSize:50,
// init() - 初始化函数：
// 调用其他函数来设置游戏的初始状态，包括元素的创建、地图的生成、箱子和角色的创建以及绑定键盘操作。
    init:function(){
        this.elements();
        this.createMap();
        this.createBox();
        this.createPerson();
        this.bindPerson();
    },
// resetState() - 重置状态函数：
// 清空游戏界面并移除键盘事件监听，以便重新初始化游戏。
// elements() - 元素接收函数：
// 设置游戏所需的元素和数据，如游戏地图、列数、箱子位置、角色位置等。
    elements:function(){
        this.$main=$("#main");
        this.$person=null;
        this.$box=null;
        this.$pos2=null;
        this.maps = this.pass[this.now].maps;
        this.cols = this.pass[this.now].cols;
        this.boxs = this.pass[this.now].boxs;
        this.person = this.pass[this.now].person;
    },
// createMap() - 创建地图函数：
// 根据 maps 数组生成游戏地图的HTML元素，每个元素对应地图上的一个格子。
    createMap:function(){
        this.$main.css("width",this.cols*this.gridSize);
        $.each(this.maps,$.proxy(function(i,v){
            var $div = $('<div>');
            $div.attr('class','pos'+v);
            this.$main.append($div);
        },this));
        this.$pos2 = this.$main.find('.pos2')
    },
// createBox() - 创建箱子函数：
// 根据 boxs 数组生成箱子的HTML元素，设置箱子的初始位置。
    createBox:function(){
        $.each(this.boxs,$.proxy(function(i,v){
            var $div = $('<div>');
            $div.attr('class','box');
            $div.css('left',v.x*this.gridSize);
            $div.css('top',v.y*this.gridSize);
            this.$main.append($div); 
        },this));
        this.$box = this.$main.find(".box");
    },
// createPerson() - 创建人物函数：
// 创建并设置玩家角色的HTML元素，包括其初始位置。
    createPerson:function(){
            var $div = $('<div>');
            $div.attr('class','person');
            $div.css('left',this.person.x*this.gridSize);
            $div.css('top',this.person.y*this.gridSize);
            this.$main.append($div); 
            this.$person = $div;
    },
// bindPerson() - 绑定人物操作函数：
// 绑定键盘事件，根据玩家按键操作来控制角色移动。
    bindPerson:function(){
        $(document).on("keydown",$.proxy(function(ev){
            switch(ev.keyCode){
                case 37: //左
                case 65: //a
                    this.$person.css('backgroundPosition','-150px 0');
                    this.movePerson({x:-1,y:0});
                    console.log("左");
                    break;
                case 38: //上
                case 87: //w
                    this.$person.css('backgroundPosition','-150px 0');
                    this.movePerson({x:0,y:-1});
                    break;
                case 39: //右
                case 87: //d
                    this.$person.css('backgroundPosition','-150px 0');
                    this.movePerson({x:1,y:0});
                    break;
                case 40: //下
                case 83: //s
                    this.$person.css('backgroundPosition','-150px 0');
                    this.movePerson({x:0,y:1});
                    break;
            }
        },this));
    },
// movePerson(opts) - 移动人物函数：
// 根据传入的选项（如 {x: -1, y: 0} 表示向左移动）来更新角色的位置，并检查是否撞墙或推动箱子。
    movePerson:function(opts){  //移动箱子
        if(!this.isWall(opts) ){
            this.person.x +=opts.x;
            this.person.y +=opts.y;
            this.$person.css('left',this.person.x * this.gridSize);
            this.$person.css('top',this.person.y * this.gridSize);
        }
        this.moveBox(opts);
        if(this.isNextPass() ){
            this.now++;
            this.init();
        }
    },
// isWall(opts) - 判断是否是墙函数：
// 检查角色尝试移动的方向是否有墙壁阻挡。
    isWall:function(opts){
        var num = this.maps[(this.person.y+opts.y)*this.cols+(this.person.x+opts.x)];
        return num == 3?true:false;
    },
// moveBox(opts) - 移动箱子函数：
// 检查角色是否推动箱子，并相应地更新箱子的位置。同时检查是否有其他箱子阻碍移动。
// isNextPass() - 是否进入下一关函数：
// 检查所有箱子是否都已推到目标位置，如果是，则允许玩家进入下一关。
};
game.init();




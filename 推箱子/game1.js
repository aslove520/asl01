
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
    now : 0,   //初始关卡
    girdSize : 50,  //网格大小
    init : function(){   //初始化
        this.elements();
        this.resetState();
        this.createMap();
        this.createBox();
        this.createPerson();
        this.bindPerson();
    },
    resetState : function(){   //还原初始状态
        this.$main.empty();
        $(document).off('keydown');
    },
    elements : function(){   //接收元素和数据
        this.$main = $('#main');
        this.$person = null;
        this.$box = null;
        this.$pos2 = null;
        this.maps = this.pass[this.now].maps;
        this.cols = this.pass[this.now].cols;
        this.boxs = this.pass[this.now].boxs;
        this.person = this.pass[this.now].person;
    },
    createMap : function(){   //创建地图
        this.$main.css('width', this.cols * this.girdSize );
        $.each(this.maps,$.proxy(function(i,v){
            var $div = $('<div>');
            $div.attr('class','pos'+v);
            this.$main.append($div);
        },this));
        this.$pos2 = this.$main.find('.pos2');
    },
    createBox : function(){   //创建箱子
        $.each(this.boxs,$.proxy(function(i,v){
            var $div = $('<div>');
            $div.attr('class','box');
            $div.css('left' , v.x * this.girdSize);
            $div.css('top' , v.y * this.girdSize);
            this.$main.append($div);
        },this));
        this.$box = this.$main.find('.box');
    },
    createPerson : function(){   //创建人物
        var $div = $('<div>');
        $div.attr('class','person');
        $div.css('left',this.person.x * this.girdSize);
        $div.css('top',this.person.y * this.girdSize);
        this.$main.append($div);
        this.$person = $div;
    },
    // bindPerson() - 绑定人物操作函数：
    // 绑定键盘事件，根据玩家按键操作来控制角色移动。
    bindPerson: function(){
        $(document).on("keydown",$.proxy(function(ev){
            switch(ev.keyCode){
                case 37:  // 左  
                case 65:  // a
                    this.$person.css('backgroundPosition',"-150px 0");
                    this.movePerson({x:-1,y:0});
                    console.log("左");
                    break;
                case 38:  // 上
                case 87:  // w
                    this.$person.css("backgroundPosition",'0 0');
                    this.movePerson({x:0,y:-1});
                    break;
                case 39:  // 右
                case 88:  // d
                    this.$person.css("backgroundPosition","-50px 0");
                    this.movePerson({x:1,y:0});
                    break;
                case 40:  // 下
                case 83:  // s
                    this.$person.css("backgroundPosition","-100px 0");
                    this.movePerson({x:0,y:1});
                    break;
            }
        },this));
    },
    
    // movePerson(opts) - 移动人物函数：
    // 根据传入的选项（如 {x: -1, y: 0} 表示向左移动）来更新角色的位置，并检查是否撞墙或推动箱子。   
    movePerson : function(opts){   //移动人物
        if( !this.isWall(opts) ){
            this.person.x += opts.x;
            this.person.y += opts.y;
            this.$person.css('left',this.person.x * this.girdSize);
            this.$person.css('top',this.person.y * this.girdSize);
        }
        this.moveBox(opts);
        if( this.isNextPass() ){
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
    moveBox : function(opts){    //移动箱子
        this.$box.each($.proxy(function(i,elem){
            if( this.pz( this.$person , $(elem) ) && !this.isWall(opts) ){
                $(elem).css('left' , (this.person.x + opts.x)*this.girdSize);
                $(elem).css('top' , (this.person.y + opts.y)*this.girdSize);
                this.$box.each($.proxy(function(j,elem2){ 
                    //判断两个箱子是否挨着
                    if( this.pz( $(elem) , $(elem2) ) && elem != elem2 ){
                        $(elem).css('left' , this.person.x*this.girdSize);
                        $(elem).css('top' , this.person.y*this.girdSize);
                        this.person.x -= opts.x;
                        this.person.y -= opts.y;
                        this.$person.css('left' , this.person.x * this.girdSize);
                        this.$person.css('top' , this.person.y * this.girdSize);
                    }	
                },this));
            }
            else if( this.pz( this.$person , $(elem) ) ){
                this.person.x -= opts.x;
                this.person.y -= opts.y;
                this.$person.css('left' , this.person.x * this.girdSize);
                this.$person.css('top' , this.person.y * this.girdSize);
            }
        },this));
    },
    // isNextPass() - 是否进入下一关函数：
    // 检查所有箱子是否都已推到目标位置，如果是，则允许玩家进入下一关。
    isNextPass:function(){
        var count = 0;
        this.$box.each($.proxy(function(i,elem){
            this.$pos2.each($.proxy(function(j,elem2){
                if(this.pz($(elem),$(elem2))){
                    count++;
                }
            },this));
        },this));
        if(count == this.$box.length){
            return true;
        }else 
            return false;
    },    
    // pz(elem1,elem2) - 碰撞检测函数：
    // 检测两个元素（如角色和箱子或箱子和目标位置）是否发生碰撞
    pz: function($elem1,$elem2){
        var L1 = $elem1.offset().left;
        var R1 = $elem1.offset().left+$elem1.width();
        var T1 = $elem1.offset().top;
        var B1 = $elem1.offset().top+$elem1.height();
        var L2 = $elem2.offset().left;
        var R2 = $elem2.offset().left+$elem2.width();
        var T2 = $elem2.offset().top;
        var B2 = $elem2.offset().top+$elem2.height();
        if(R1<=L2||L1>=R2||B1<=T2||T1>=B2){
            return false;
        }else 
            return true;
    },   

};
game.init();


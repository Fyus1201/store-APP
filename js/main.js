/**
 * Created by Fyus on 16/10/16.
 */


(function(){
    //加载
//$.showPreloader("加载中");
//setTimeout(function () {
//    $.hidePreloader();
//}, 2000);

//下拉刷新
    $(document).on("refresh", ".pull-to-refresh-content",function(e) {
        setTimeout(function() {
            $.pullToRefreshDone(".pull-to-refresh-content");
            location.reload();
        }, 500);
    });

//滚动加载
    var loading = false;
    var maxItems = 50;
    var itemsPerLoad = 20;
    var lastIndex = 20;

    function addItems(number, lastIndex) {
        for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
        }
        $.ajax({
            type: "GET",
            url: "./data/groupList.json",
            data:"fyus",
            async: true,
            dataType: "json",
            timeout: 300,

            success: function(data){

                //console.log(JSON.stringify(data.data));
                var json = JSON.parse(JSON.stringify(data.data));
                //var json = eval('\''+data.data+'\'');
                //var json = data.data;
                var itemData = function(data) {
                    return JSON.stringify(data);
                };
                juicer.register('item_data', itemData); //注册自定义函数

                var tpl0 = document.getElementById("group_list").innerHTML;
                $(".maxW").append(juicer(tpl0, json));
            },
            error: function(xhr, type){
                alert("读取失败");
            }
        });

    }
    addItems(itemsPerLoad, 0);

//滚动事件
    $(document).on("infinite", ".infinite-scroll",function() {

        // 如果正在加载，则退出
        if (loading) return;
        // 设置flag
        loading = true;

        setTimeout(function() {
            loading = false;

            if (lastIndex >= maxItems) {
                $.detachInfiniteScroll($(".infinite-scroll"));
                $(".infinite-scroll-preloader").remove();

                var tpl1 = document.getElementById("group_last").innerHTML;
                $(".maxW").append(tpl1);

                return;
            }

            addItems(itemsPerLoad, lastIndex);
            lastIndex = $(".maxW li").length;
        }, 1000);
    });

//倒计时 时间
    var date = {
        randomdate:0,
        len:20,
        time1:$(".time-1 li"),
        time2:$(".time-2 li"),
        time3:$(".time-3 li"),
        time4:$(".time-4 li"),
        time5:$(".time-5 li"),
        time6:$(".time-6 li"),
        time: function() {
            var self = this;
            var timeindex1 = 0,
                timeindex2 = 0,
                timeindex3 = 0,
                timeindex4 = 0,
                timeindex5 = 0,
                timeindex6 = 0;
            if(!self.randomdate){
                self.randomdate = parseInt(Math.random()*24*60*60);

                timeindex1 = parseInt(self.randomdate/36000);
                timeindex2 = parseInt(self.randomdate%36000/3600);
                timeindex3 = parseInt(self.randomdate%3600/600);
                timeindex4 = parseInt(self.randomdate%600/60);
                timeindex5 = parseInt(self.randomdate%60/10);
                timeindex6 = self.randomdate%10;
            }else{
                timeindex1 = parseInt(self.randomdate/36000);
                timeindex2 = parseInt(self.randomdate%36000/3600);
                timeindex3 = parseInt(self.randomdate%3600/600);
                timeindex4 = parseInt(self.randomdate%600/60);
                timeindex5 = parseInt(self.randomdate%60/10);
                timeindex6 = self.randomdate%10;
            }

            self.time1.animate({top: -timeindex1 * self.len + "px"}, 100, function(){});
            self.time2.animate({top: -timeindex2 * self.len + "px"}, 100, function(){});
            self.time3.animate({top: -timeindex3 * self.len + "px"}, 100, function(){});
            self.time4.animate({top: -timeindex4 * self.len + "px"}, 100, function(){});
            self.time5.animate({top: -timeindex5 * self.len + "px"}, 100, function(){});
            self.time6.animate({top: -timeindex6 * self.len + "px"}, 100, function(){});

            self.randomdate--;
        }

    };
//计时
    var slide = setInterval(function() {
        date.time();
    }, 1000);


//最上图片滚动
    var slidertop = {
        index: 0,
        len: 800,
        el: $(".swiper-ul"),
        qiu:$(".xiaoyuan li"),
        slide: function() {
            var self = this;


            var left = ++self.index * $(".swiper-ul li").width();

            //self.el.stop(true,true);
            self.el.animate({left: -left + "px"}, 550, function() {
                if (self.index >= 4) {
                    self.index = 0;
                    self.el.css("left", 0);
                }
                self.qiu.removeClass("xiaoyuan1");
                $(self.qiu[self.index]).addClass("xiaoyuan1");
            });
        }
    };
//上转轮动画
    var slideh = setInterval(function() {
        slidertop.slide();
    }, 5000);
//选择上滚动
    $(".xiaoyuan li").click(
        function(){
            slidertop.index = $(this).index()-1;
            slidertop.slide();
        }
    );
//购买事件
    $(document).on("click", ".groupBuy",function(e) {
        e.preventDefault();
        e.stopPropagation();

        var sun = parseInt($(".badge").text());
        $(".badge").text(sun+1);
        $(this).parent().siblings(".item-media").find("img").addParabola(".icon-cart");
        var product=JSON.parse($(this).data("obj"));
        console.log(product);
    });
//加入购物车
//    $(document).on("click",".product-shopope-box",function(e){
        //e.preventDefault();
        //e.stopPropagation();
        //var product=JSON.parse($(this).data("obj"));
        //var carProduct = new CarProduct(product.serial, product.name, product.price, product.spec, product.brand, product.smallpic, product.productType, 1);
        //shopCar.add(carProduct);
        //addProduct(e,product);

    //});

    /** 添加抛物线动画 */
    $.fn.addParabola = function(targetID,options){
        var defaults = {
            speed: 146.67, // 每帧移动的像素，每帧（对于大部分显示屏）大约16~17毫秒
            curvature: 2000/($(document).width()*$(document).width()),  //通过宽度自动计算，抛物线曲线
            progress: function(){
                $.noop();
            },
            complete: function(){
                $.noop();
            }
        };
        var sets = $.extend(defaults,options || {});
        var a = sets.curvature,
            b = 0,
            c = 0;
        var target = $(targetID);
        var that,thatImg;

        var moveStyle = "margin",
            testDiv = document.createElement("div");
        if ("oninput" in testDiv) {

            ["", "-ms-", "-webkit-"].forEach(
                function(prefix) {
                    var transform = prefix + (prefix? "T": "t") + "ransform";
                    if (transform in testDiv.style) {
                        moveStyle = transform;
                    }
                }
            );
        }
        // 标志量
        var flagMove = true;

        // 目标位置
        var targetXY = {};
        // 当前位置
        var currentXY = {};


        var d=new Date();
        var thatImgClassName = "thatImg-"+d.getTime();

        // 产生
        var position = function() {
            if (flagMove == false) return this;

            target.append(thatImg);
            //$(".bar-tab").append(thatImg);

            targetXY = {
                x: target.offset().left,
                y: target.offset().top
            };
            currentXY = {
                x: $(that).offset().left-target.offset().left,
                y: $(that).offset().top-target.offset().top

            };

            if (moveStyle == "margin") {
                target.find("img").last().css({marginLeft:currentXY.x+"px",marginTop:currentXY.y+"px"});
            } else {
                target.find("img").last().css(moveStyle,"translate("+currentXY.x+"px,"+currentXY.y+"px)");
            }

            b = (currentXY.y - a * currentXY.x * currentXY.x) / currentXY.x;

            sets.speed = Math.sqrt(currentXY.x*currentXY.x +currentXY.y*currentXY.y)/10;
            move();
            return this;
        };
        // 运动
        var move = function() {
            // 如果曲线运动还没有结束，不再执行新的运动
            if (flagMove == false) return this;

            var startx = currentXY.x,
                scaleXY = 1,
                opacityXY = 1,
                radiusXY = 0,
                rate = currentXY.x > 0? -1: 1;

            var step = function() {
                // 切线 y'=2ax+b
                var tangentY = 2 * a * startx + b; // = y / x
                // y*y + x*x = speed
                // (tangentY * x)^2 + x*x = speed
                //x = Math.sqr(speed / (tangentY * tangentY + 1));
                startx = startx + rate * Math.sqrt(sets.speed / (tangentY * tangentY + 1));
                var thatImgClass = "."+thatImgClassName;

                if(scaleXY<0.3){
                    opacityXY = startx*0.8/currentXY.x;
                }else if(scaleXY<0.7){
                    opacityXY = startx*1.4/currentXY.x;
                }else{
                    opacityXY = 1;
                    radiusXY = 100*(1-startx/currentXY.x)/0.3;
                }

                if(scaleXY>0.3){
                    scaleXY = startx/currentXY.x;
                }

                // 防止过界
                if ((rate == 1 && startx > 0) || (rate == -1 && startx < 0)) {
                    startx = 0;
                }
                var x = startx,
                    y = a * x * x + b * x;

                // x, y目前是坐标，需要转换成定位的像素值
                if (moveStyle == "margin") {
                    target.find(thatImgClass).css({marginLeft:x+"px",marginTop:y+"px"}).css({"opacity":opacityXY,"border-radius":radiusXY});

                } else {
                    target.find(thatImgClass).css(moveStyle,"translate("+x+"px,"+y+"px) scale("+scaleXY+","+scaleXY+")").css({"opacity":opacityXY,"border-radius":radiusXY});
                }


                if (startx !== 0) {
                    window.requestAnimationFrame(step);
                    sets.progress();
                } else {
                    flagMove = true;
                    target.find(thatImgClass).remove();
                    sets.complete();
                }

            };
            window.requestAnimationFrame(step);
            flagMove = false;
            return this;
        };

        return $(this).each(function() {

            if($(this).is("img")){
                that = this;
                thatImg = $(this).clone().prop("class",thatImgClassName);
                thatImg.addClass("itemClassimgMove");
                position();

            }else{
                console.log("请使用img");
            }

        });
    }
})()
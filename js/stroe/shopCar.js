/**
 * Created by Fyus on 16/11/6.
 */

!function(){
    //购物车内容
    var appItem=new AppItem();

    var itemsPerLoad = 10;

    //初始化
    function addItems(number, lastIndex) {
        //console.log(appItem.shopCarList);
        var tpl = document.getElementById("shopCar_list").innerHTML;
        $(".maxW").append(juicer(tpl, appItem));

        $(".badge").text(appItem.number);
        $(".shopCarSun-num").text("¥"+appItem.priceSubtotal);
    }
    addItems(itemsPerLoad, 0);

    //返回当前item信息
    var shopList_i = function(e){

        var i = $(e).parents("li").index();
        return appItem.shopCarList[i];

    };

    //删除一个商品
    var delShopCar = function(that){
        var itemArray = shopList_i(that);
        appItem.remove(itemArray,1);
        $(that).parents("li").remove();
        eachShopCarSun();
        $(".badge").text(appItem.number);

        if(appItem.shopCarList.length === 0){
            $(".maxW").children().remove();
            addItems(itemsPerLoad, 0);
        }
    };
    //遍历购物车 价格
    var eachShopCarSun = function(e){
        var shopCarSun = 0;
        $(".shopCarSun-num").text("¥"+shopCarSun);
        $("input[name='shopCarlist']").each(function(){
            if( $(this).prop("checked") === true){
                shopCarSun += shopList_i(this).priceSubtotal;
                $(".shopCarSun-num").text("¥"+shopCarSun);
            }
        });
    };
    eachShopCarSun();
    //遍历删除 选择商品
    var eachShopCarDel = function(e){

        $("input[name='shopCarlist']").each(function(){
            if( $(this).prop("checked") === true){
                delShopCar(this)
            }
        });
        $(".shopCarSun-num").text("¥0.00");
    };

    // 选择时
    $(document).on("click","input",function(){
        eachShopCarSun();
    });

    //增加  减少
    $(document).on("click",".addButton",function(){
        var n = $(this).siblings(".groupBuyNum-sun").val();
        $(this).siblings(".groupBuyNum-sun").val(++n);

        var itemArray = shopList_i(this);
        itemArray.number = n;
        appItem.change(itemArray);
        eachShopCarSun();
        $(".badge").text(appItem.number);
    });
    $(document).on("click",".delButton",function(){
        var n = $(this).siblings(".groupBuyNum-sun").val();
        //$(this).siblings(".groupBuyNum-sun").attr("value",--n);
        if(n > 1){
            $(this).siblings(".groupBuyNum-sun").val(--n);

            var itemArray = shopList_i(this);
            itemArray.number = n;
            appItem.change(itemArray);
            eachShopCarSun();
            $(".badge").text(appItem.number);
        }else{
            delShopCar(this);
        }
    });

    //数量改变
    var itemValue = null;
    $(".groupBuyNum-sun").focus(function(){
        itemValue = $(this).val();
        $(this).val("");

        var thisValue = $(this);
        var itemArray = shopList_i(this);
        $(document).on("keydown",this,function(){
            var e=e ? e : window.event;
            var currKey = e.keyCode||e.which||e.charCode;
            if((currKey>=96 && currKey<=105)||(currKey>=48 && currKey<=57)||currKey==8) {
                if(thisValue.val() === "0"){
                    thisValue.val("");
                }
            }else {
                return false;
            }
        });
        $(document).on("keyup",this,function(){
            if(isNaN(thisValue.val())||thisValue.val() === ""){

            }else{
                itemArray.number = thisValue.val();
                appItem.change(itemArray);
                eachShopCarSun();
                $(".badge").text(appItem.number);
            }

        });

    }).blur(function(){

        if( $(this).val() === ""){
            $(this).val(itemValue);
        }else if($(this).val() === "0"){
            delShopCar(this);
        }
    });


    //购买
    $(document).on("click",".suc",function(){
        console.log("购买");
    });
    //单个购买
    $(document).on("click",".groupBuy",function(){
        console.log("购买");
    });
    //删除
    $(document).on("click",".del",function(){
        eachShopCarDel()
    });



}();
/**
 * Created by Fyus on 16/10/21.
 */
var app = app || {};
(function(){

    app.ajax = function(options) {
        console.log("请求");
    };

})();
//购物车商品
var AppItem = function () {
    //构造对象时先持久化
    var appItem = this.get() || {};
    this.priceSubtotal = appItem.price || 0.00; //购物车内商品总价格
    this.number = appItem.number || 0; //总数量
    this.shopCarList = appItem.shopCarList || [];

    if (!appItem.number) {
        this.save(this);
    }
};

//获取数据
AppItem.prototype.get = function() {
    var item = decodeURIComponent(localStorage.getItem("shopCar"));
    return item && item !== "null" ? JSON.parse(item) : null;
};

//删增减
AppItem.prototype.add = function(carItem) {
    //判断购物车里是否有该商品,若有则数量+1,若无则push
    var _index = this.contain(carItem);

    var Item=this.shopCarList[_index];
    if (Item) {
        Item.number++;
        Item.priceSubtotal = parseFloat( (Item.number * Item.price).toFixed(2));
        console.log( Item.priceSubtotal);
    } else {
        this.shopCarList.push(carItem);
    }
    this.update(Item);
    this.save();
    return this;
};
AppItem.prototype.remove = function(carItem,isEmpt) {
    var _index = this.contain(carItem);

    var Item=this.shopCarList[_index];
    if(!Item){
        throw new Error("不存在的商品,无法移除!");
    }
    if(isEmpt){
        this.shopCarList.splice(_index,1);
    }
    //判断购物车里该商品数量,等于1则从购物车内remove掉
    else if(Item.number>1){
        //更改这里可支持一次性往购物车减少多件同类型商品，注意判断也要改
        Item.number--;
        Item.priceSubtotal =parseFloat(( Item.number * Item.price).toFixed(2));
    }else if(Item.number==1){
        this.shopCarList.splice(_index,1);
    }
    this.update(Item);
    this.save();
    return this;

};
AppItem.prototype.change=function(carItem){
    var _index = this.contain(carItem);
    var Item=this.shopCarList[_index];
    if(!Item){
        throw new Error("不存在的商品,无法更改数量!");
    }
    Item.number=parseInt(carItem.number);
    Item.priceSubtotal =parseFloat( (Item.number * Item.price).toFixed(2));
    this.update(Item);
    this.save();
    return this;

};
//判断是否存在商品
AppItem.prototype.contain = function(carItem) {
    var CartItemList = this.shopCarList;
    for (var i=0;i<CartItemList.length;i++) {
        if (CartItemList[i].orderNum === carItem.orderNum) {
            return i;
        }
    }
    return false;
};

// 更新数据到内存
AppItem.prototype.update = function(carItem) {
    var price = 0.00,
        num = 0;
    for (var i = 0, l = this.shopCarList.length; i < l; i++) {
        if (carItem&&this.shopCarList[i].orderNum === carItem.orderNum) {
            this.shopCarList[i] = carItem;
        }
        price += this.shopCarList[i].priceSubtotal;
        num += this.shopCarList[i].number;
    }
    //计算总价格和总数量
    this.price = parseFloat( price.toFixed(2));
    this.number = num;
    return this;
};
//数据持久化
AppItem.prototype.save = function(shopCar) {
    localStorage.setItem("shopCar", encodeURIComponent(JSON.stringify(shopCar || this)));
};
AppItem.prototype.clear=function(){
    localStorage.clear("shopCar");
};


//与数据库同步数据
AppItem.prototype.sync=function(latestItemList){
    var currentItemList=this.shopCarList;//当前本地存储中的商品
    for(var i=0;i<currentItemList.length;i++){
        //currentItemList[i]
        for(var j=0;j<latestItemList.length;j++){
            //latestItemList[j]
            if(currentItemList[i].orderNum==latestItemList[j].orderNum){
                //赋值是否过期信息
                currentItemList[i].valid=latestItemList[j].valid;
            }
        }
    }
    this.shopCarList=currentItemList;
    return this;
};
// 储存格式
var CarItem = function (orderNum, title, subtitle, text, smallpic, price, number) {
    this.orderNum = orderNum+""; //id

    this.title = title; //名称
    this.subtitle = subtitle; //小标题
    this.text = text;//简介

    this.smallpic = smallpic; //略缩图

    this.price = parseFloat(price|| 0.00) ; //单价
    this.number =parseInt(number||1) ; //商品数量
    this.priceSubtotal =parseFloat( (this.price * this.number).toFixed(2)); //该商品总价格

};


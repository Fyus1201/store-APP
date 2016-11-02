/**
 * Created by Fyus on 16/10/21.
 */
var app = app || {};
(function(){
    app.Config = {};

    app.ajax = function(options) {
        app.showPreloader();
        var defaults = {
            type: "POST",
            dataType: "json",
            async: false,
            error: function(xhr, errorType, error) {
                console.info(xhr, errorType, error);
            },
            complete: function(xhr, status) {
                app.hidePreloader();
            }
        };
        $.extend(true, defaults, options);
        defaults.complete=function(xhr, status){
            app.hidePreloader();
            try {
                if(typeof options.complete=="function"){
                    options.complete(xhr, status);
                }
            } catch (e) {
                if(console)console.error("complete回调方法出错");
            }
        };
        //解决hbuilder不支持post请求.json文件
        if (/\.json/g.test(options.url)) defaults.type = "GET";
        defaults.url = (/\http:\/\//g.test(options.url) ? defaults.url : app.Config.projectPath + defaults.url);
        $.ajax(defaults);
    };

})();
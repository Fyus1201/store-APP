/**
 * Created by Fyus on 16/10/31.
 */

!function(){
    var appItem=new AppItem();
    $(".badge").text(appItem.number);

    $(document).on('click','.button-success', function () {
        var buttons1 = [
            {
                text: '是否注册',
                label: true
            },
            {
                text: '否',
                bold: true,
                color: 'danger',
                onClick: function() {
                    $.alert("已终止");
                }
            },
            {
                text: '是',
                onClick: function() {
                    $.alert("正在注册中“");
                }
            }
        ];
        var buttons2 = [
            {
                text: '取消',
                bg: 'danger'
            }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });
}();


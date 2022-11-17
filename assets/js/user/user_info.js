$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 - 6个字符之间';
            }
        },
    });
    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }

                console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo',res.data)
            },
        });
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认值重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起Ajax数据请求
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头衔和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
});

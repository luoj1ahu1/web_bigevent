$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd:  [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!';
            }
        }
    })


    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 提交Ajax数据请求
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/updatepwd',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')

                // 重置表单(只有原生dom能操作reset方法)
                $('.layui-form')[0].reset()
            }
        })
    })
})
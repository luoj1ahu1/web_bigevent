$(function () {
    var layer = layui.layer;

    // 1.获取裁剪区域的DOM元素
    var $image = $('#image');
    // 2.配置选项
    const option = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
    };
    // 3.创建裁剪区域
    $image.cropper(option);

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }

        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件转换为路径
        var imgURL = URL.createObjectURL(file);
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(option); // 重新初始化裁剪区域
    });


    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1.拿到用户裁剪之后的头像
        var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })

        .toDataURL('image/png') // 将 Canvas 画布上的内容转化为base64格式的字符串
        // 2.调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/update/avatar',
            data: {
                avatar: dataURL
            },
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }

                layer.msg('更换头像成功！')
                // 渲染页面用户头像
                window.parent.getUserInfo()
            }
        })
    })
});

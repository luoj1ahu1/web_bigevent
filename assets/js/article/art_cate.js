$(function () {
    initArticleList();

    var layer = layui.layer;
    var form = layui.form;

    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            },
        });
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    });

    // 通过代理的形式为 form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/addcates',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArticleList();
                layer.msg('新增分类成功！');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            },
        });
    });

    // 通过代理的方式为btn-edit绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });

        var id = $(this).attr('data-id');
        console.log(id);

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates/'+id,
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data);
            },
        });
    });

    // 通过代理的方式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/updatecate',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层
                layer.close(indexEdit)
                // 获取列表数据
                initArticleList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','#btn-del', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: 'http://api-breakingnews-web.itheima.net/my/article/deletecate/'+id,
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    // 关闭弹出层
                    layer.close(index);
                    // 更新列表数据
                    initArticleList()
                }
            })
            
            
          });
    })
});

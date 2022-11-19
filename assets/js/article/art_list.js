$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义一个补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    };

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/list',
            data: q,
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                layer.msg('获取文章列表成功！');
                console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            },
        });
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 定义模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单结构
                form.render();
            },
        });
    }

    // 为筛选表单绑定submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        // 根据最新的筛选条件重新渲染数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用  laypage.render() 方法渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 ID
            count: total, // 总数居条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2,3,5,7],
            layout: ['count','limit','prev','page','next','skip'],
            // 分页发生切换的时候，触发 jump 回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候会触发
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump: function (obj,first) {
                console.log(obj.curr);
                // 把最新的页码值赋值到 q 查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数赋值到 q 这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if(!first) { // 可以通过first的值判断是通过什么方式触发的jump回调
                    initTable()
                }

                
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的ID
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: 'http://api-breakingnews-web.itheima.net/my/article/delete/' + id,
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中是否还有数据，如果没有数据，就让当前的页码值-1 之后再调用initTable()方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完成后，页面上就没有数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1:q.pagenum - 1
                    }
                    // 重新渲染列表数据
                    initTable()
                    // 关闭弹出层
                    layer.close(index);
                }
            })
          });
    })
});

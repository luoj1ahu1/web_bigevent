// 每次调用ajax函数时，会先调用ajaxPrefilter（）这个函数
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})
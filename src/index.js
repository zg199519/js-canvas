require('jr-qrcode');
(function () {
        var options = Object();
        options.empty_hint          = '无内容',
        options.url                 = window.location.href,// 分享的地址
        options.source              = webInfo(1,'author'), // 分享的作者
        options.title               = webInfo(2,'title'), // 分享的标题
        options.description         = webInfo(1,'description'), // 分享的描述
        options.image               = webInfo(3), // 分享的图片
        options.sites               = ['wechat','qzone','qq','weibo',], // 分享的站点
        options.target              = '_blank' //打开方式

        //抓取网页头部信息
        function webInfo(code = 1,name = "author",getAttribute = "content"){
            try {
                if(code == 1){
                    //头部的信息
                    let element = document.querySelector('meta[name='+name+']');
                    if(element){
                        return element.getAttribute(getAttribute);
                    }else{
                        return options.empty_hint;
                    }
                }else if(code == 2){
                    return document.querySelector(name)?document.querySelector(name).textContent:options.empty_hint;
                }else if(code == 3){
                    return document.getElementsByTagName("Img")[0]?document.getElementsByTagName("Img")[0].src:'';
                }else{
                    return options.empty_hint;
                }
            } catch (e) {
                return '';
            }
        }


        this.zgShare = {
            config:function (data) {
                if (typeof data === 'object') {
                    for (let v in data){
                        options[v] = data[v];
                    }
                }
                return this;
            },
            listen:function (elem,fun) {

                if (typeof elem === 'string') {
                    //获取是选择class 元素 还是 id元素
                    if(elem[0] == '#'){
                        let elem_s =  document.getElementById(elem.slice(1));
                        arguments.callee(elem_s,fun);
                    }else{
                        let elem_s =  document.querySelectorAll(elem),i = elem_s.length;
                        while (i--) {
                            arguments.callee(elem_s[i],fun);
                        }
                    }
                    return;
                }
                //这里写你的逻辑代码

                /**
                 * 先判断 是都有微信分享
                 */
                options.w_qrcode = jrQrcode.getQrBase64(options.url);
                fun(options);
                return this;
            }
        };

})();
// zgShare.config({url:1}).listen('#social-share',function (data) {
//     console.log(data);
// });
require('jr-qrcode');
require('./index.css');
(function () {
        var options = Object();
        options.empty_hint          = '无内容',
        options.url                 = encodeURIComponent(window.location.href),// 分享的地址
        options.source              = webInfo(1,'author'), // 分享的作者
        options.title               = webInfo(2,'title'), // 分享的标题
        options.description         = webInfo(1,'description'), // 分享的描述
        options.image               = webInfo(3), // 分享的图片
        options.sites               = ['wechat','qq','weibo'], // 分享的站点
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
                        if(v == 'url'){
                            options[v] = encodeURIComponent(data[v]);
                        }else{
                            options[v] = data[v];
                        }
                    }
                }
                return this;
            },
            listen:function (elem = '#social-share',fun = '') {
                //这里写你的逻辑代码
                var html_s = `<div class="zg-share">`;
                if(options.sites instanceof Array){
                    let sites = options.sites;

                    if(sites.indexOf('weibo') != -1){
                        var weibo_url = 'http://v.t.sina.com.cn/share/share.php?title='+options.title+'&url='+options.url+'&content=utf-8&sourceUrl='+options.url+'&pic='+options.image;
                        html_s += `<a href="${weibo_url}"  target="${options.target == '_blank'?'_blank':'_self'}" ><div class="item weibo"></div></a>`;
                        options.weibo_url = weibo_url;
                    }
                    if(sites.indexOf('qq') != -1){
                        var qq_url = 'https://connect.qq.com/widget/shareqq/iframe_index.html?url='+options.url+'&title='+options.title+'&pics='+options.image+'&desc='+options.description+'&summary='+options.description;
                        html_s += `<a href="${qq_url}"  target="${options.target == '_blank'?'_blank':'_self'}"><div class="item qq"></div></a>`;
                        options.qq_url = qq_url;
                    }
                    if(sites.indexOf('wechat') != -1){
                        var w_qrcode = jrQrcode.getQrBase64(options.url);
                        html_s += `<div class="item wechat"><div class="ewm"><img src="${w_qrcode}" alt="微信分享"></div></div>`;
                        options.w_qrcode = w_qrcode;
                    }
                }
                html_s += `</div>`;

                if (typeof elem === 'string') {
                    //获取是选择class 元素 还是 id元素
                    if(elem[0] == '#'){
                        let elemId = document.getElementById(elem.slice(1));
                        elemId.innerHTML = html_s;
                    }else{
                        let elem_s =  document.querySelectorAll(elem),i = elem_s.length;
                        while (i--){
                            elem_s[i].innerHTML = html_s;
                        }
                    }
                }

                 if(fun instanceof Function){
                     fun(options);
                 }
                return this;

            }
        };

})();

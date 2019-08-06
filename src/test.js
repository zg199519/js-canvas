;(function ($, window, document, undefined) {
    function init(target, options) {
        var settings = $.extend({}, $.fn.socialShare.defaults, options);
        var $msb_main = "<a class='msb_main'><img title='鍒嗕韩' src='images/share_core_square.jpg'></a>";
        var $social_group = "<div class='social_group'>"
            + "<a target='_blank' class='msb_network_button weixin'>weixin</a>"
            + "<a target='_blank' class='msb_network_button sina'>sina</a>"
            + "<a target='_blank' class='msb_network_button tQQ'>tQQ</a>"
            + "<a target='_blank' class='msb_network_button qZone'>qZone</a>"
            + "<a target='_blank' class='msb_network_button douban'>douban</a>"
            + "</div>";
        $(target).append($msb_main);
        $(target).append($social_group);
        $(target).addClass("socialShare");
        $(document).on("click", ".msb_network_button.tQQ", function () {
            tQQ(this, settings);
        });
        $(document).on("click", ".msb_network_button.qZone", function () {
            qZone(this, settings);
        });
        $(document).on("click", ".msb_network_button.sina", function () {
            sinaWeibo(this, settings);
        });
        $(document).on("click", ".msb_network_button.douban", function () {
            doubanShare(this, settings);
        });
        $(document).on("click", ".msb_network_button.weixin", function () {
            weixinShare(this, settings);
        });
        $(document).on("click", ".msb_main", function () {
            if ($(this).hasClass("disabled")) return;
            var e = 500;
            var t = 250;
            var r = $(this).parent().find(".msb_network_button").length;
            var i = 60;
            var s = e + (r - 1) * t;
            var o = 1;
            var a = $(this).outerWidth();
            var f = $(this).outerHeight();
            var c = $(this).parent().find(".msb_network_button:eq(0)").outerWidth();
            var h = $(this).parent().find(".msb_network_button:eq(0)").outerHeight();
            var p = (a - c) / 2;
            var d = (f - h) / 2;
            var v = 0 / 180 * Math.PI;
            if (!$(this).hasClass("active")) {
                $(this).addClass("disabled").delay(s).queue(function (e) {
                    $(this).removeClass("disabled").addClass("active");
                    e()
                });
                $(this).parent().find(".msb_network_button").each(function () {
                    var n = p + (p + i * o) * Math.cos(v);
                    var r = d + (d + i * o) * Math.sin(v);
                    $(this).css({
                        display: "block",
                        left: p + "px",
                        top: d + "px"
                    }).stop().delay(t * o).animate({left: n + "px", top: r + "px"}, e);
                    o++
                })
            } else {
                o = r;
                $(this).addClass("disabled").delay(s).queue(function (e) {
                    $(this).removeClass("disabled").removeClass("active");
                    e()
                });
                $(this).parent().find(".msb_network_button").each(function () {
                    $(this).stop().delay(t * o).animate({left: p, top: d}, e);
                    o--
                })
            }
        });
    }

    function replaceAPI(api, options) {
        api = api.replace('{url}', options.url);
        api = api.replace('{title}', options.title);
        api = api.replace('{content}', options.content);
        api = api.replace('{pic}', options.pic);
        return api;
    }

    function tQQ(target, options) {
        var options = $.extend({}, $.fn.socialShare.defaults, options);
        window.open(replaceAPI(tqq, options));
    }

    function qZone(target, options) {
        var options = $.extend({}, $.fn.socialShare.defaults, options);
        window.open(replaceAPI(qzone, options));
    }

    function sinaWeibo(target, options) {
        var options = $.extend({}, $.fn.socialShare.defaults, options);
        window.open(replaceAPI(sina, options));
    }

    function doubanShare(target, options) {
        window.open(replaceAPI(douban, $.extend({}, $.fn.socialShare.defaults, options)));
    }

    function weixinShare(target, options) {
        window.open(replaceAPI(weixin, $.extend({}, $.fn.socialShare.defaults, options)));
    }

    $.fn.socialShare = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.socialShare.methods[options];
            if (method)
                return method(this, param);
        } else
            init(this, options);
    }
    $.fn.socialShare.defaults = {url: window.location.href, title: document.title, content: '', pic: ''}
    $.fn.socialShare.methods = {
        init: function (jq, options) {
            return jq.each(function () {
                init(this, options);
            });
        }, tQQ: function (jq, options) {
            return jq.each(function () {
                tQQ(this, options);
            })
        }, qZone: function (jq, options) {
            return jq.each(function () {
                qZone(this, options);
            })
        }, sinaWeibo: function (jq, options) {
            return jq.each(function () {
                sinaWeibo(this, options);
            });
        }, doubanShare: function (jq, options) {
            return jq.each(function () {
                doubanShare(this, options);
            });
        }, weixinShare: function (jq, options) {
            return jq.each(function () {
                weixinShare(this, options);
            });
        }
    }
    var qzone = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={content}';
    var sina = 'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&searchPic=false';
    var tqq = 'http://share.v.t.qq.com/index.php?c=share&a=index&url={url}&title={title}&appkey=801cf76d3cfc44ada52ec13114e84a96';
    var douban = 'http://www.douban.com/share/service?href={url}&name={title}&text={content}&image={pic}';
    var weixin = 'http://qr.liantu.com/api.php?text={url}';
})(jQuery, window, document);
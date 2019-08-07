# JS原生分享插件
###描述
合并了文本生成base64图片的插件，调用简单，配置清晰，一行代码即可搞定`zgShare.listen();`,同时你也可以不把它当做
一个分享的插件来用 你只需
```$xslt
    zgShare.config({url:'http://www.baidu.com'}).listen(null,function (data) {
        console.log(data);
    });
```
data参数里面也包含了你需要的 根据url生成的base64的图片
###建立
你可以通过这种方式引入
```$xslt
<script type="text/javascript" src="zgShare.js"></script>
```
然后在你引入的js底部使用 前提是你创建了这个元素
```$xslt
zgShare.listen();
zgShare.config.({}).listen();
zgShare.config.({url:'zxxxxxxx'}).listen(null,function(data){  );
```
###配置参数

参数名|描述
-|-
empty_hint|如果参数为空默认补填的内容  默认是“无内容”
url|分享的地址 【默认是当前url】
source|分享的作者 【默认是meat author】
title|分享的标题 【默认是meat title】
description|分享的描述 【默认是meat description】
image|分享的图片【默认是网页第一张图片地址】
sites|['wechat','qq','weibo'], // 分享的站点【默认全都有】
target|'_blank' //打开方式

#### 使用示例
index.html
```$xslt
    <style>
         /*这个样式你自己随意定义即可 他是 默认 分享插件的外部包含框*/
        #social-share{
            position: fixed;
            right: 0;
            margin-right: 80px;
            bottom: 200px;
        }
    </style>
    <!--包含框-->
    <div id="social-share"></div>
    <script type="text/javascript" src="zgShare.js"></script> 
    <script>
      zgShare.listen();
      //or
      zgShare.config.({
        title:'xxxx',
        url:'xxxxx',
        source:'xxx',
        description:'xxxxx'
        // ..........
        }).listen("#social-share",function(parameter){
       });
    </script>
```
##### 有问题
有问题联系我 qq:464032204









(function (e) {
    //信息配置
    var options = {
        canvas_w:'',//画布的宽度
        canvas_h:'',//画布的高度
        canvas_id:'canvas',//外框ID
        home_bg:'',//背景
        line:{spec:"small",lineCap:"round",lineJoin:"round",pattern:'line',color:"#d81e06"},//画笔
        rec :{spec:"small",lineCap:"round",lineJoin:"round",pattern:'line',color:"#d81e06"},//默认矩形参数
        arc :{spec:"small",lineCap:"round",lineJoin:"round",pattern:'line',color:"#d81e06"},//默认圆参数
        font :{color:"#d81e06",spec:"small"},//默认圆参数 small middle big
        arrows :{color:"#d81e06",spec:"small"},//默认箭头参数 小 12px 中 16px 大 24px
        pattern:'line'//默认模式 line:线 rec：矩形 arc：圆 arrows:箭头 font:字
    };
    var canvas,//创建画布节点
        record = [],//操作记录值
        recs  = [],//存储矩形画布集合
        arcs  = [],//存储圆形画布集合
        arrows = [],//存储箭头画布集合
        temporary,//临时存储变量
        canvas_line,//临时线条画布
        canvas_rce,//临时矩形画布
        canvas_arc,//临时圆画布
        canvas_arrows,//临时 箭头画布
        c_x,//临时鼠标点击坐标
        c_y,//临时鼠标点击Y坐标
        canvaNode,//获取画布外框节点
        isAllowDrawLine = false//跟踪鼠标事件
        ;
    //定义全局变量
    e.Drawing = function(initialize = {}){
        //初始化配置
        for (let v in initialize){
            options[v] = initialize[v];
        }

        //初始化节点
        canvaNode = document.getElementById(options.canvas_id);

        //初始化 画布的宽和高
        function initializeWh() {
            var windwo_w = window.innerWidth;//视口宽
            var windwo_h = window.innerHeight;//视口高
            var win_w = Math.floor(((windwo_h-100)/windwo_h)*windwo_w);//实际设置高度
            var win_h = Math.floor(windwo_h-100);
            canvaNode.style.width = win_w+'px';
            canvaNode.style.height = win_h+'px';
            canvaNode.style.marginTop = (windwo_h-win_h)/2+"px";
            canvaNode.style.marginLeft = (windwo_w-win_w)/2+"px";
            options.canvas_w = win_w;
            options.canvas_h = win_h;
        }
        if(options.canvas_w == ''){
            initializeWh();
        }

        //创建 画布
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', options.canvas_w);
        canvas.setAttribute('height', options.canvas_h);
        canvaNode.appendChild(canvas);

        //底图
        if(options.home_bg){
            let img = new Image();
            img.src = options.home_bg;
            img.onload = function(){
                let img_text = canvas.getContext("2d");
                img_text.drawImage(img,0,0,options.canvas_w,options.canvas_h);
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            };
        }

        //创建菜单
        setNavs();

        //计算大小
        const getSize = (code) => {
            //small middle big
            if(code == "small"){
                return 2;
            }else if(code == "middle"){
                return 4;
            }else if(code == "big"){
                return 10;
            }
        };


        //设置画布的参数
        const canvasParameter = (c) => {
            //设置参数
            let tier = canvas.getContext("2d");//2d
            tier.lineCap = options[c].lineCap;//设置结束端点样式。
            tier.lineJoin = options[c].lineJoin;//拐角类型
            tier.lineWidth = getSize(options[c].spec);//设置画笔的粗细
            tier.strokeStyle = options[c].color;//设置触笔的颜色
            return tier;
        };

        //计算鼠标相对于画布的位置
        const windowToCanvas = (canvas, x, y) => {
            //获取canvas元素距离窗口的一些属性，MDN上有解释
            let rect = canvas.getBoundingClientRect();
            //x和y参数分别传入的是鼠标距离窗口的坐标，然后减去canvas距离窗口左边和顶部的距离。
            return {
                x: x - rect.left * (canvas.width/rect.width),
                y: y - rect.top * (canvas.height/rect.height)
            }
        };

        canvas.onmousedown = function(e){
            //鼠标点击
            if(options.pattern == "line"){
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                //创建线条画布
                canvas_line = canvasParameter('line');
                //绘制起点。
                canvas_line.beginPath();
                canvas_line.moveTo(c_x, c_y);
            }else if(options.pattern == "rec"){
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                //创建线条画布
                canvas_rce = canvasParameter('rec');
                console.log(options);
            }else if(options.pattern == "arc"){
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                canvas_arc = canvasParameter('arc');//创建圆画布
            }else if(options.pattern == "font"){
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                let textarea = document.querySelector('._canvas .canvas-textarea');
                //创建富文本框
                if(!textarea){
                    textarea = document.createElement("textarea");
                    textarea.setAttribute('class','canvas-textarea');
                    canvaNode.appendChild(textarea);
                    textarea.style.left = ele['x']+'px';
                    textarea.style.top = ele['y']+'px';
                    textarea.focus();

                }else{
                    //处理焦点离开的事情
                    textarea.onblur = function (e) {
                        if(textarea.value){
                            //有值的情况
                            let canvas_font = canvas.getContext("2d");
                            let top = textarea.offsetTop;
                            let m_top = 0;


                            switch (options.font.spec) {
                                case "small":
                                    canvas_font.font = "14px Georgia normal";
                                    m_top = 14;
                                    break;
                                case "middle":
                                    canvas_font.font = "18px Georgia normal";
                                    m_top = 18;
                                    break;
                                default:
                                    canvas_font.font = "24px Georgia bold";
                                    m_top = 24;
                                    break;
                            }

                            canvas_font.fillStyle = options['font']['color'];
                            let valueArr = textarea.value.split(/[(\r\n)\r\n]+/);
                            valueArr.forEach(function (v,i,arr) {
                                canvas_font.fillText(v,textarea.offsetLeft,top+(m_top*(i+1)));
                            });

                            canvaNode.removeChild(textarea);//删除节点
                            //添加 imgData
                            record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
                        }else{
                            canvaNode.removeChild(textarea);//删除节点
                        }
                    };
                    
                }
                
                (function () {
                    //处理文本框的样式问题
                    textarea.style.color = options['font']['color'];
                    switch (options.font.spec) {
                        case "small":
                            textarea.style.fontSize = "14px";
                            textarea.style.lineHeight = "14px";
                            break;
                        case "middle":
                            textarea.style.fontSize = "18px";
                            textarea.style.lineHeight = "18px";
                            break;
                        default:
                            textarea.style.fontSize = "24px";
                            textarea.style.lineHeight = "24px";
                            break;
                    }
                })();


            }else if(options.pattern == "arrows"){
                //画箭头
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                //创建箭头画布
                canvas_arrows = canvas.getContext("2d");

            }

        };
        canvas.onmousemove = (e) => {
            //鼠标移动
            if(options.pattern == "line"){
                if (isAllowDrawLine) {
                    //移动时获取新的坐标位置，用lineTo记录当前的坐标，然后stroke绘制上一个点到当前点的路径
                    let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                    let {x, y} = ele;
                    //设置该画布的最后一个状态
                    canvas_line.lineTo(x, y);
                    canvas_line.stroke();
                }
            }else if(options.pattern == "rec"){

                if (isAllowDrawLine) {
                    //移动时获取新的坐标位置，用lineTo记录当前的坐标，然后stroke绘制上一个点到当前点的路径
                    let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                    //清空画布
                    canvas_rce.clearRect(0, 0, options.canvas_w, options.canvas_h);
                    if(record.length > 0){
                        canvas_rce.putImageData(record[record.length-1],0,0);
                    }
                    //循环画矩形
                    recs.forEach(function (v,i,arr) {
                        canvas_rce.lineWidth = getSize(v.spec);//设置画笔的粗细
                        canvas_rce.strokeStyle = v.color;//设置触笔的颜色
                        canvas_rce.strokeRect(v.x,v.y,v.width,v.height);
                    });
                    canvas_rce.lineWidth = getSize(options['rec'].spec);//设置画笔的粗细
                    canvas_rce.strokeStyle = options['rec'].color;//设置触笔的颜色

                    let w = ele['x']-c_x,h = ele['y']-c_y;
                    canvas_rce.strokeRect(c_x,c_y,w,h);
                    temporary = new RecXy(c_x,c_y,w,h,options["rec"].color,options["rec"].spec);//构造临时矩形
                }

            }else if(options.pattern == "arc"){
                if (isAllowDrawLine) {
                    //移动时获取新的坐标位置，用lineTo记录当前的坐标，然后stroke绘制上一个点到当前点的路径
                    let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                    //清空画布
                    canvas_arc.clearRect(0, 0, options.canvas_w, options.canvas_h);
                    if(record.length > 0){
                        canvas_arc.putImageData(record[record.length-1],0,0);
                    }
                    //循环画
                    arcs.forEach(function (v,i,arr) {
                        canvas_arc.lineWidth = getSize(v.spec);//设置画笔的粗细
                        canvas_arc.strokeStyle = v.color;//设置触笔的颜色
                        EllipseTwo(canvas_arc, v['x'],v['y'],v['xr'],v['yr']);
                    });

                    canvas_arc.lineWidth = getSize(options['arc'].spec);//设置画笔的粗细
                    canvas_arc.strokeStyle = options['arc'].color;//设置触笔的颜色

                    //中心坐标的位置
                    let xr = Math.abs((ele['x']-c_x)/2),yr = Math.abs((ele['y']-c_y)/2),xx = ele['x']-(ele['x']-c_x)/2,yy = ele['y']-(ele['y']-c_y)/2;
                    EllipseTwo(canvas_arc, xx,yy,xr,yr);
                    temporary = new ArcXy(xx,yy,xr,yr,options["arc"].color,options["arc"].spec);//构造临时圆形
                }

            }else if(options.pattern == "arrows"){
                //鼠标移动事件
                if (isAllowDrawLine) {
                    //移动时获取新的坐标位置，用lineTo记录当前的坐标，然后stroke绘制上一个点到当前点的路径
                    let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                    //清空画布
                    canvas_arrows.clearRect(0, 0, options.canvas_w, options.canvas_h);
                    if(record.length > 0){
                        canvas_arrows.putImageData(record[record.length-1],0,0);
                    }
                    //循环画
                    arrows.forEach(function (v,i,arr) {
                        drawArrow(canvas_arrows, v['fromX'],v['fromY'],v['toX'],v['toY'],v['theta'],v['headlen'],v['width'],v['color']);
                    });

                    let w = 1,color = options['arrows']['color'];
                    switch (options.arrows.spec) {
                        case "small":
                            w = 2;
                            break;
                        case "middle":
                            w = 4;
                            break;
                        default:
                            w = 6;
                            break;
                    }
                    drawArrow(canvas_arrows, c_x, c_y, ele['x'], ele['y'],30,20,w,color);
                    temporary = {fromX:c_x,fromY:c_y,toX:ele['x'],toY:ele['y'],theta:30,headlen:20,width:w,color:color};//构造临时圆形
                }

            }

        };
        canvas.onmouseup = function () {
            //鼠标离开
            if(options.pattern == "line"){
                isAllowDrawLine = false;
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }else if(options.pattern == "rec"){
                isAllowDrawLine = false;
                recs.push(temporary);//添加矩形
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }else if(options.pattern == "arc"){
                isAllowDrawLine = false;
                arcs.push(temporary);//添加
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }else if(options.pattern == "arrows"){
                isAllowDrawLine = false;
                arrows.push(temporary);//
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }

        };




    };

    /**
     * 动态的添加 贴图
     * @param src 图片的地址 最好是base64位的图片
     * @param x 起始X坐标
     * @param y 起始Y坐标
     * @param w 起始 图片的W
     * @param h 起始 图片的H
     */
    Drawing.prototype.setDrawing = (src,x,y,w,h)=>{
        let img = new Image();
        img.src = src;
        img.onload = function(){
            let img_text = canvas.getContext("2d");
            img_text.drawImage(img,x,y,w,h);
            record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
        };
    };
    //获取当前的配置参数
    Drawing.prototype.getConfig = options;
    //获取当前图片的参数
    Drawing.prototype.getBase64 = ()=>{
        return canvas.toDataURL();
    };


    //公用方法-----------------------------------------------------------------------------------------------------------
    //创建操作菜单
    function setNavs(){
        require('./index.css');
        let navs = `
                <div class="canvas-nav">
                    <div class="item _rec" data-value="rec"></div>
                    <div class="item _arc" data-value="arc"></div>
                    <div class="item _arrows" data-value="arrows"></div>
                    <div class="item _line" data-value="line"></div>
                    <div class="item _font" data-value="font"></div>
                    <div class="item _withdraw" data-value="withdraw"></div>
                    <div class="item _download" data-value="download"></div>
                </div>
            `;
        canvaNode.insertAdjacentHTML('afterbegin',navs);

        var aLi = document.querySelectorAll('._canvas .canvas-nav .item');
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].addEventListener('click', function(e){
                let value = this.getAttribute('data-value');
                if(value == "font" || value == "line" || value == "rec" || value == "arc" || value == "arrows"){
                    options.pattern = value;
                    //清空 选项 节点 并重新初始化选项节点
                    setNodeOptions();

                }else if(value == "withdraw"){
                    //撤回
                    if(record.length > 0){
                        recs  = [];//清空矩形数组
                        arcs  = [];//清空圆数组
                        arrows = [];//清空箭头数组
                        if(record.length == 1){
                            if(options.home_bg == ''){
                                record.pop();//移除最后一项
                                canvas.getContext("2d").clearRect(0, 0, options.canvas_w, options.canvas_h);
                            }
                        }else{
                            record.pop();//移除最后一项
                            canvas.getContext("2d").putImageData(record[record.length-1],0,0);
                        }
                    }
                }else if(value == "download"){
                    //下载图片
                    let canvas_img = canvas.toDataURL();
                    let name = 'canvas'+String(selectFrom(10000,100000))+'.png';
                    //下载图片
                    downloadFile(name, canvas_img);
                }
                clearNodes();
            });
        }

        //后清理
        function clearNodes() {
            let textarea = document.querySelector('._canvas .canvas-textarea');
            if(textarea){
                canvaNode.removeChild(textarea);//删除节点
            }
        }

    }
    
    //插入节点 选项
    function setNodeOptions() {

        let node = options.pattern;
        let options_node = `
           <div class="_option"> 
               <div class="_top_a"></div>
               <div class="_item _size"><div class="main _small" data-value="small"></div> </div>  
               <div class="_item _size"><div class="main _middle" data-value="middle"></div></div> 
               <div class="_item _size"><div class="main _big" data-value="big"></div></div> 
               <div class="_item _color"><div class="color _d81e06" data-value="d81e06"></div></div>  
               <div class="_item _color"><div class="color _ea9518" data-value="ea9518"></div></div> 
               <div class="_item _color"><div class="color _2aa515" data-value="2aa515"></div></div> 
               <div class="_item _color"><div class="color _1296db" data-value="1296db"></div></div> 
               <div class="_item _color"><div class="color _2c2c2c" data-value="2c2c2c"></div></div> 
               <div class="_item _color"><div class="color _515151" data-value="515151"></div></div> 
               <div class="_item _color"><div class="color _bfbfbf" data-value="bfbfbf"></div></div> 
           </div>
        `;

        //清空
        var fatherNode = document.querySelectorAll('._canvas .canvas-nav .item');
        fatherNode.forEach(function (v,i,arr) {
            v.innerHTML = ''
        });

        //重新赋值
        var innerNode = document.querySelector('._canvas .canvas-nav ._'+node);
        innerNode.innerHTML = options_node;//插入节点

        //修改默认状态
        let code = options.pattern;
        let argument = options[node];
        let color = argument['color'].substr(1),spec = argument['spec'];
        document.querySelector('._canvas .canvas-nav .item._'+code).classList.add('action');
        emptyInitialization(color,spec);

        //初始化点击事件
        var sizeLi = document.querySelectorAll('._canvas .canvas-nav .item ._option ._size .main');

        sizeLi.forEach(function (v,i,arr) {
           v.onclick = function (e) {
               let value = v.getAttribute('data-value');
               options[node].spec = value;//赋值
               emptyInitialization('',value,'spec');
               e.stopPropagation();
           }
        });

        var colorLi = document.querySelectorAll('._canvas .canvas-nav .item ._option ._color .color');//获取所有的颜色列表选项
        colorLi.forEach(function (v,i,arr) {
            v.onclick = function (e) {
                let value = v.getAttribute('data-value');
                options[node].color = "#"+value;//赋值
                emptyInitialization(value,'','color');
                e.stopPropagation();
            }
        });

    }
    
    //设置选项的选中状态
    function emptyInitialization(color,spec,code = 'all') {
        let colors = document.querySelectorAll('._canvas .canvas-nav .item ._option ._color .color');
        let sizes = document.querySelectorAll('._canvas .canvas-nav .item ._option ._size .main');
        if(code == "all"){
            colors.forEach(function (v,i,arr) {
                v.classList.remove('action');
            });
            sizes.forEach(function (v,i,arr) {
                v.classList.remove('action');
            });
            document.querySelector('._canvas .canvas-nav .item ._option ._color .color._'+color).classList.add('action');//颜色默认选中状态
            document.querySelector('._canvas .canvas-nav .item ._option ._size .main._'+spec).classList.add('action');//
        }else if(code == "color"){
            colors.forEach(function (v,i,arr) {
                v.classList.remove('action');
            });
            document.querySelector('._canvas .canvas-nav .item ._option ._color .color._'+color).classList.add('action');//颜色默认选中状态
        }else if(code == "spec"){
            sizes.forEach(function (v,i,arr) {
                v.classList.remove('action');
            });
            document.querySelector('._canvas .canvas-nav .item ._option ._size .main._'+spec).classList.add('action');
        }

    }

    //构造一个矩形坐标
    function RecXy(xx,yy,width,height,color,spec) {
        this.x = xx;
        this.y = yy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.spec = spec;
    }
    RecXy.prototype = {
        constructor : RecXy,
        getConfig : function () {
            return this;
        }
    };
    //构造一个圆形坐标
    function ArcXy(xx,yy,xr,yr,color,spec) {
        this.x = xx;
        this.y = yy;
        this.xr = xr;
        this.yr = yr;
        this.color = color;
        this.spec = spec;
    }
    ArcXy.prototype = {
        constructor : ArcXy,
        getConfig : function () {
            return this;
        }
    };

    //均匀压缩法
    function EllipseTwo(context, x, y, a, b) {
        context.save();
        var r = (a > b) ? a : b;
        var ratioX = a / r;
        var ratioY = b / r;
        context.scale(ratioX, ratioY);
        context.beginPath();
        context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
        context.closePath();
        context.restore();
        context.stroke();
    }

    /**
     * 创建箭头
     * @param {Object} ctx    canvas对象
     * @param {Object} fromX  起点x
     * @param {Object} fromY  起点y
     * @param {Object} toX    终点x
     * @param {Object} toY    终点y
     * @param {Object} theta  箭头夹角
     * @param {Object} headlen 斜边长度
     * @param {Object} width 箭头宽度
     * @param {Object} color 颜色
     */
    function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
        theta = typeof(theta) != 'undefined' ? theta : 30;
        headlen = typeof(theta) != 'undefined' ? headlen : 10;
        width = typeof(width) != 'undefined' ? width : 1;
        color = typeof(color) != 'color' ? color : '#000';
        // 计算各角度和对应的P2,P3坐标
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        var arrowX = fromX - topX, arrowY = fromY - topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        arrowX = toX + topX;
        arrowY = toY + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(toX, toY);
        arrowX = toX + botX;
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
    }

    //随机数
    function selectFrom(lowerValue,upperValue) {
        var choices = upperValue - lowerValue + 1;
        return Math.floor(Math.random() * choices + lowerValue);
    }

    //下载
    function downloadFile(fileName, content) {
        let aLink = document.createElement('a');
        let blob = base64ToBlob(content); //new Blob([content]);

        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        // aLink.dispatchEvent(evt);
        // aLink.click()
        aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
    };
    //base64转blob
    function base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
    };

})(window);







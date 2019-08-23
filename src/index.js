(function (e) {
    //信息配置
    var options = {
        canvas_w:1000,//画布的宽度
        canvas_h:600,//画布的高度
        canvas_id:'canvas',//外框ID
        color:'black',//画笔颜色
        line:{line:1,lineCap:"round",lineJoin:"round",pattern:'line',color:"#000000"},//画笔
        rec :{line:3,lineCap:"round",lineJoin:"round",pattern:'line',color:"#4B0082"},//默认矩形参数
        arc :{line:3,lineCap:"round",lineJoin:"round",pattern:'line',color:"#4B0082"},//默认圆参数
        font :{color:"#FF0000",spec:"small"},//默认圆参数 small middle big
        arrows :{},//默认圆参数 小 12px 中 16px 大 24px
        pattern:'font'//默认模式 line:线 rec：矩形 arc：圆 arrows:箭头 font:字
    };
    var canvas,//创建画布节点
        record = [],//操作记录值
        recs  = [],//存储矩形画布集合
        arcs  = [],//存储圆形画布集合
        temporary,//临时存储变量
        canvas_line,//临时画布
        canvas_rce,//临时画布
        canvas_arc,//临时画布
        c_x,//临时鼠标点击坐标
        c_y,//临时鼠标点击Y坐标
        canvaNode,//获取画布外框节点
        isAllowDrawLine = false//跟踪鼠标事件
        ;


    //定义全局变量
    e.Drawing = function(initialize = {},fun=null){
        //初始化配置
        for (let v in initialize){
            options[v] = initialize[v];
        }
        //初始化节点
        canvaNode = document.getElementById(options.canvas_id);
        options.canvas_w = canvaNode.offsetWidth;
        options.canvas_h = canvaNode.offsetHeight;
        //创建 画布
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', options.canvas_w);
        canvas.setAttribute('height', options.canvas_h);
        canvaNode.appendChild(canvas);

        //创建菜单
        setNavs();

        //设置画布的参数
        const canvasParameter = (c) => {
            //设置参数
            let tier = canvas.getContext("2d");//2d
            tier.lineCap = options[c].lineCap;//设置结束端点样式。
            tier.lineJoin = options[c].lineJoin;//拐角类型
            tier.lineWidth = options[c].line;//设置画笔的粗细
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
            }else if(options.pattern == "rce"){
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                //创建线条画布
                canvas_rce = canvasParameter('rec');
            }else if(options.pattern == "arc"){
                isAllowDrawLine = true;
                //获取鼠标按下的点相对canvas的坐标。
                let ele = windowToCanvas(canvas, e.clientX, e.clientY);
                //es6的解构赋值
                c_x  = ele['x'];
                c_y  = ele['y'];
                canvas_arc = canvasParameter('arc');//创建圆画布
            }else if(options.pattern == "font"){

                //绘制箭头
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
                    //处理文字 画板的事情
                    textarea.onblur = function (e) {
                        if(textarea.value){
                            //有值的情况
                            let canvas_font = canvas.getContext("2d");
                            let top = textarea.offsetTop;
                            switch (options.font.spec) {
                                case "small":
                                    canvas_font.font = "14px Georgia normal";
                                    top = top+14;
                                    break;
                                case "middle":
                                    canvas_font.font = "18px Georgia normal";
                                    top = top+18;
                                    break;
                                default:
                                    canvas_font.font = "24px Georgia bold";
                                    top = top+24;
                                    break;
                            }
                            canvas_font.fillStyle = options['font']['color'];
                            canvas_font.fillText(textarea.value,textarea.offsetLeft,top);
                            canvaNode.removeChild(textarea);//删除节点
                            //添加 imgData
                            record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
                        }
                    }
                }

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
            }else if(options.pattern == "rce"){

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
                        canvas_rce.strokeRect(v.x,v.y,v.width,v.height);
                    });
                    let w = ele['x']-c_x,h = ele['y']-c_y;
                    canvas_rce.strokeRect(c_x,c_y,w,h);
                    temporary = new RecXy(c_x,c_y,w,h);//构造临时矩形
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
                        EllipseTwo(canvas_arc, v['x'],v['y'],v['xr'],v['yr']);
                    });
                    //中心坐标的位置
                    let xr = Math.abs((ele['x']-c_x)/2),yr = Math.abs((ele['y']-c_y)/2),xx = ele['x']-(ele['x']-c_x)/2,yy = ele['y']-(ele['y']-c_y)/2;
                    EllipseTwo(canvas_arc, xx,yy,xr,yr);
                    temporary = new ArcXy(xx,yy,xr,yr);//构造临时圆形
                }

            }

        };
        canvas.onmouseup = function () {
            //鼠标离开
            if(options.pattern == "line"){
                isAllowDrawLine = false;
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }else if(options.pattern == "rce"){
                isAllowDrawLine = false;
                recs.push(temporary);//添加矩形
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }else if(options.pattern == "arc"){
                isAllowDrawLine = false;
                arcs.push(temporary);//添加
                record.push(canvas.getContext("2d").getImageData(0, 0, options.canvas_w, options.canvas_h));//保存画布的像素值
            }

            console.log(record);
        };

        //构造一个矩形坐标
        function RecXy(xx,yy,width,height) {
            this.x = xx;
            this.y = yy;
            this.width = width;
            this.height = height;
        }
        RecXy.prototype = {
            constructor : RecXy,
            getConfig : function () {
                return this;
            }
        };
        //构造一个圆形坐标
        function ArcXy(xx,yy,xr,yr) {
            this.x = xx;
            this.y = yy;
            this.xr = xr;
            this.yr = yr;
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

        window.onresize = function(){
            // canvas.width = canvaNode.offsetWidth;
            // canvas.height = canvaNode.offsetHeight;
            //重新绘制
        };


        //创建操作菜单
        function setNavs(){
            let navs = `
                <div class="canvas-nav">
                  <div class="item _withdraw">撤回</div>
                  <div class="item _line">线</div>
                  <div class="item _rec">矩形</div>
                  <div class="item _arc">圆</div>
                  <div class="item _font">写字</div>
                  <div class="item _arrows">箭头</div>
                  
                </div>
            `;
            canvaNode.insertAdjacentHTML('afterbegin',navs);

            document.querySelector('.canvas-nav ._withdraw').addEventListener('click',function (e) {
                //撤回
                if(record.length > 0){
                    recs  = []; arcs  = [];

                    if(record.length == 1){
                        record.pop();//移除最后一项
                        canvas.getContext("2d").clearRect(0, 0, options.canvas_w, options.canvas_h);
                    }else{
                        record.pop();//移除最后一项
                        canvas.getContext("2d").putImageData(record[record.length-1],0,0);
                    }

                    console.log(record);
                }
            });

            document.querySelector('.canvas-nav ._font').addEventListener('click',function (e) {
                //
                options.pattern = "font";

            });

            document.querySelector('.canvas-nav ._line').addEventListener('click',function (e) {
                //
                options.pattern = "line";

            });

            document.querySelector('.canvas-nav ._rec').addEventListener('click',function (e) {
                //撤回
                options.pattern = "rce";
            });

            document.querySelector('.canvas-nav ._arc').addEventListener('click',function (e) {
                //撤回
                options.pattern = "arc";
            });

        }





    };

})(window);

new Drawing();


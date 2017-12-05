import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {isUndefined} from "ngx-bootstrap/bs-moment/utils/type-checks";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'device-operate',
    templateUrl: './device-operate.component.html',
    styleUrls: ['./device-operate.component.scss']
})

export class DeviceOperateComponent implements AfterViewInit{

    name: string; // 设备名称
    deviceId: string; // 设备id

    SIDE_LENGTH = 560; // 正方形边长
    hScreen: boolean; // 是否横屏
    ret = 1.0;
    imageHeight: number; // 长边
    imageWidth: number; // 短边
    /*jshint browser:true*/
    BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    length = 0;
    imgArr = [];
    count = 0;

    // 鼠标按下状态
    isDivMouseDown = false;
    // 点时刻
    pointDate: Date;
    //------------------------

    canvas: HTMLCanvasElement; // 画布
    brush: CanvasRenderingContext2D;

    @ViewChild('canvasElement')
    canvasElement: ElementRef;

    ws: WebSocket;

    constructor(private activatedRoute: ActivatedRoute) {
        activatedRoute.queryParams.subscribe(queryParams => {
            this.name = queryParams.name;
            this.deviceId = queryParams.id;
        });
    }

    //初始化
    ngAfterViewInit(): void {

        this.canvas = this.canvasElement.nativeElement;
        this.brush = this.canvas.getContext('2d');

        let component = this;

        //TODO 修改websocket地址
        this.ws = new WebSocket('ws://10.2.102.166:9002');
        this.ws.binaryType = 'arraybuffer';
        // this.ws.binaryType = 'blob';
        this.ws.onclose = function () {
            console.log('onclose', arguments);
        }

        this.ws.onerror = function () {
            console.log('onerror', arguments);
        }

        this.ws.onopen = function () {
            console.log('连接成功, 发送初始化消息', arguments);
            component.send("init", component.deviceId, "init");
        }

        // 接受minicap发送的手机截屏数据
        this.ws.onmessage = function(message) {
            let data = message.data;

            if(typeof(data) == "string") {
                if(data.indexOf("@@") == 0) {
                    length = parseInt(data.substring(2, data.length));
                    console.log("包头信息为 : " + data + ", 数据长度为: " + length);
                }
            } else {
                if(length > 0 && data instanceof ArrayBuffer) {
                    component.imgArr.push(data);
                    component.count += data.byteLength;
                }
            }

            if(component.count >= length) {
                console.log("图像接收完成, imgArr的长度为: " + component.imgArr.length + ", 图像的字节数为: " + length);
                let img = new Uint8Array(length);
                let sum = 0;
                for(let i = 0; i < component.imgArr.length; i++) {
                    let data = new Uint8Array(component.imgArr[i]);
                    for(let j = 0; j < data.byteLength; j++) {
                        img[sum++] = data[j];
                    }
                }
                // 数据清除
                component.count = 0;
                length = 0;
                component.imgArr = [];

                let blob = new Blob([img], {
                    type: 'image/jpeg'
                });

                let URL = window.URL;
                let image = new Image();
                image.onload = function() {
                    console.log(image.width, image.height);
                    component.initCanvasSize(image.width, image.height);
                    component.brush.drawImage(image, 0, 0, component.canvas.width, component.canvas.height);
                    image.onload = null;
                    image.src = component.BLANK_IMG;
                    image = null;
                    u = null;
                    blob = null;
                }

                let u = URL.createObjectURL(blob);
                image.src = u;
            }
        }
    }

    // 初始化canvas尺寸
    initCanvasSize(width, height) {
        if (width > height) { // 横屏
            if (isUndefined(this.hScreen) || !this.hScreen) {
                this.canvas.width = this.SIDE_LENGTH;
                this.ret = width / this.canvas.width;
                this.canvas.height = height / this.ret;
                this.hScreen = true;
                this.imageWidth = height;
                this.imageHeight = width;
            }
        } else { // 竖屏
            if (isUndefined(this.hScreen) || this.hScreen) {
                this.canvas.height = this.SIDE_LENGTH;
                this.ret = height / this.canvas.height;
                this.canvas.width = width / this.ret;
                this.hScreen = false;
                this.imageHeight = height;
                this.imageWidth = width;
            }
        }
    }


    canvasClick(e) {
        //标准的获取鼠标点击相对于canvas画布的坐标公式
        let x = e.pageX - this.canvas.getBoundingClientRect().left;
        let y = e.pageY - this.canvas.getBoundingClientRect().top;

        // 发送点击事件
        x = x * this.ret;
        y = y * this.ret;

        let content = {
            "actionType": "click",
            "imageWidth": this.imageWidth,
            "imageHeight": this.imageHeight,
            "points": "[" + x + "," + y + "]"
        };
        this.send("minitouchEvent", this.deviceId, JSON.stringify(content));
    }

    //================================ 拖拽相关
    // 鼠标按下
    divMousedown(e) {
        console.log("鼠标按下");
        this.isDivMouseDown = true;
        this.pointDate = new Date();
        let x = e.pageX - this.canvas.getBoundingClientRect().left;
        let y = e.pageY - this.canvas.getBoundingClientRect().top;

        x = x * this.ret;
        y = y * this.ret;

        // 发送鼠标按下命令
        let content = {
            "actionType": "mouseDown",
            "imageWidth": this.imageWidth,
            "imageHeight": this.imageHeight,
            "points": "[" + x + "," + y + "]"
        };
        this.send("minitouchEvent", this.deviceId, JSON.stringify(content));
    };

    // 鼠标松开
    divMouseup(e: Event) {
        console.log("鼠标松开");
        this.isDivMouseDown = false;
        // this.sendMouseup();

        // 发送鼠标释放命令
        let content = {
            "actionType": "mouseUp",
            "imageWidth": this.imageWidth,
            "imageHeight": this.imageHeight,
            "points": ""
        };
        this.send("minitouchEvent", this.deviceId, JSON.stringify(content));
    };

    // 记录坐标
    divMousemove(e) {
        if (this.isDivMouseDown) {

            // 发送移动后的坐标、时长
            let x = e.pageX - this.canvas.getBoundingClientRect().left;
            let y = e.pageY - this.canvas.getBoundingClientRect().top;
            x = x * this.ret;
            y = y * this.ret;

            let content = {
                "actionType": "mouseMove",
                "imageWidth": this.imageWidth,
                "imageHeight": this.imageHeight,
                "points": "[" + x + "," + y + "]"
            };
            this.send("minitouchEvent", this.deviceId, JSON.stringify(content));

            //TODO 暂时不做记录
            // 点与点之间时间间隔
            /*nowDate = new Date();
            timeCost = parseInt(nowDate - pointDate);
            pointDate = nowDate;
            console.log("点到点时长：" + timeCost);

            sendMousewait(timeCost);*/
        }
    };

    /*function sendMousewait(waittime) {
        info = {
            "head": "minitouch",
            "actionType": "waittime",
            "retWidth": imageWidth,
            "retHeight": imageHeight,
            "points": "[0,0]",
            "waittime": waittime
        };
        send(JSON.stringify(info));
    }*/

//=================================

    // 发送minitouch命令
    send(type, deviceId, content) {
        let info = {
            "type": type,
            // "userId": userId,
            "deviceId": deviceId,
            "content": content
        }
        console.log("发送的消息是: " + JSON.stringify(info));
        this.ws.send(JSON.stringify(info));
    }
}

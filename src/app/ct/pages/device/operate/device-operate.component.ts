import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'device-operate',
    templateUrl: './device-operate.component.html',
    styleUrls: ['./device-operate.component.scss']
})
export class DeviceOperateComponent implements AfterViewInit {

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

    canvas: any; // 画布
    brush: CanvasRenderingContext2D;

    ws: WebSocket;

    constructor(private activatedRoute: ActivatedRoute) {
        activatedRoute.queryParams.subscribe(queryParams => {
            this.name = queryParams.name;
            this.deviceId = queryParams.id;
        });
    }

    //初始化
    ngAfterViewInit(): void {

        this.canvas = document.getElementById('canvasElement');
        this.brush = this.canvas.getContext('2d');

        let component = this;

        //TODO 修改websocket地址
        this.ws = new WebSocket('ws://10.2.102.166:9002');
        this.ws.binaryType = 'arraybuffer';
        // this.ws.binaryType = 'blob';
        this.ws.onclose = function () {
            console.log('onclose', arguments);
        };

        this.ws.onerror = function () {
            console.log('onerror', arguments);
        };

        this.ws.onopen = function () {
            console.log('连接成功, 发送初始化消息', arguments);
            component.sendMinitouchCommand('init', component.deviceId, 'init');
        };

        // 接受minicap发送的手机截屏数据
        this.ws.onmessage = function(message) {
            let data = message.data;

            if(typeof(data) == 'string') {
                if(data.indexOf('@@') == 0) {
                    length = parseInt(data.substring(2, data.length));
                    console.log('包头信息为 : ' + data + ', 数据长度为: ' + length);
                }
            } else {
                if(length > 0 && data instanceof ArrayBuffer) {
                    component.imgArr.push(data);
                    component.count += data.byteLength;
                }
            }

            if(component.count >= length) {
                console.log('图像接收完成, imgArr的长度为: ' + component.imgArr.length + ', 图像的字节数为: ' + length);
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
                    blob = null;
                };

                image.src = URL.createObjectURL(blob);
            }
        };

        this.initCanvasSize(1080, 1920);
        this.canvas.onclick = function(e: MouseEvent) {
            console.log('鼠标单击动作');
            let x = e.offsetX;
            let y = e.offsetY;
            // 发送点击事件
            x = x * component.ret;
            y = y * component.ret;

            let content = {
                'actionType': 'click',
                'imageWidth': component.imageWidth,
                'imageHeight': component.imageHeight,
                'points': '[' + x + ',' + y + ']'
            };
            component.sendMinitouchCommand('minitouchEvent', component.deviceId, JSON.stringify(content));
        };
        this.canvas.onmousedown = function(e: MouseEvent) {
            console.log('鼠标按下');
            component.isDivMouseDown = true;

            let x = e.offsetX;
            let y = e.offsetY;

            x = x * component.ret;
            y = y * component.ret;

            // 发送鼠标按下命令
            let content = {
                'actionType': 'mouseDown',
                'imageWidth': component.imageWidth,
                'imageHeight': component.imageHeight,
                'points': '[' + x + ',' + y + ']'
            };
            component.sendMinitouchCommand('minitouchEvent', component.deviceId, JSON.stringify(content));
        };
        this.canvas.onmouseup = function(e: MouseEvent) {
            console.log('鼠标松开');
            component.isDivMouseDown = false;

            // 发送鼠标释放命令
            let content = {
                'actionType': 'mouseUp',
                'imageWidth': component.imageWidth,
                'imageHeight': component.imageHeight,
                'points': ''
            };
            component.sendMinitouchCommand('minitouchEvent', component.deviceId, JSON.stringify(content));
        };
        this.canvas.onmousemove = function(e: MouseEvent) {
            if (component.isDivMouseDown) {
                let x = e.offsetX;
                let y = e.offsetY;
                x = x * component.ret;
                y = y * component.ret;

                let content = {
                    actionType: 'mouseMove',
                    imageWidth: component.imageWidth,
                    imageHeight: component.imageHeight,
                    points: '[' + x + ',' + y + ']'
                };
                component.sendMinitouchCommand('minitouchEvent', component.deviceId, JSON.stringify(content));
            }
        };
    }

    // 初始化canvas尺寸
    initCanvasSize(width: number, height:number) {
        if (width > height) { // 横屏
            if (this.hScreen == undefined || !this.hScreen) {
                this.canvas.width = this.SIDE_LENGTH;
                this.ret = width / this.canvas.width;
                this.canvas.height = height / this.ret;
                this.hScreen = true;
                this.imageWidth = height;
                this.imageHeight = width;
            }
        } else { // 竖屏
            if (this.hScreen == undefined || this.hScreen) {
                this.canvas.height = this.SIDE_LENGTH;
                this.ret = height / this.canvas.height;
                this.canvas.width = width / this.ret;
                this.hScreen = false;
                this.imageHeight = height;
                this.imageWidth = width;
            }
        }
    }

    // 发送minitouch命令
    sendMinitouchCommand(typeStr: string, deviceId: string, content: string) {
        let info = {
            type: typeStr,
            // 'userId': userId,
            deviceId: deviceId,
            content: content
        };
        console.log('发送的消息是: ' + JSON.stringify(info));
        this.ws.send(JSON.stringify(info));
    }
}

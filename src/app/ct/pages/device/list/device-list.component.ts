import {Component, ViewChild} from '@angular/core';
import {OurpalmTable, TableConfig, Page} from "ngx-ourpalm-table/lib";
import {environment} from "../../../../../environments/environment";
import {mask} from "../../../../shared/services/httpx.interceptor";
import {HttpService} from "../../../../shared/services/httpx.service";
import {ToastService} from "../../../../shared/services/toast.service";
import {ModalDirective} from "ngx-bootstrap";
import {Router, ActivatedRoute} from "@angular/router";
import {FileUploader} from "ng2-file-upload";

@Component({
    selector: 'device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent {

    criteria = {
        num: {value: '', selectValue: ''},
        identifier: '',
        id: '',
        name: '',
        brand: '',
        manufacturer: '',
        apilevel: {value: '', selectValue: ''},
        systemtype: '',
        resolution: '',
        status: '',
        isOnline: '',
        mac: '',
    };
    queryCondition = {
        equal: {},
        largerThan: {},
        lessThan: {},
        orderByAsc: {},
        orderByDesc: {},
        blurQuery: {}
    };
    rangeSelectData = [
        {id: '0', text: '等于'},
        {id: '1', text: '大于'},
        {id: '2', text: '小于'}
    ];
    systemTypeSelectData = [
        {id: '0', text: '安卓'},
        {id: '1', text: 'IOS'},
    ];
    statusSelectData = [
        {id: '0', text: '空闲中'},
        {id: '1', text: '使用中'},
    ];
    isOnlineSelectData = [
        {id: '0', text: '离线'},
        {id: '1', text: '在线'},
    ];
    resolutionSelectData = [
        {id: '800*480', text: '800*480'},
        {id: '960*480', text: '960*480'},
        {id: '960*540', text: '960*540'},
        {id: '1280*720', text: '1280*720'},
        {id: '1920*1080', text: '1920*1080'},
        {id: '2040*1080', text: '2040*1080'},
        {id: '2560*1440', text: '2560*1440'},
    ];

    table: OurpalmTable;
    currentPage: number;
    deviceDetail: any;

    //设备详情模态框
    @ViewChild('importModal')
    importModal: ModalDirective;

    @ViewChild('importAddDeviceModal')
    importAddDeviceModal: ModalDirective;

    @ViewChild('importInstallAndUninstallModal')
    importInstallAndUninstallModal: ModalDirective;

    @ViewChild('importShutdownAndRebootModal')
    importShutdownAndRebootModal: ModalDirective;

    @ViewChild('deleteModal')
    deleteModal: ModalDirective;

    // 文件上传的地址
    public uploader: FileUploader;

    addDevices: any[] = [];
    operateDevices: any[] = [];

    constructor(private tableConfig: TableConfig,
                private httpService: HttpService,
                private toastService: ToastService,
                private route: ActivatedRoute,
                private router: Router,) {

        this.uploader = new FileUploader({
            url: environment.getUrl('install'),
            queueLimit: 1,
            autoUpload: false,
            removeAfterUpload: true,
        });
        // 对上传失败的处理
        this.uploader.onSuccessItem = function (fileItem, response) {
            let responseData = JSON.parse(response);
            if (responseData.status == 1) {
                toastService.pop("success", "成功", "应用包安装成功")
            } else {
                toastService.pop("error", "失败", "应用包安装失败，错误码：" + responseData.status)
            }
        }
    }

    ngOnInit(): void {

        //初始化表格
        this.table = this.tableConfig.create({
            cacheKey: 'devices_cache',
            pagePosition: 'bottom',
            pageSize: 10,
            pageList: [5, 10],
            cacheColumns: true,
            cachePageSize: true,
            autoLoadData: true,
            selectOnCheck: false,
            checkOnSelect: false,
            singleSelect: false,
            loadData: (table: OurpalmTable/*, callback: (page: Page) => {}*/) => {
                this.onSearch(table.currentPage);
            },
            rowMenus: [
                {
                    text: '详情',
                    iconCls: 'fa fa-info-circle',
                    show: true,
                    disabled: () => this.table.getSelectedRows().length != 1,
                    onclick: () => {
                        this.openDetailModal();
                    }
                },
                {
                    text: '云真机',
                    iconCls: 'fa fa-cloud',
                    show: true,
                    disabled: () => this.table.getSelectedRows().length != 1,
                    onclick: () => {
                        this.navigateToDevieOperate();
                    }
                },
                {
                    text: '安装APP/卸载APP',
                    iconCls: 'fa fa-cog',
                    show: true,
                    disabled: () => this.table.getCheckedRows().length == 0,
                    onclick: () => {
                        this.openInstallAndUninstallModal();
                    }
                },
                {
                    text: '一键关机/重启',
                    iconCls: 'fa  fa-power-off',
                    show: true,
                    disabled: () => this.table.getCheckedRows().length == 0,
                    onclick: () => {
                        this.openShutdownAndRebootModal();
                    }
                },
            ]
        });
    }

    //分页数据查询
    onSearch(currentPage: number = 1) {
        this.httpService
            .get(environment.getUrl('devices/page'), {
                    currentPage: currentPage,
                    pageSize: this.table.pageSize,
                    queryCondition: JSON.stringify(this.queryCondition),
                    ...mask
                },
            )
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    let page: Page = {
                        currentPage: result.currentPage,
                        pageSize: result.page.showCount,
                        total: result.page.totalResult,
                        rows: result.page.list
                    };
                    this.table.setPageData(page);
                } else {
                    this.toastService.pop('error', '数据异常，错误码：' + result.errorCode);
                }
            });
    }

    //打开设备详情模态框
    openDetailModal() {
        this.loadDetail(this.table.getSelectedRows()[0].id);
        this.importModal.show();
    }

    //跳转到云真机页面
    navigateToDevieOperate() {
        const device = this.table.getSelectedRows()[0];
        this.router.navigate(['../operate'], {
            queryParams: {
                id: device.id,
                name: device.name
            },
            relativeTo: this.route
        });
    }

    //获取设备详情
    loadDetail(id: String) {
        this.httpService
            .get(environment.getUrl('device/' + id))
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    this.deviceDetail = result.properties.device;
                } else {
                    this.toastService.pop('error', '失败', '数据异常，错误码：' + result.errorCode);
                }
            });
    }

    //处理页面查询条件
    saveQueryCondition() {
        //清空查询条件
        this.queryCondition.equal = {};
        this.queryCondition.lessThan = {};
        this.queryCondition.largerThan = {};
        this.queryCondition.orderByAsc = {};
        this.queryCondition.orderByDesc = {};
        this.queryCondition.blurQuery = {};

        //设备编号
        if (this.criteria.num && this.criteria.num.value && this.criteria.num.selectValue) {
            if (this.criteria.num.selectValue === '0') {
                this.queryCondition.equal = {
                    ...this.queryCondition.equal,
                    num: this.criteria.num.value
                }
            } else if (this.criteria.num.selectValue === '1') {
                this.queryCondition.largerThan = {
                    ...this.queryCondition.largerThan,
                    num: this.criteria.num.value
                }
            } else if (this.criteria.num.selectValue === '2') {
                this.queryCondition.lessThan = {
                    ...this.queryCondition.lessThan,
                    num: this.criteria.num.value
                }
            }
        }

        //api版本
        if (this.criteria.apilevel && this.criteria.apilevel.value && this.criteria.apilevel.selectValue) {
            if (this.criteria.apilevel.selectValue === '0') {
                this.queryCondition.equal = {
                    ...this.queryCondition.equal,
                    apilevel: this.criteria.apilevel.value
                }
            } else if (this.criteria.apilevel.selectValue === '1') {
                this.queryCondition.largerThan = {
                    ...this.queryCondition.largerThan,
                    apilevel: this.criteria.apilevel.value
                }
            } else if (this.criteria.apilevel.selectValue === '2') {
                this.queryCondition.lessThan = {
                    ...this.queryCondition.lessThan,
                    apilevel: this.criteria.apilevel.value
                }
            }
        }

        //唯一标识
        if (this.criteria.identifier) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                identifier: this.criteria.identifier
            }
        }
        //id
        if (this.criteria.id) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                id: this.criteria.id
            }
        }
        //设备名称
        if (this.criteria.name) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                name: this.criteria.name
            }
        }
        // 品牌
        if (this.criteria.brand) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                brand: this.criteria.brand
            }
        }
        // 厂商
        if (this.criteria.manufacturer) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                brand: this.criteria.brand
            }
        }
        //系统类型
        if (this.criteria.systemtype) {
            this.queryCondition.equal = {
                ...this.queryCondition.equal,
                systemtype: this.criteria.systemtype
            }
        }
        //分辨率
        if (this.criteria.resolution) {
            this.queryCondition.equal = {
                ...this.queryCondition.equal,
                resolution: this.criteria.resolution
            }
        }
        //设备状态
        if (this.criteria.status) {
            this.queryCondition.equal = {
                ...this.queryCondition.equal,
                status: this.criteria.status
            }
        }
        //在线状态
        if (this.criteria.isOnline) {
            this.queryCondition.equal = {
                ...this.queryCondition.equal,
                isOnline: this.criteria.isOnline
            }
        }
        //mac地址
        if (this.criteria.mac) {
            this.queryCondition.blurQuery = {
                ...this.queryCondition.blurQuery,
                mac: this.criteria.mac
            }
        }

        this.onSearch(this.table.currentPage);
    }

    //编辑设备信息
    updateDeviceDetail() {
        this.httpService
            .post(environment.getUrl('device/' + this.deviceDetail.id), {
                _method: 'put',
                num: this.deviceDetail.num,
                description: this.deviceDetail.description
            })
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    this.deviceDetail = result.properties.device;
                    this.toastService.pop('success', '成功', '修改设备信息成功');
                } else {
                    this.toastService.pop('error', '失败', '修改设备信息失败，错误码：' + result.errorCode);
                }
            });
        this.onSearch(this.table.currentPage);
    }

    openAddDeviceModal() {
        this.addDevices = [{}];
        this.importAddDeviceModal.show();
    }

    addDeviceComponent() {
        if (this.addDevices.length < 20) {
            this.addDevices.push({});
        } else {
            this.toastService.pop("error", '警告', '单次最多添加20个设备');
        }
    }

    addDeviceAction() {
        let addDevicesParams = [];
        var i = 0;
        for (; i < this.addDevices.length; i++) {
            var addDevice_serialNum = this.addDevices[i].addDevice_serialNum;
            var addDevice_num = this.addDevices[i].addDevice_num;
            var addDevice_desc = this.addDevices[i].addDevice_desc;
            if(addDevice_serialNum==null || addDevice_serialNum==''|| addDevice_num==null || addDevice_num==''){
                this.toastService.pop("error", '警告','设备信息填写不完整，请填写后重新添加');
                return;
            }else{
                console.log('设备信息：'+addDevice_serialNum+','+addDevice_num+','+addDevice_desc);
                let params = {
                    identifier:addDevice_serialNum,
                    num:addDevice_num,
                    description:addDevice_desc
                };
                addDevicesParams.push(params);
                this.onSearch(this.table.currentPage);
            }

        }
        if(addDevicesParams.length>0){
            let addDevicesParamsStr = JSON.stringify(addDevicesParams);
            console.log("addDevicesParamsStr="+addDevicesParamsStr);
            this.httpService.post(environment.getUrl('device/add'), {
                data:addDevicesParamsStr
            })
                .map((response) => response.json())
                .subscribe((result) => {
                    console.log(result);
                    if (result.status == '1') {
                        this.toastService.pop("success", '成功',addDevice_num+'设备添加成功');
                    } else {
                        this.toastService.pop('error', '数据异常，错误码：' + result.errorCode);
                    }
                });
        }
    }

    //打开安装卸载模态框
    openInstallAndUninstallModal() {
        this.operateDevices = [];
        let devices = this.operateDevices;
        this.table.getCheckedRows().forEach(function (device) {
            if (device.isOnline == 1) {
                devices.push(device);
            }
        })

        devices.push(this.table.getCheckedRows()[0]);

        if (this.operateDevices.length == 0) {
            this.toastService.pop("error", "警告", "当前已勾选的无在线设备，请至少勾选一部在线设备");
            return;
        }

        this.importInstallAndUninstallModal.show();
    }

    removeOperatorDevice(identifier:string){
        console.log("删除:"+identifier);
        var arrLength = this.operateDevices.length;
        if(arrLength == 1){
            this.toastService.pop("error","警告","至少保留一个设备");
            return;
        }
        var idx = -1;
        for(var i=0;i<arrLength;i++){
            if(identifier==this.operateDevices[i].identifier){
                idx=i;
                break;
            }
        }
        if(idx>=0){
            this.operateDevices = this.operateDevices.slice(0,idx).concat(this.operateDevices.slice(idx+1,arrLength));
        }
        console.log("删除后剩余:"+this.operateDevices.length);

    }

    //安装应用
    installPackageAction() {
        console.log('安装应用');
        let deviceIds = [];
        this.operateDevices.forEach(function (device) {
            deviceIds.push(device.identifier);
        })
        this.uploader.options.additionalParameter = {
            deviceIds: JSON.stringify(deviceIds)
        }

        this.uploader.uploadAll();
        this.importInstallAndUninstallModal.hide();
        this.toastService.pop("success", "正在上传安装应用。。。")
    }

    //卸载应用
    uninstallPackageAction() {
        console.log('卸载应用');
        var  deviceIds = '';
        var arrLength = this.operateDevices.length;
        this.operateDevices.forEach(function (installAndUninstallDevice) {
            deviceIds += installAndUninstallDevice.identifier +',';
        });
        deviceIds = deviceIds.slice(0,deviceIds.length-1);
        var packageName = $('#uninstallPackageName').val();
        if(packageName==''){
            this.toastService.pop('error', '警告','需输入正确的安装包名');
            return;
        }
        console.log("deviceIds="+deviceIds+';packageName='+packageName);
        this.httpService.get(environment.getUrl('uninstall'),{
            packageName:packageName,
            deviceIdList:deviceIds
        }).map((response)=>response.json())
            .subscribe((result)=>{
                console.log(result);
                if(result.status=='1'){
                    this.toastService.pop('success', '成功','安装包卸载成功');
                    this.importInstallAndUninstallModal.hide();
                }else{
                    this.toastService.pop('error', '失败','安装包卸载失败，错误码：' + result.errorCode);
                }
            });
    }

    //打开删除设备模态框
    openDeleteDeviceModal() {
        if (this.table.getCheckedRows().length == 0) {
            this.toastService.pop('error', '警告', '请先勾选需要删除的设备')
        } else {
            this.deleteModal.show();
        }
    }

    //删除设备
    deleteDevice() {
        var idList = [];
        this.table.getCheckedRows().forEach(function (row) {
            idList.push(row.id);
        })

        this.httpService
            .post(environment.getUrl('device'), {
                _method: 'delete',
                idList: idList
            })
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    this.toastService.pop('success', '成功', '设备删除成功');
                } else {
                    this.toastService.pop('error', '失败', '设备删除失败，错误码：' + result.errorCode);
                }
            });
        this.deleteModal.hide();
        this.onSearch(this.table.currentPage);
    }

    //打开关机重启模态框
    openShutdownAndRebootModal() {
        this.operateDevices = [];
        let devices = this.operateDevices;
        this.table.getCheckedRows().forEach(function (device) {
            if (device.isOnline == 1) {
                devices.push(device);
            }
        })

        devices.push(this.table.getCheckedRows()[0]);

        if (this.operateDevices.length == 0) {
            this.toastService.pop("error", "警告", "当前已勾选的无在线设备，请至少勾选一部在线设备");
            return;
        }

        this.importShutdownAndRebootModal.show();
    }

    //关机
    shutdownDevices() {
        this.importShutdownAndRebootModal.hide();
        var deviceIdList = [];
        this.operateDevices.forEach(function (device) {
            deviceIdList.push(device.identifier);
        })
        this.httpService
            .get(environment.getUrl('shutdown'), {
                deviceIdList: deviceIdList
            })
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    this.toastService.pop('success', '成功', '设备关机完成');
                } else {
                    this.toastService.pop('error', '失败', '设备关机失败，错误码：' + result.errorCode);
                }
            });
    }

    //重启
    rebootDevices() {
        this.importShutdownAndRebootModal.hide();
        var deviceIdList = [];
        this.operateDevices.forEach(function (device) {
            deviceIdList.push(device.identifier);
        })
        this.httpService
            .get(environment.getUrl('reboot'), {
                deviceIdList: deviceIdList
            })
            .map((response) => response.json())
            .subscribe((result) => {
                console.log(result);
                if (result.status == '1') {
                    this.toastService.pop('success', '成功', '设备重启完成');
                } else {
                    this.toastService.pop('error', '失败', '设备重启失败，错误码：' + result.errorCode);
                }
            });
    }

    cancelAddThisDevice(idx:number){
        console.log('移除设备'+(idx+1));
        if(this.addDevices.length>1){
            this.addDevices = this.addDevices.slice(0,idx).concat(this.addDevices.slice(idx+1,this.addDevices.length));
        }else{
            this.toastService.pop('error', '失败', '至少保留一个添加设备');
        }

    }

}

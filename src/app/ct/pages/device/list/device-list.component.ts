import {Component, ViewChild} from '@angular/core';
import {OurpalmTable, TableConfig, Page} from "ngx-ourpalm-table/lib";
import {environment} from "../../../../../environments/environment";
import {mask} from "../../../../shared/services/httpx.interceptor";
import {HttpService} from "../../../../shared/services/httpx.service";
import {ToastService} from "../../../../shared/services/toast.service";
import {ModalDirective} from "ngx-bootstrap";
import {Router, ActivatedRoute} from "@angular/router";

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

    constructor(private tableConfig: TableConfig,
                private httpService: HttpService,
                private toastService: ToastService,
                private route: ActivatedRoute,
                private router: Router,) {

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
                    iconCls: 'fa fa-mixcloud',
                    show: true,
                    disabled: () => this.table.getSelectedRows().length != 1,
                    onclick: () => {
                        this.navigateToDevieOperate();
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
                    this.toastService.pop('error', '数据异常，错误码：' + result.errorCode);
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
        //分辨率
        if (this.criteria.status) {
            this.queryCondition.equal = {
                ...this.queryCondition.equal,
                status: this.criteria.status
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
                } else {
                    this.toastService.pop('error', '修改设备信息失败，错误码：' + result.errorCode);
                }
            });
        this.onSearch(this.table.currentPage);
    }
}

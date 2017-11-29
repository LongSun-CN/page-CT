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
        name: ''
    };

    queryCondition = {
        equal: [],
        largerThan: [],
        lessThan: [],
        orderByAsc: [],
        orderByDesc: [],
    };


    rangeSelectData= [
        { id: '0' ,text: '等于'},
        { id: '1' ,text: '大于'},
        { id: '2' ,text: '小于'}
        ];

    table: OurpalmTable;
    currentPage: number;
    deviceDetail: any;

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
            singleSelect: true,
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

    onSearch(currentPage: number = 1) {
        this.httpService
            .get(environment.getUrl('devices/page'), {
                currentPage: currentPage,
                pageSize: this.table.pageSize,
                ...mask
            })
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

    openDetailModal() {
        this.loadDetail(this.table.getSelectedRows()[0].id);
        this.importModal.show();
    }

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

    saveQueryCondition() {
        this.queryCondition.equal.push({model:'123',value:"123"});
        this.queryCondition.equal.push({model:'123',value:"123"});
        this.queryCondition.equal.push({model:'123',value:"123"});
        this.queryCondition.equal.push({model:'123',value:"123"});

        console.log(this.queryCondition.equal);
    }
}

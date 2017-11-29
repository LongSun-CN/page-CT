import {Component, OnInit} from "@angular/core";
import {BaseService} from "./shared/services/base.service";
import {UserService} from "./widgets/user-box/user.service";
import {User} from "./widgets/user-box/user";
import {BodyOutputType, ToasterConfig} from "angular2-toaster";
import {TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {ToastService} from "./shared/services/toast.service";
import {DatepickerConfig} from "glowworm/lib/datepicker";
import {TableConfig} from "ngx-ourpalm-table";
import {INIT_USER_INFO, UserInfoState} from "./shared/reducers/userinfo-reducer";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    toastConfig: ToasterConfig;

    mylinks: Array<any> = [];

    /** 标示初始化工作是否完成 */
    initialized: boolean;

    constructor(private store: Store<any>,
                private userService: UserService,
                private baseService: BaseService,
                private config: DatepickerConfig,
                private tableConfig: TableConfig,
                private toastService: ToastService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {

        this.setToastConfig();//配置toast
        this.setI18nConfig();//配置国际化文件
        // this.setDatepickerConfig();
        this.setTableConfig();

        Promise.all([
            /** 异步接口完成后 再 初始化 */
            // this.getUserInfo(),
        ]).then(() => {
            this.initialized = true;

            this.refreshMenus();//刷新左侧菜单

        });
    }

    setTableConfig() {
        this.tableConfig.config = {
            ctrlSelect: true,
            pageSize: 100,
            pageList: [100, 200],
            enabledFloatThead: false,
            floatTheadConfig: {
                zIndex: 10,
                // position: 'absolute',
                responsiveContainer: function ($table) {
                    return $table.closest('.table-responsive');
                },
                top: () => ((<any>window).screenfull.isFullscreen) ? 3 : 50
            }
        }
    }


    /*setDatepickerConfig() {
      const format = this.config.locale.format, timePickerIncrement = this.config.timePickerIncrement;
      const today_s = moment(moment().format('YYYY-MM-DD')).format(format),
        today_e = moment(today_s).add(1, 'days').subtract(timePickerIncrement, 'minute').format(format),
        yesterday_s = moment(moment().format('YYYY-MM-DD')).subtract(1, 'days').format(format),
        yesterday_e = moment(yesterday_s).add(1, 'days').subtract(timePickerIncrement, 'minute').format(format),
        week_s = moment(today_s).subtract(moment().isoWeekday() - 1, 'days').format(format),
        week_e = moment(week_s).add(7, 'days').subtract(timePickerIncrement, 'minute').format(format),
        lastWeek_s = moment(week_s).subtract(7, 'days').format(format),
        lastWeek_e = moment(week_e).subtract(7, 'days').format(format),
        month_s = moment(moment().format('YYYY-MM-DD')).subtract(moment().date() - 1, 'days').format(format),
        month_e = moment(month_s).add(1, 'month').subtract(timePickerIncrement, 'minute').format(format),
        lastMonth_s = moment(month_s).subtract(1, 'month').format(format),
        lastMonth_e = moment(month_e).subtract(1, 'month').format(format);
      Object.assign(this.config, {
          opens: 'center',
          singleDatePicker: false,
          startDate: today_s,
          endDate: today_e,
          ranges: { //今天、昨天  本周、上周 本月、上月
            '今天': [
              today_s, today_e
            ],
            '昨天': [
              yesterday_s, yesterday_e
            ],
            '本周': [
              week_s, week_e
            ],
            '上周': [
              lastWeek_s, lastWeek_e
            ],
            '本月': [
              month_s, month_e
            ],
            '上月': [
              lastMonth_s, lastMonth_e
            ]
          }
        }
      );
    }*/

    setToastConfig() {
        this.toastConfig = new ToasterConfig({
            newestOnTop: true,
            showCloseButton: true,
            tapToDismiss: false,
            bodyOutputType: BodyOutputType.TrustedHtml
        });
    }

    setI18nConfig() {
        const localMap = {
            "zh_CN": "zh_CN",
            "en_US": "en_US",
            "zh_HK": "zh_HK",
            "th_TH": "th_TH",
            "ko_KR": "ko_KR",
            "ja_JP": "ja_JP"
        };

        this.translate.addLangs(["zh_CN"]);
        this.translate.setDefaultLang(localMap.zh_CN);
        this.translate.use(localMap.zh_CN);
    }

    /* getUserInfo(): Promise<User> {
       return new Promise((resolve, reject) => {
         this.baseService.getUserInfo().subscribe((result) => {
           if (result.status == '0') {
             let user = new User(result.data);
             user.moduleId = user.modules[0].code;

             user.modules.push({name: 'mis', code: 'mis'});
             user.menu.map(function (item) {
               return item.url = item.url.replace(/\./g, '/').replace('base/', '').replace('quality', 'kfqa');
             });

             let userInfo: UserInfoState = {
               user: user
             };

             this.store.dispatch({
               type: INIT_USER_INFO,
               payload: userInfo
             });

             this.userService.setCurrentUser(user);
             resolve(user);
           } else {
             this.toastService.pop('error', result.desc);
             reject();
           }
         });
       });
     }*/

    refreshMenus() {

        this.mylinks = [
            {
                title: '设备管理',
                icon: 'fa fa-link',
                children: [
                    {
                        path: 'ct/device/list',
                        title: '设备列表',
                        icon: 'fa fa-link',
                    }
                ]
            }
        ]
    }
}

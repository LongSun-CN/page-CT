import {Injectable} from "@angular/core";
// import * as moment from "moment";

export class locale {
    format?: string;
    applyLabel?: string;
    customRangeLabel?: string;
    cancelLabel?: string;
    daysOfWeek?: Array<string>;
    monthNames?: Array<string>;
    firstDay?: number;
}

@Injectable()
export class datepicker {
    singleDatePicker?: boolean = false;
    timePicker?: boolean = true;
    timePickerIncrement?: number = 5;
    showDropdowns?: boolean = true;
    timePicker24Hour?: boolean = true;
    autoUpdateInput?: boolean = false;
    showCustomRangeLabel?: boolean = false;
    alwaysShowCalendars?: boolean = true;
    opens?: string = "right";
    showYear?: boolean = true;
    locale?: locale = {
        format: 'YYYY-MM-DD HH:mm:ss',
        applyLabel: '确定',
        customRangeLabel: "自定义",
        cancelLabel: '清空',
        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        firstDay: 1
    };
    ranges?: Object = {
        '今天': [
            moment(), moment()
        ],
        "最近七天": [
            moment().subtract(6, 'days'), moment()
        ],
        "最近30天": [
            moment().subtract(29, 'days'), moment()
        ],
        "当前月": [
            moment().startOf('month'), moment().endOf('month')
        ]
    };

}

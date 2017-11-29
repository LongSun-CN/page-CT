import {Component, ElementRef, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {datepicker} from "./datepicker";
import {TranslateService} from "@ngx-translate/core";
// import * as moment from "moment";
// import * as $ from "jquery";
// import "bootstrap-daterangepicker";

@Component({
    selector: '[ourpalm-daterangepicker]',
    template: `<ng-template></ng-template>`
})
export class OurpalmDatePickerComponent implements OnInit {
    @Input()
    options: string;
    @Input()
    ngModel: string;

    @Output()
    ngModelChange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    _change: EventEmitter<string> = new EventEmitter<string>();



    constructor(private  el: ElementRef, private  picker: datepicker, private translate: TranslateService) {


    }

    ngOnInit() {
      this.translate.get(['确定', '自定义', '清空', '日', '一', '二', '三', '四', '五', '六', '一月', '二月',
        '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', '今天', '最近七天', '最近30天', '当前月']).subscribe((res: any) => {
        this.picker.locale = {
          format: 'YYYY-MM-DD HH:mm:ss',
          applyLabel: res['确定'],
          customRangeLabel: res["自定义"],
          cancelLabel: res['清空'],
          daysOfWeek: [res['日'], res['一'], res['二'], res['三'], res['四'], res['五'], res['六']],
          monthNames: [res['一月'], res['二月'], res['三月'], res['四月'], res['五月'], res['六月'], res['七月'], res['八月'], res['九月'], res['十月'],
            res['十一月'], res['十二月']],
          firstDay: 1
        };
        this.picker.ranges[res["今天"]] = [moment(), moment()];
        this.picker.ranges[res["最近七天"]] = [moment().subtract(6, 'days'), moment()];
        this.picker.ranges[res["最近30天"]] = [moment().subtract(29, 'days'), moment()];
        this.picker.ranges[res["当前月"]] = [moment().startOf('month'), moment().endOf('month')];
        this.myinit();
      })
    }

    myinit(){
      let that = this;
      let onViewChangeEvent = function (start, end) {
        let _this = this;
        if (_this.singleDatePicker) {
          let startTime = start.format(_this.locale.format);
          that.ngModelChange.emit(startTime);
          that._change.emit(startTime);

        } else {
          let startTime = start.format(_this.locale.format);
          let endTime = end.format(_this.locale.format);
          that.ngModelChange.emit(`${startTime} - ${endTime}`);
          that._change.emit(`${startTime} - ${endTime}`);
        }

      };

      //this.picker.locale = $.extend({},this.picker.locale,this.options['locale']);
      let options = $.extend(true,{}, this.picker, (typeof  this.options === 'string' ? eval('(' + this.options + ')'):this.options));

      options.singleDatePicker && (options.ranges = undefined);

      (<any>$(this.el.nativeElement)).daterangepicker(options, onViewChangeEvent);



      $(this.el.nativeElement).on('cancel.daterangepicker', function (ev, picker) {
        if (!that.ngModelChange) return;
        that.ngModelChange.emit(``);
        that._change.emit(``);
      });


      $(this.el.nativeElement).on('apply.daterangepicker', function (ev, picker) {
        if (!that.ngModelChange) return;

        let start = picker.startDate, end = picker.endDate;

        setTimeout(function () {
          if (options.singleDatePicker) {
            let startTime = start.format(options.locale.format);
            that.ngModelChange.emit(startTime);
          } else {
            let startTime = start.format(options.locale.format);
            let endTime = end.format(options.locale.format);
            that.ngModelChange.emit(`${startTime} - ${endTime}`);
          }
        });
      });
    }

}

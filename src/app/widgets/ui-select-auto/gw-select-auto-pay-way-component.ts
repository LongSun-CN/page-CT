import {Component, Input, OnInit, forwardRef, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {SEARCH_SUBCHANNEL, serviceState} from "./ui-select-auto.reducer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UiselectAutoService} from "./ui-select-auto.service";
import {Subscription} from "rxjs/Subscription";

export const GW_VIP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoPayWayComponent),
  multi: true
};

@Component({
  selector: 'gw-select-auto-pay-way',
  template: `
    <gw-single-select  [toolbar]="toolbar"
                      label="{{'支付方式'|translate}}"
                      [data]="payways"
                      [(ngModel)]="value"
                       [closeable]="closeable"
                      [enabled]="enabled"
                      [showSelect]="false"
                       
    ></gw-single-select>
  `,
  styles: [''],
  providers: [GW_VIP_VALUE_ACCESSOR]
})
export class GwSelectAutoPayWayComponent implements OnInit, ControlValueAccessor,OnDestroy {

  onChange: any;
  onTouched: any;


  @Input()
  key: string;
  @Input()
  label: string;
  @Input()
  toolbar:any;
  @Input()
  closeable:boolean;
  @Input()
  enabled:boolean = true;

  _value:string;
  payways:{id:string,text:string}[];

  $scribtion:Subscription;

  constructor(private  $store: Store<serviceState>,private uiselectServicce:UiselectAutoService) {

  }

  ngOnInit() {
    this.$scribtion = this.$store.select('paychannel').map((state:serviceState[])=>{
      state = state.filter(item=>{
        return item.key === this.key;
      });
      return state;
    }).subscribe(result=>{
      this.payways = (result&&result[0]&&result[0].data)||[];
      this.payways = this.payways.filter(item=>{
         return item.id !== '-1'&&item.id !== '';
      })
    })
  }


  set value(value: string) {
    this._value = value;
    this.onTouched && this.onTouched();
    this.onChange && this.onChange({id:value,text:''});
  }
  get value(){
    return this._value;
  }

  writeValue(obj: any): void {
    this.value = (obj&&obj.id);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy(){
    this.$scribtion.unsubscribe();
  }
}

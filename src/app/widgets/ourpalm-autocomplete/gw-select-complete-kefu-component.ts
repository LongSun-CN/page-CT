import {Component, Input, OnInit,  forwardRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {KefuState} from "./kefu.reducer";
import {KefuService} from "./ourpalm-kefucomplete.server";
import {Observable} from "rxjs/Observable";

export const GW_KEFU_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoKefuComponentComponent),
  multi: true
};

@Component({
  selector: 'gw-select-complete-kefu',
  template: ` 
    <gw-single-select [toolbar]="toolbar"  
                      [label]="label"
                      [data]="(kefuList|async)[type==='1'?'kefu':'admin']"
                      [ngModel]="_value"
                      (ngModelChange)="outValue($event)"
                      [closeable]="false"
                      [enabled]="true"
                      [showSelect]="false" 
    ></gw-single-select> 
  `,
  styles: [''],
  providers: [GW_KEFU_VALUE_ACCESSOR]
})
export class GwSelectAutoKefuComponentComponent implements OnInit, ControlValueAccessor {
  @Input()
  toolbar:any;
  @Input()
  type:'1'|'2';
  @Input()
  label:string;
  _value:string;
  kefuList:Observable<KefuState>;
  onChange: any;
  onTouched: any;

  constructor(private  $store: Store<KefuState>,private kefu:KefuService) {

  }

  ngOnInit() {
    if(this.type==='1'){
      this.kefu.getGwKfInfoList();
    }else{
      this.kefu.getGwAdminInfoList();
    }
    this.kefuList = this.$store.select('kefu');
  }

  set value(value: string) {
     console.log('set _value before:',this._value,value);
    this._value = value;
    this.onTouched && this.onTouched();
    if(this.type==='1'){
      this.onChange && this.onChange({userId:value,text:''});
    }else{
      this.onChange && this.onChange({accountId:value,text:''});
    }
  }

  outValue(ev){

    this._value = ev;
    this.onTouched && this.onTouched();
    if(this.type==='1'){
      this.onChange && this.onChange({userId:ev,text:''});
    }else{
      this.onChange && this.onChange({accountId:ev,text:''});
    }

  }

  writeValue(obj: any): void {
    if(this.type==='1'){
      this.value = (obj&&obj.userId);
    }else{
      this.value = (obj&&obj.accountId);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

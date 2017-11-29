import {Component, Input, OnInit, forwardRef, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {SEARCH_PAYCHANNELS, SEARCH_SUBCHANNEL, serviceState} from "./ui-select-auto.reducer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UiselectAutoService} from "./ui-select-auto.service";
import {Subscription} from "rxjs/Subscription";

export const GW_VIP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoMainChannelComponent),
  multi: true
};

@Component({
  selector: 'gw-select-auto-mainchannel',
  template: `
    <gw-single-select  [toolbar]="toolbar"
                      label="{{'主渠道'|translate}}"
                      [data]="channels"
                      [(ngModel)]="value"
                       [closeable]="closeable"
                      [enabled]="enabled"
                      [showSelect]="false"
                       (onSave)="selctMainChannel($event)"
    ></gw-single-select>
  `,
  styles: [''],
  providers: [GW_VIP_VALUE_ACCESSOR]
})
export class GwSelectAutoMainChannelComponent implements OnInit, ControlValueAccessor,OnDestroy {

  onChange: any;
  onTouched: any;


  @Input()
  key: string;
  @Input()
  toolbar:any;
  @Input()
  closeable:boolean;
  @Input()
  enabled:boolean = true;
  @Input()
    emit:string;

  _value:string;
  channels:{id:string,text:string}[];

  $scribtion:Subscription;

  constructor(private  $store: Store<serviceState>,private uiselectServicce:UiselectAutoService) {

  }

  ngOnInit() {
    this.$scribtion = this.$store.select('mainChannel').map((state:serviceState[])=>{
      state = state.filter(item=>{
        return item.key === this.key;
      });
      return state;
    }).subscribe(result=>{
      this.channels = (result&&result[0]&&result[0].data)||[];
      this.channels = this.channels.filter(item=>{
         return item.id !== '-1'&&item.id !== '';
      })
    })
  }

  selctMainChannel(ev:any){
    this.uiselectServicce.doqueryAcordsChannel(ev,SEARCH_SUBCHANNEL,this.key,this.emit,SEARCH_PAYCHANNELS);
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

import {Component, Input, OnInit, forwardRef, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {SEARCH_MAINCHANNEL, SELECT_CHANNELID, serviceState} from "./ui-select-auto.reducer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UiselectAutoService} from "./ui-select-auto.service";
import {Subscription} from "rxjs/Subscription";

export const GW_VIP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoChannelComponentComponent),
  multi: true
};



@Component({
  selector: 'gw-select-auto-channel',
  template: `
    <gw-single-select  [toolbar]="toolbar"
                      label="{{'联运'|translate}}"
                      [data]="channels"
                      [(ngModel)]="value"
                       [closeable]="closeable"
                      [enabled]="enabled"
                      [showSelect]="false"
                       (onSave)="selctChannel($event)"
    ></gw-single-select>
  `,
  styles: [''],
  providers: [GW_VIP_VALUE_ACCESSOR]
})
export class GwSelectAutoChannelComponentComponent implements OnInit, ControlValueAccessor,OnDestroy {

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
    this.$scribtion = this.$store.select('channel').map((state:serviceState[])=>{
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

  selctChannel(ev:any){
    window.localStorage.setItem(this.key+SELECT_CHANNELID,ev);
    this.uiselectServicce.doqueryAcordsChannel(ev,SEARCH_MAINCHANNEL,this.key,this.emit);
  }


  set value(value: string) {
    if(this._value!==value){
      this._value = value;
      this.onTouched && this.onTouched();
      this.onChange && this.onChange({id:value,text:''});
    }
  }

  // get value(){
  //   return this._value;
  // }

  writeValue(obj: any): void {
    if(obj&&obj.id){
      this.value = (obj&&obj.id);
    }
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

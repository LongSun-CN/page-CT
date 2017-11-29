import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import  {Store} from '@ngrx/store';
import {SEARCH_MAINCHANNEL, SEARCH_SERVICE, SEARCH_SUBCHANNEL, serviceState} from "./ui-select-auto.reducer";
import { simpleObject} from "../../entity/simple.map";
import {Subscription} from "rxjs/Subscription";
import {LanProTypeService} from "../language-producttype/language-producttype.service";
import {BaseService} from "../../shared/services/base.service";


@Component({
  selector: 'ourpalm-pay-way-auto',
  template: `<div class="form-group">
    <label *ngIf="!labelName" class="control-label" >
      {{'支付方式'|translate}}
    </label>
    <label  *ngIf="labelName" class="control-label">
      {{labelName}}
    </label>
    <div class="class">
      <ng-select    [items]="items"
                    placeholder="{{'请选择支付方式！'|translate}}"
                    (selected) = "selectedChannel($event)"
                    [active]="selected"
                    [disabled] = "disable"
      >
      </ng-select>
    </div>
  </div>
  `,
  styles: [`.form-group > div{height: 30px;}`],
})
export class UiSelectAutoPayWaysComponent implements OnInit,OnDestroy,OnChanges {
  @Input()
  ngModel: simpleObject;
  @Output()
  ngModelChange: EventEmitter<simpleObject> = new EventEmitter<simpleObject>();
  @Input()
  disable : Boolean =  false;

  @Input()
  key:string = 'index';
  @Input()
  select:simpleObject;


  @Input()
  labelName: string = '';

  items:  simpleObject[];
  selected:simpleObject[];
  $subscription:Subscription;

  constructor(private  $store: Store<serviceState>, private lanService: LanProTypeService, private baseService: BaseService) {

  }

  ngOnInit() {
    this.$subscription = this.$store.select('paychannel').map((state:serviceState[])=>{
      state = state.filter(item=>{
        return item.key === this.key;
      });
      return state;
    }).subscribe(result=>{
      this.items = (result&&result[0]&&result[0].data)||[];
      this.selected = [(this.ngModel&&this.ngModel.text&&this.ngModel)||this.items[0]||{id:'',text:''}];
    })
  }

  selectedChannel(ev) {
    if (!this.ngModel || this.ngModel.id !== ev.id) {
       this.ngModel = ev;
      if(this.ngModel.id==='-1'){
        this.ngModel.id='';
      }

       this.ngModelChange.emit(this.ngModel);
    }
  }

  ngOnChanges(){
    this.select&&(this.selected = [this.select]);
  }

  ngOnDestroy(){
    this.$subscription.unsubscribe();
  }

}

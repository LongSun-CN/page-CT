import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import  {Store} from '@ngrx/store';
import {ProductState, SEARCH_SERVICE, SEARCH_CHANNEL, SEARCH_VIP} from "./ui-select-auto.reducer";
import {LanProState} from "../language-producttype/language-producttype.reducer";
import {Observable} from "rxjs/Observable";
import {simpleMap, simpleObject} from "../../entity/simple.map";
import {BaseService} from "../../shared/services/base.service";
import {Subscription} from "rxjs/Subscription";
import {LanProTypeService} from "../language-producttype/language-producttype.service";
import {urlParam} from  "../../shared/url-param.const";

@Component({
  selector: 'ourpalm-products-auto',
  template: `<div class="form-group" style="margin-bottom: 0px" [hidden]="true">
    <label *ngIf="!labelName" class="control-label" >
      {{'产品'|translate}} 
    </label>
    <label  *ngIf="labelName" class="control-label">
      {{labelName}} 
    </label>
    <div class="class">
      <ng-select    [items]="items"
                    placeholder="{{'请选择产品！'|translate}}"
                    [active]="[myselected]"
                    (selected) = "selectedProduct($event)"
                    [disabled] = "disable"

      >
      </ng-select>
    </div>
  </div>`,
  styleUrls: ['./ui-select-auto.component.css'],
})
export class UiSelectAutoProductComponent implements OnInit, OnDestroy,OnChanges {

  @Input()
  ngModel: simpleObject;
  @Output()
  ngModelChange: EventEmitter<simpleObject> = new EventEmitter<simpleObject>();
  @Input()
  disable : Boolean = false;

  @Output()
  selectCall: EventEmitter<simpleObject> = new EventEmitter<simpleObject>();

  myselected:simpleObject;
  @Input()
  select:simpleObject;

  @Input()
  key:string = 'index';

  @Input()
  labelName: string = '';

  @Input()
  emit:string = '';

  items: {id:string,text:string}[];
  currentLangaue: simpleMap;


  constructor(private  $store: Store<ProductState>, lanService: LanProTypeService, private baseService: BaseService) {
       this.items = [{id:urlParam.product,text:'默认产品'}];
       this.currentLangaue = lanService.getCurrentLanguage()
  }

  selectedProduct(ev,force:boolean = false) {
    if (!this.ngModel||this.ngModel.id !== ev.id ||force) {
      this.ngModel = ev;
      if(this.ngModel.id==='-1'){
        this.ngModel.id='';
      }
      this.ngModelChange.emit(this.ngModel);
      this.emit.includes('1')&&this.baseService.getLogicServerList({
          productId: ev.id,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
           item = {text:item.name,id:item.code} ;
          return item;
         });
        this.$store.dispatch({type:SEARCH_SERVICE,payload:{key:this.key,data:[{id:'-1',text:'请选择'},...map]}});
      });

      this.emit.includes('2')&&this.baseService.getOperationLineList({
          productId: ev.id,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
          item = {text:item.name,id:item.oplId} ;
          return item;
        });
        this.$store.dispatch({type:SEARCH_CHANNEL,payload:{key:this.key,data:[{id:'-1',text:'请选择'},...map]}});
      });

      this.emit.includes('3')&&this.baseService.getVipLevel({
          productId: ev.id,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.vipInfoBean.map(item=>{
          item = {text:item.vipLevelName,id:item.vipLevelValue} ;
          return item;
        });
        this.$store.dispatch({type:SEARCH_VIP,payload:{key:this.key,data:[{id:'-1',text:'请选择'},...map]}});
      });

      if(this.selectCall){
          this.selectCall.emit(this.ngModel);
      }

    }
  }

  ngOnInit() {
    this.myselected =  this.items[0];
  }

  ngOnChanges(...args){

    if(args[0].select&&args[0].select.currentValue&&args[0].select.currentValue.id&&args[0].select.currentValue.id!='-1'){
      this.myselected = args[0].select.currentValue;
      this.myselected.id!=='-1'&&this.selectedProduct(this.myselected,true);
      if(this.myselected.id&&!this.myselected.text){
        this.items.forEach(item=>{
          item.id===this.myselected.id&&(this.myselected.text=item.text)
        })
      }
    }else if(args[0].select&&args[0].select.currentValue&&!args[0].select.currentValue.id){
      this.myselected = {id:'-1',text:'请选择'};
    }
  }



  ngOnDestroy() {

  }
}



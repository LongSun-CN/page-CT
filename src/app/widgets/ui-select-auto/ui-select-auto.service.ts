/**
 * Created by admin on 2017/6/26.
 */

import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {ProductState, SEARCH_CHANNEL, SEARCH_SERVICE, SEARCH_VIP, SELECT_CHANNELID} from "./ui-select-auto.reducer";
import {simpleMap} from "../../entity/simple.map";
import {Store} from "@ngrx/store";
import {LanProTypeService} from "../language-producttype/language-producttype.service";
import {urlParam} from "../../shared/url-param.const";
@Injectable()
export class UiselectAutoService {

  currentLangaue: simpleMap;

    constructor(private baseService:BaseService,private  $store: Store<ProductState>,private lanService:LanProTypeService)  {
       this.currentLangaue = lanService.getCurrentLanguage() ;
    }
    doqueryAcordsProduct(pid:string,key:string,type:string=""){
      type.includes('1')&&this.baseService.getLogicServerList({
          productId: pid,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
          item = {text:item.name,id:item.code} ;
          return item;
        });
        this.$store.dispatch({type:SEARCH_SERVICE,payload:{key:key,data:[{id:'',text:'请选择'},...map]}});
      });

      type.includes('2')&&this.baseService.getOperationLineList({
          productId: pid,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
          item = {text:item.name,id:item.oplId} ;
          return item;
        });
        this.$store.dispatch({type:SEARCH_CHANNEL,payload:{key:key,data:[{id:'',text:'请选择'},...map]}});
      });

      type.includes('3')&&this.baseService.getVipLevel({
          productId: pid,
          localId: this.currentLangaue.value
        }
      ).subscribe(result => {
        let map = result.data.vipInfoBean.map(item=>{
          item = {text:item.vipLevelName,id:item.vipLevelValue} ;
          return item;
        });
        this.$store.dispatch({type:SEARCH_VIP,payload:{key:key,data:[{id:'-1',text:'请选择'},...map]}});
      });
    }

    doqueryAcordsChannel(operationLineId:string,type:string,key:string,emit:string,type2?:string){
      emit.includes('1')&&this.baseService.getChannelList({
          productId:urlParam.product,
          operationLineId:  operationLineId
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
          item = {text:item.cprName,id:item.cprId} ;
          return item;
        });
        this.$store.dispatch({type:type,payload:{key:key,data:[{id:'-1',text:'请选择'},...map]}});
      });

      emit.includes('2')&&this.baseService.getPayChannelList({
            localeId:urlParam.language,
            mainChannel:operationLineId,
            operationLineId: window.localStorage.getItem(key+SELECT_CHANNELID),
            productId:urlParam.product,
        }
      ).subscribe(result => {
        let map = result.data.map(item=>{
          item = {text:item.name,id:item.id} ;
          return item;
        });
        this.$store.dispatch({type:type2,payload:{key:key,data:[{id:'-1',text:'请选择'},...map]}});
      });

    }
}

import {Store} from "@ngrx/store";
import {simpleMap, simpleObject} from "../../entity/simple.map";
import {Subscription} from "rxjs/Subscription";
import {LanProState} from "./language-producttype.reducer";
import {Injectable, OnDestroy} from "@angular/core";
import {ProductState} from "../ui-select-auto/ui-select-auto.reducer";
import {urlParam} from "../../shared/url-param.const";
/**
 * Created by admin on 2017/7/7.
 */
@Injectable()
export class LanProTypeService implements  OnDestroy{

  currentLanguage:simpleMap = {name:'',value:''};
  currentProductType:simpleMap = {name:'',value:''};
  currentProduct:simpleObject = {text:'默认产品',id:''};
  productList:simpleObject[];

  // $subcription1:Subscription;
  // $subcription2:Subscription;
  // $subcription3:Subscription;

   constructor(private  store:Store<any>){
     // this.$subcription1 = store.select('lan').subscribe((state: LanProState) => {
     //     this.currentLanguage = state.data[0];
     // });
     // this.$subcription2 = store.select('proType').subscribe((state: LanProState) => {
     //   this.currentProductType = state.data[0];
     // });
     //
     // this.$subcription3 = store.select('product').subscribe((state:ProductState) =>{
     //   this.productList = state.data;
     // });


     this.currentLanguage.value = urlParam.language;
     this.currentProduct.id =  urlParam.product;
   }


   getCurrentLanguage():simpleMap{
     return this.currentLanguage;
   }

   getCurrentProductType():simpleMap{
     return this.currentProductType;
   }

   getAllProduct():simpleObject[]{
     return this.productList;
   }

  getCurrentProduct():simpleObject{
    return this.currentProduct;
  }

   ngOnDestroy(){
     // this.$subcription2.unsubscribe();
     // this.$subcription1.unsubscribe();
     // this.$subcription3.unsubscribe();
   }
}

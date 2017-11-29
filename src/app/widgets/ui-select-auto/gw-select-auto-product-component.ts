import {Component, Input, OnInit, forwardRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Store} from "@ngrx/store";
import {ProductState} from "./ui-select-auto.reducer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UiselectAutoService} from "./ui-select-auto.service";
import {Subscription} from "rxjs/Subscription";
import {simpleObject} from "../../entity/simple.map";
import {urlParam} from  "../../shared/url-param.const";
export const GW_PRODUCT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoProductComponentComponent),
  multi: true
};

@Component({
  selector: 'gw-select-auto-product',
  template: `
    <div [hidden]="true">
    <gw-single-select    
                      [label]="label"
                      [data]="products"
                      [(ngModel)]="value"
                        [closeable]="false"
                      [enabled]="true"
                      [showSelect]="false"
                      (onSave)="selctProduct($event)"
    ></gw-single-select>
    </div>
  `,
  styles: [''],// (ngModelChange)="outValue($event)"
  providers: [GW_PRODUCT_VALUE_ACCESSOR]
})
export class GwSelectAutoProductComponentComponent implements OnInit, ControlValueAccessor,OnDestroy {

  onChange: any;
  onTouched: any;


  @Input()
  key: string;

  @Input()
  toolbar:any;

  @Input()
  type:string;
  products: simpleObject[];
  label:string = '产品';
  enabled:boolean = true;
  _value:string;

  @Output()
   onSelect:EventEmitter<void> = new EventEmitter<void>();

  $scribtion:Subscription;
  constructor(private  $store: Store<ProductState>,private  uiselectServicce:UiselectAutoService) {

  }

  ngOnInit() {
    this.products = [{id:urlParam.product,text:'默认产品'}];
    this.value = urlParam.product;
    setTimeout(()=>{
      this.uiselectServicce.doqueryAcordsProduct(urlParam.product,this.key,this.type);
    })
    //   this.$scribtion = this.$store.select('product').subscribe((res:ProductState)=>{
    //    this.products = res.data.filter(item=>{
    //          return item.id !== '-1';
    //    });
    // });
  }


  selctProduct(ev:string){
    this.onSelect.emit();
    this.uiselectServicce.doqueryAcordsProduct(ev||this._value,this.key,this.type)
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
    this.onTouched && this.onTouched();
    this.onChange && this.onChange({id:this.value,text:''});
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy(){
    //this.$scribtion.unsubscribe();
  }
}

import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {OurpalmAutoComplete} from "./OurpalmAutoComplete";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'ourpalm-autocomplete',
  template: `<div class="dropdown" style="display:inline-block;" tabindex="1"  >
                        <input #auto type="text" [disabled]="isDisabled" class="form-control dropdown-toggle" [ngClass]="inputClass" 
                        [(ngModel)]="textValue"  (input)="onValueChange($event);" (focus)="onFocus($event);"    
                          (blur) = "onBlur()"  placeholder="{{placeholder}}">
                        <ul *ngIf="showPanel" class="dropdown-menu" style="display:inline-block;">
                            <li *ngFor="let row of formatterData">
                                <a (click)="onRowClickedEvent(row);" [innerHTML]="row.text"></a>
                            </li>
                            <li *ngIf="formatterData.length == 0" (click)="noMore();"><a>{{'暂无更多数据'|translate}}</a></li>
                        </ul>
                    </div>`
})
export class OurpalmAutocompleteComponent implements OnInit,OnDestroy,OnChanges {

  @Input('autocomplete')
  options:OurpalmAutoComplete;
  @Input()
  placeholder:string = "";
  @Input()
  isDisabled:Boolean = false;
  @Input()
  inputClass:string;


  // @Input()
  // ngModel;
  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();


  @Output()
  ngModelChange: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  ngModel:{[index:string]:string};



  private searchTerms = new Subject<string>();
  $subscription :Subscription;
  @Input()
  textValue:string='';
  showPanel:boolean = false;
  formatterData:any[];

  constructor() { }

  ngOnInit() {
    this.$subscription = this.searchTerms.debounceTime(this.options.waitTime)
        .distinctUntilChanged()
        .subscribe(item=>{
           item?this.loader(item):(this.showPanel = false);
        })
  }

  ngOnChanges(changes){
      if(this.ngModel&&this.ngModel.name)this.textValue = this.ngModel.name;
  }


  loader(search:string){
    this.options.loader(search,(data=>{
      this.formatterData = data;
      this.showPanel = true;
      this.formatterData.forEach(item=>{
        item['value'] = this.options.formatterValue(item);
        item['text'] = this.options.formatterRow(item);
      })
    }))
  }

  onValueChange(ev?){
     this.searchTerms.next(ev?ev.target.value:'');
  }

  onFocus(event:any){
    (this.textValue&&this.textValue.length>this.options.minLength) ? this.onValueChange() :(this.showPanel = false);
  }

  onBlur(){
    setTimeout(()=>{  this.showPanel = false;},200);
  }

  noMore(){
    this.showPanel = false;
    this.textValue = "";
  }

  onRowClickedEvent(row:any){
      row.value===this.textValue&&(this.textValue = '');
      setTimeout(()=>{
        this.textValue =  row.value;
        this.showPanel = false;
        this.valueChange.emit(row);
        this.ngModelChange.emit(row);
      });
  }

  ngOnDestroy(){
    this.$subscription.unsubscribe();
  }
}

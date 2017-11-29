/**
 * Created by admin on 2017/6/30.
 */
export class OurpalmAutoComplete{
  minLength?:number = 0;
  waitTime?:number = 1000;
  focusOutHide?:Boolean =  false;
  loader(val, callback) {
  }
  formatterRow?(row:any) :any{
     return row;
   }
  formatterValue?(row):any {
     return row;
  }

  constructor(param:any){
      for(let key in param){
          this[key] = param[key]
      }
  }
}

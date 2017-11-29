import {HttpService} from "../../shared/services/httpx.service";
import {Injectable, OnInit} from "@angular/core";
import {OurpalmAutoComplete} from "./OurpalmAutoComplete";
import {environment} from "../../../environments/environment";
import {Store} from "@ngrx/store";
import {KEFU_SEARCH, KefuState} from "./kefu.reducer";
/**
 * Created by admin on 2017/7/18.
 */
@Injectable()
export  class KefuService  {
    autocompleteService:OurpalmAutoComplete;

    autocompleteAdminService:OurpalmAutoComplete;

  constructor(private http:HttpService,private $store:Store<KefuState>){
    const that = this;
    this.autocompleteService = new OurpalmAutoComplete({
      loader:function(val, callback) {
        that.getKfInfoList(val,10).then(result=>{
          callback(result.data || [])
        })
      },
      formatterRow:function(row:any) :any{
        return `${row.name}(${row.user})(${row.jobnum})`;
      },
      formatterValue:function(row):any {
        return row.name;
      }
    });

    this.autocompleteAdminService = new OurpalmAutoComplete({
      loader:function(val, callback) {
        that.getAdminInfoList(val,10).then(result=>{
          callback(result.data || [])
        })
      },
      formatterRow:function(row:any) :any{
        return `${row.name}(${row.account})(${row.jobNumber})`;
      },
      formatterValue:function(row):any {
        return row.name;
      }
    });


  }




  //查询客服接口
  getKfInfoList(accountOrName:string,count:number):Promise<any>{
    const param = {
      accountOrName: accountOrName,
      count: count,
      mask_key:false
    };
    return this.http
      .get(environment.getUrl('customService/kfqa/queryKfInfoList.htm'),param)
      .map(res=>res.json())
      .toPromise()
  }

  //查询管理员接口
  getAdminInfoList(accountOrName:string,count:number):Promise<any>{
    const param = {
      accountOrName: accountOrName,
      count: count,
      mask_key:false
    };
    return this.http
      .get(environment.getUrl('bbs/notice/getAdminList.htm'),param)
      .map(res=>res.json())
      .toPromise()

  }

  getKefuautocomplete():OurpalmAutoComplete{
     return  this.autocompleteService;
  }

  //查询客服接口
  getGwKfInfoList():void{
    const param = {
      accountOrName: '',
      count: '0'
    };
      this.http
      .get(environment.getUrl('customService/kfqa/queryKfInfoList.htm'),param)
      .map(res=>res.json())
      .subscribe(result=>{
        if(result.status === '0'){
          let list = [];
          result.data.forEach(item=>{
            list.push({id:item.userId,text:`${item.name}(${item.user})(${item.jobnum})`})
          });

            this.$store.dispatch({
              type:KEFU_SEARCH,
              payload:{
                key:'kefu',
                data:list
              }
            })
        }
      });
  }

  //查询管理员接口
  getGwAdminInfoList():void{
    const param = {
      accountOrName: '',
      count: '0'
    };
    this.http
      .get(environment.getUrl('bbs/notice/getAdminList.htm'),param)
      .map(res=>res.json())
      .subscribe(result=>{
        if(result.status === '0'){
          let list = [];
          result.data.forEach(item=>{
               list.push({id:item.accountId,text:`${item.name}(${item.account})(${item.jobNumber})`})
          });
          this.$store.dispatch({
            type:KEFU_SEARCH,
            payload:{
              key:'admin',
              data:list
            }
          })
        }
      });
  }

  getAdminautocomplete():OurpalmAutoComplete{
    return  this.autocompleteAdminService;
  }
}

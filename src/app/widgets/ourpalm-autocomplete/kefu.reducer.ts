/**
 * Created by admin on 2017/8/15.
 */
import {Action} from '@ngrx/store';

export const KEFU_SEARCH = 'kefu search';

export interface KefuState{
  [index:string]:{[index:string]:string}[]
}

export function KefuReducer(state:KefuState={},action:Action){
   switch  (action.type){
     case KEFU_SEARCH:
       state[action.payload.key] = action.payload.data;
       return state;
     default:
       return state;
   }
}

export const autoCopleteReducer={
   kefu:KefuReducer
};

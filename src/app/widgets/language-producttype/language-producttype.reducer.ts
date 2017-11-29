/**
 * Created by admin on 2017/6/19.
 */
import {Action} from "@ngrx/store";
import {simpleMap} from "../../entity/simple.map";

export interface LanProState {
    data: Array<simpleMap>
}

const initLanProState: LanProState = {
    data: []
}

export const SEARCH_LANGUGE = 'search language';
export const SET_LANGUGE = 'set language';
export const SET_PRODUCTTYPE = 'set productType';


export function languageProductReducer(state: LanProState = initLanProState, action: Action) {
    switch (action.type) {
        case SEARCH_LANGUGE:
            return action.payload;
        default :
            return state;
    }
}

export function currentLanguageReducer(state: LanProState = initLanProState, action: Action) {
    switch (action.type) {
        case SET_LANGUGE:
            return action.payload;
        default :
            return state;
    }
}

export function currentProductTypeReducer(state: LanProState = initLanProState, action: Action) {
    switch (action.type) {
        case SET_PRODUCTTYPE:
            return action.payload;
        default :
            return state;
    }
}


export const lanprotypeReducer = {
    lanPro: languageProductReducer,
    lan: currentLanguageReducer,
    proType: currentProductTypeReducer
}

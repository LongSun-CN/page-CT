import {Action} from "@ngrx/store";

export const INIT_PRODUCT_LANGUAGE_LIST = '[Init Product Language List]';
export const CLEAR_PRODUCT_LANGUAGE_LIST = '[Clear Product Language List]';

export const INIT_HEADER_PRODUCT_LANGUAGE_LIST = '[Init Header Product Language List]';
export const CLEAR_HEADER_PRODUCT_LANGUAGE_LIST = '[Clear Header Product Language List]';

/**
 * 语言id    lgId    String    不为空    HTTP
 * 语言名称    name    String    不为空    HTTP
 * 状态    status    String    不为空    HTTP    0：暂停；1：正常
 * 描述    description    String    不为空    HTTP
 * 是否删除    isDelete    String    可为空    HTTP    0：未删除；1：已删除
 */
export interface ProductLanguage {
    lgId?: string;
    name?: string;
    status?: string;
    description?: string;
    isDelete?: string;
}

export interface ProductLanguageState {
    initState?: boolean,
    languages: ProductLanguage[]
}

const initialState: ProductLanguageState = {
    initState: true,
    languages: []
};

/**
 * 控制台产品语言
 */
export function productLanguagesReducer(state: ProductLanguageState = initialState, action: Action) {
    switch (action.type) {
        case INIT_PRODUCT_LANGUAGE_LIST:
            return action.payload;
        case CLEAR_PRODUCT_LANGUAGE_LIST:
            return initialState;
        default:
            return state;
    }
}


/**
 * 菜单顶部左上边产品语言
 */
export function headerProductLanguagesReducer(state: ProductLanguageState = initialState, action: Action) {
    switch (action.type) {
        case INIT_HEADER_PRODUCT_LANGUAGE_LIST:
            return action.payload;
        case CLEAR_HEADER_PRODUCT_LANGUAGE_LIST:
            return initialState;
        default:
            return state;
    }
}
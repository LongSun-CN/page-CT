import {Action} from "@ngrx/store";

export const INIT_LANGUAGE_LIST = '[Init Language List]';

/**
 * 语言id    lgId    String    不为空    HTTP
 * 语言名称    name    String    不为空    HTTP
 * 状态    status    String    不为空    HTTP    0：暂停；1：正常
 * 描述    description    String    不为空    HTTP
 * 是否删除    isDelete    String    可为空    HTTP    0：未删除；1：已删除
 */
export interface Language {
    lgId?: string;
    name?: string;
    status?: string;
    description?: string;
    isDelete?: string;
}

export interface LanguageState {
    initState?: boolean,
    languages: Language[]
}

const initialState: LanguageState = {
    initState: true,
    languages: []
};

export function languagesReducer(state: LanguageState = initialState, action: Action) {
    switch (action.type) {
        case INIT_LANGUAGE_LIST:
            return action.payload;
        default:
            return state;
    }
}
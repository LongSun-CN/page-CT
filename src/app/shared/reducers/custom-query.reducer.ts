import {Action} from "@ngrx/store";

export const INIT_CUSTOM_QUERY_GROUP = '[Init Custom Query Group]';

/**
 * 用户偏好id    habitId    String    不为空    HTTP
 * 用户id    accountId    String    不为空    HTTP
 * 名称    name    String    不为空    HTTP
 * 模块Key    moduleKey    String    不为空    HTTP
 * 功能Key    functionKey    String    不为空    HTTP
 * 是否展示在控制台    showType    String    不为空    HTTP    0不展示1展示
 * 是否为系统级别的检索条件    systemType    String    不为空    HTTP    1是，0不是
 * 内容    content    String    不为空    HTTP
 * 删除标识    isdelete    String    不为空    HTTP    0未删除1已删除
 * 创建时间    createTime    String    不为空    HTTP
 * 创建人    createUser    String    不为空    HTTP
 * 修改人    modifyUser    String    不为空    HTTP
 * 修改时间    modifyTime    String    不为空    HTTP
 */
export interface Habit {
    habitId: string;
    name: string;
    moduleKey: string;
    functionKey: string;
    showType: string;
    systemType: string;
    content: string;
}

export interface CustomQueryGroup {
    id: string;
    habits: Habit[];
    name: string;
}

export interface CustomQueryGroupState {
    initState?: boolean,
    groups: CustomQueryGroup[]
}

const initialState: CustomQueryGroupState = {
    initState: true,
    groups: []
};

export function customQuerysReducer(state: CustomQueryGroupState = initialState, action: Action) {
    switch (action.type) {
        case INIT_CUSTOM_QUERY_GROUP:
            return action.payload;
        default:
            return state;
    }
}
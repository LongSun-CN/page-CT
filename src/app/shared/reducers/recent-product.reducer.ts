import {Action} from "@ngrx/store";

/**
 * 最近访问的产品列表
 */

export const INIT_RECENT_PRODUCT_LIST = '[Init Recent Product List]';

/**
 * 主键    id    String    不为空    HTTP
 * 删除标识    isDelete    String    不为空    HTTP    0：未删除；1：删除
 * 创建时间    createTime    String    不为空    HTTP
 * 语言ID    localeId    String    不为空    HTTP
 * 创建人    createUser    String    不为空    HTTP
 * 用户ID    accountId    String    不为空    HTTP
 * 产品类型名称    productTypeName    String    不为空    HTTP
 * 修改人    modifyUser    String    不为空    HTTP
 * 产品名称    productName    String    不为空    HTTP
 * 修改时间    modifyTime    String    不为空    HTTP
 * 产品类型    productType    String    不为空    HTTP
 * 产品id    productId    String    不为空    HTTP
 */
export interface RecentProduct {
    id: string;
    localeId: string;
    productId: string;
    icon: string;
    productName: string;
}

export interface RecentProductState {
    initState?: boolean,
    recentProducts: RecentProduct[]
}

const initialState: RecentProductState = {
    initState: true,
    recentProducts: []
};

export function recentProductsReducer(state: RecentProductState = initialState, action: Action) {
    switch (action.type) {
        case INIT_RECENT_PRODUCT_LIST:
            return action.payload;
        default:
            return state;
    }
}
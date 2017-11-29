import {Action} from "@ngrx/store";

export const INIT_PRODUCT_TYPE_LIST = '[Init Product Type List]';

/**
 * 产品类型ID    productTypeId    String    不为空    HTTP
 * 名称    name    String    不为空    HTTP
 * 描述    description    String    不为空    HTTP
 * 创建时间    createTime    String    不为空    HTTP
 * 修改时间    ModifyTime    String    不为空    HTTP
 * 创建人    createUser    String    不为空    HTTP
 * 修改人    modifyUser    String    不为空    HTTP
 * 删除标识    idDelete    String    不为空    HTTP    0未删除1已删除
 */
export interface ProductType {
    productTypeId?: string;
    name?: string;
}

export interface ProductTypeState {
    initState?: boolean,
    productTypes: ProductType[]
}

const initialState: ProductTypeState = {
    initState: true,
    productTypes: []
};

export function productTypesReducer(state: ProductTypeState = initialState, action: Action) {
    switch (action.type) {
        case INIT_PRODUCT_TYPE_LIST:
            return action.payload;
        default:
            return state;
    }
}
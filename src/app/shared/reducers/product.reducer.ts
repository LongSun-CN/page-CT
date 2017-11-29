import {Action} from "@ngrx/store";

export const INIT_PRODUCT_LIST = '[Init Product List]';

/**
 * 产品ID    productId    String    不为空    HTTP
 * 产品开发商Id    contentId    String    不为空    HTTP
 * 产品版权商Id    copyrightId    String    不为空    HTTP
 * 产品名称    name    String    不为空    HTTP
 * 产品类型    type    String    不为空    HTTP
 * 产品标签    subType    String    不为空    HTTP
 * 产品资费类型，收费、免费    feeType    String    不为空    HTTP
 * 产品状态    status    String    不为空    HTTP    0：暂停；1：正常
 * 产品专员    productUserId    String    不为空    HTTP
 * 描述    desc    String    不为空    HTTP
 * 是否删除    isDelete    String    可为空    HTTP    0：未删除；1：已删除
 */
export interface Product {
    productId?: string;
    contentId?: string;
    copyrightId?: string;
    name?: string;
    subType?: string;
    feeType?: string;
    status?: string;
    productUserId?: string;
    desc?: string;
    isDelete?: string;
}

export interface ProductState {
    initState?: boolean,
    products: Product[]
}

const initialState: ProductState = {
    initState: true,
    products: []
};

export function productsReducer(state: ProductState = initialState, action: Action) {
    switch (action.type) {
        case INIT_PRODUCT_LIST:
            return action.payload;
        default:
            return state;
    }
}
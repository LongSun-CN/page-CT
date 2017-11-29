import {Action} from "@ngrx/store";

export const INIT_PRODUCT_DETAIL = '[Init Product Detail]';

/**
 * 产品id    productId    String    不为空    HTTP
 * 产品开发商Id    contentId    String    不为空    HTTP
 * 产品版权商Id    copyrightId    String    不为空    HTTP
 * 产品名称    name    String    不为空    HTTP
 * 产品类型    type    String    不为空    HTTP
 * 图标地址    iconPath    String    可为空    HTTP    该属性暂时不能用，请用iconBase64此属性
 * 图标base64    iconBase64    String    可为空    HTTP
 * 产品标签    subType    String    可为空    HTTP
 * 产品资费类型，收费、免费    feeType    String    不为空    HTTP
 * 产品状态    status    String    不为空    HTTP
 * 产品专员    productUserId    String    可为空    HTTP
 * 删除标识    isdelete    String    不为空    HTTP    0未删除1删除
 * 游戏包名    packageName    String    不为空    HTTP
 * 统计开关    statStatus    String    不为空    HTTP    开：1    关：0
 * 充值返利状态    rebateStatus    String    不为空    HTTP    开：1    关：0
 * 测试开关    testStatus    String    不为空    HTTP    0：关，1：开
 * 游戏服自定义开关    gameServiceType    String    可为空    HTTP    0：关，1：开
 * 统一地址开关    addressType    String    不为空    HTTP    0关 不会改变游戏服地址，1开，保存产品时将改变游戏服默认地址
 * 产品秘钥    secretKey    String    可为空    HTTP
 * 产品级别    level    String    可为空    HTTP
 * 创建时间    createTime    long    不为空    HTTP
 * 创建人    createUser    String    不为空    HTTP
 * 修改时间    modifyTime    long    不为空    HTTP
 * 修改人    modifyUser    String    不为空    HTTP
 * 描述    desc    String    可为空    HTTP
 */
export interface ProductDetail {
    iconBase64?: string;
    iconPath?: string;
    name?: string;
}

export interface ProductDetailState {
    initState?: boolean,
    detail: ProductDetail
}

const initialState: ProductDetailState = {
    initState: true,
    detail: {}
};

export function productDetailReducer(state: ProductDetailState = initialState, action: Action) {
    switch (action.type) {
        case INIT_PRODUCT_DETAIL:
            return action.payload;
        default:
            return state;
    }
}
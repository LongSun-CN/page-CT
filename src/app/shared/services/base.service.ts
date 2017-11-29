import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {filter, forEach, has, head, pipe, prop, sortBy} from "ramda";
import {HttpService} from "./httpx.service";
import {ToastService} from "./toast.service";
import {Store} from "@ngrx/store";
import {INIT_LANGUAGE_LIST, LanguageState} from "../reducers/language.reducer";
import {INIT_PRODUCT_LIST, ProductState} from "../reducers/product.reducer";
import {no_mask, store_key} from "./httpx.interceptor";
import {CustomQueryGroupState, INIT_CUSTOM_QUERY_GROUP} from "../reducers/custom-query.reducer";
import {INIT_RECENT_PRODUCT_LIST, RecentProductState} from "../reducers/recent-product.reducer";
import {INIT_PRODUCT_DETAIL, ProductDetailState} from "../reducers/product-detail.reducer";
import {
    INIT_HEADER_PRODUCT_LANGUAGE_LIST,
    INIT_PRODUCT_LANGUAGE_LIST,
    ProductLanguageState
} from "../reducers/product-language.reducer";
import {INIT_PRODUCT_TYPE_LIST, ProductTypeState} from "../reducers/product-type.reducer";

@Injectable()
export class BaseService {

    constructor(private httpService: HttpService,
                private store$: Store<any>,
                private toastService: ToastService) {
    }

    /**
     * 退出登录
     */
    logout(): Observable<any> {
        return this.httpService.get(environment.getUrl('SSOClient/Logout')).map(this.toJson);
    }

    /**
     * 修改密码
     * @param oldPwd 旧密码
     * @param newPwd 新密码
     * @returns {Observable<Response>}
     */
    modifyPassword(oldPwd: string, newPwd: string): Observable<any> {
        return this.httpService
            .post(environment.getUrl('account/accountManage/updatePassword.htm'), {oldPwd, newPwd})
            .map(this.toJson);
    }

    /**
     * 获取用户信息
     */
    getUserInfo(): Observable<any> {
        return this.httpService
            .get(environment.getUrl('account/accountManage/getAccountInfo.htm'), {})
            .map(this.toJson)
    }

    getMenus(menus: any[], moduleId) {
        let getMenu = function () {
            let getRoot = function (parentId) {
                return head(filter((menu: any) => menu.actionId == parentId)(menus));
            };

            //构建root + 排序
            let roots = pipe(filter((menu: any) => menu.parentId == 0), sortBy(prop('order')))(menus);

            //构建child
            forEach((menu: any) => {
                if (menu.parentId != 0) {
                    let root: any = getRoot(menu.parentId);
                    if (root) {
                        root.__menus || (root.__menus = []);
                        root.__menus.push(menu);
                    }
                }
            })(menus);

            //排序child
            forEach((root: any) => {
                has('__menus')(root) && pipe(prop('__menus'), sortBy(prop('order')))(root);
            })(roots);

            return roots;
        };

        //filter
        menus = menus.filter((menu) => menu.moduleCode == moduleId).map(item => {
            item.__menus && (item.__menus = []);
            return item;
        });
        //转换为菜单
        let __menus = getMenu();
        let roots = [];
        forEach((menu: any) => {
            let root = {
                title: menu.name,
                icon: menu.icon,
                link: menu.url,
                sublinks: menu.__menus ? [] : null
            };
            if (menu.__menus) {
                forEach((menu: any) => {
                    root.sublinks.push({
                        title: menu.name,
                        icon: menu.icon,
                        link: menu.url
                    })
                })(menu.__menus);
            }
            roots.push(root);
        })(__menus);

        return roots;
    }

    toJson(res: Response) {
        return res.json();
    }

    /**
     * 获取语言信息
     */
    getLanguageList(): Observable<any> {
        return this.httpService.get(environment.getUrl('mis/locale/getLanguageList.htm')).map(this.toJson);
    };

    /**
     * 获取产品列表
     * @param type 产品类型 01:网游  02:单机
     * @param language 语言
     */
    getProductList(type: string, language: string): Observable<any> {
        return this.httpService
            .get(environment.getUrl('mis/product/getProductList.htm'), {type, language}).map(this.toJson);

    };

    /****
     * 获取服务信息
     */
    getLogicServerList(param: Object): Observable<any> {
        // return this.httpService.get(environment.getUrl('bbs/system/getLogicServerList.htm'), param).map(this.toJson);
        return this.httpService.get(environment.getUrl('mis/logicServer/getLogicServerList.htm'), param).map(this.toJson);
    };

    /****
     * 获取联运信息
     * @returns {Observable<Response>}
     */
    getOperationLineList(param: Object): Observable<any> {
        // return this.httpService.get(environment.getUrl('bbs/system/getOperationLineList.htm'), param).map(this.toJson);
        return this.httpService.get(environment.getUrl('mis/operationLine/getOperationLineList.htm'), param).map(this.toJson);
    };

    /****
     * 获取渠道信息
     * @returns {Observable<Response>}
     */
    getChannelList(param: Object): Observable<any> {
        // return this.httpService.get(environment.getUrl('bbs/system/getOperationLineList.htm'), param).map(this.toJson);
        return this.httpService.get(environment.getUrl('mis/channel/getChannelList.htm'), param).map(this.toJson);
    };


    /****
     * 获取支付方式信息
     * @returns {Observable<Response>}
     */
    getPayChannelList(param: Object): Observable<any> {
        // return this.httpService.get(environment.getUrl('bbs/system/getOperationLineList.htm'), param).map(this.toJson);
        return this.httpService.get(environment.getUrl('gsc/billingOrder/getPayChannelList.htm'), param).map(this.toJson);
    };

    /****
     * 获取vip信息
     * @returns {Observable<Response>}
     */
    getVipLevel(param: Object): Observable<any> {
        return this.httpService.get(environment.getUrl('customService/bigCustomer/getVipLevel.htm'), param).map(this.toJson);
    };

    /**
     * 查询用户常用产品
     */
    getRecentProductList() {
        return this.httpService
            .get(environment.getUrl('console/swichProduct/findCommonProduct.htm'), {...no_mask})
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let recentProducts: RecentProductState = {recentProducts: result.data};
                    this.store$.dispatch({
                        type: INIT_RECENT_PRODUCT_LIST,
                        payload: recentProducts
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    }

    /**
     * 控制台-删除用户常用产品
     */
    deleteRecentProduct(id: string) {
        return this.httpService
            .get(environment.getUrl('console/swichProduct/deleteCommonProduct.htm'), {id})
            .map(this.toJson);
    }

    /**
     * 获取产品类型
     */
    loadProductTypeList() {
        this.httpService
            .get(environment.getUrl('mis/product/getProductTypeList.htm'), {...no_mask})
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let produceTypes: ProductTypeState = {productTypes: result.data};
                    this.store$.dispatch({
                        type: INIT_PRODUCT_TYPE_LIST,
                        payload: produceTypes
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    }


    /**
     * 获取语言信息
     */
    loadLanguageList() {
        this.httpService
            .get(environment.getUrl('mis/locale/getLanguageList.htm'), {
                ...no_mask,
                [store_key]: `language_list`
            })
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let languages: LanguageState = {languages: result.data};
                    this.store$.dispatch({
                        type: INIT_LANGUAGE_LIST,
                        payload: languages
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 控制台
     * 根据产品ID获取语言列表
     */
    loadProductLanguageList(productId: string) {
        this.httpService
            .get(environment.getUrl('mis/locale/getLanguageListByPdId.htm'), {
                productId,
                [store_key]: `product_language_${productId}`
            })
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let languages: ProductLanguageState = {languages: result.data};
                    this.store$.dispatch({
                        type: INIT_PRODUCT_LANGUAGE_LIST,
                        payload: languages
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 顶部菜单
     * 根据产品ID获取语言列表
     */
    loadHeaderProductLanguageList(productId: string) {
        this.httpService
            .get(environment.getUrl('mis/locale/getLanguageListByPdId.htm'), {
                productId,
                [store_key]: `product_language_${productId}`
            })
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let languages: ProductLanguageState = {languages: result.data};
                    this.store$.dispatch({
                        type: INIT_HEADER_PRODUCT_LANGUAGE_LIST,
                        payload: languages
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 获取产品列表
     * @param type 产品类型 01:网游  02:单机
     * @param language 语言
     */
    loadProductList(type: string, language: string) {
        this.httpService
            .get(environment.getUrl('mis/product/getProductList.htm'), {type, language})
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let products: ProductState = {products: result.data};
                    this.store$.dispatch({
                        type: INIT_PRODUCT_LIST,
                        payload: products
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 获取当前用户产品权限列表
     */
    loadAllAuthProduct() {
        this.httpService
            .get(environment.getUrl('mis/product/getAllAuthProduct.htm'))
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let products: ProductState = {products: result.data};
                    this.store$.dispatch({
                        type: INIT_PRODUCT_LIST,
                        payload: products
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 控制台-查询用户全部自定义查询
     */
    loadAllCustomQuery() {
        this.httpService
            .get(environment.getUrl('console/customQuery/findCustomQuery.htm'), {...no_mask})
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    console.log(result);
                    let groups: CustomQueryGroupState = {groups: result.data};
                    this.store$.dispatch({
                        type: INIT_CUSTOM_QUERY_GROUP,
                        payload: groups
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    };

    /**
     * 控制台-添加自定义查询分组
     */
    addCustomQueryGroup(name: string): Observable<any> {
        return this.httpService
            .get(environment.getUrl('console/customQuery/addHabitGroup.htm'), {name})
            .map(this.toJson)
    };


    /**
     * 控制台-删除分组
     */
    deleteCustomQueryGroup(groupId: string): Observable<any> {
        return this.httpService
            .get(environment.getUrl('console/customQuery/deleteHabitGroupById.htm'), {id: groupId})
            .map(this.toJson)
    };


    /**
     * 控制台-删除所有
     */
    deleteAllCustomQuery(): Observable<any> {
        return this.httpService
            .get(environment.getUrl('console/customQuery/deleteAllByAccount.htm'))
            .map(this.toJson)
    };

    /**
     * 控制台-切换产品
     */
    saveRecentProduct(language, productId) {
        return this.httpService
            .get(environment.getUrl('console/swichProduct/swichProduct.htm'), {
                localeId: language,
                productId,
                ...no_mask
            })
            .map(this.toJson)
    }

    /**
     * 获取产品详情
     */
    getProductInfo(productId: string) {
        return this.httpService
            .get(environment.getUrl('mis/product/getProductInfo.htm'), {
                productId,
                [store_key]: `product_info_${productId}`
            })
            .map(this.toJson)
            .subscribe((result) => {
                if (result.status == '0') {
                    let detail: ProductDetailState = {detail: result.data};
                    this.store$.dispatch({
                        type: INIT_PRODUCT_DETAIL,
                        payload: detail
                    });
                } else {
                    this.toastService.pop('error', result.desc);
                }
            });
    }
}

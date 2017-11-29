import {environment} from "../../../environments/environment";
import {combineReducers} from "@ngrx/store";
import {compose} from "@ngrx/core/compose";
import {autoCopleteReducer} from "../../widgets/ourpalm-autocomplete/kefu.reducer";
import {languagesReducer} from "./language.reducer";
import {productsReducer} from "./product.reducer";
import {productTypesReducer} from "./product-type.reducer";
import {customQuerysReducer} from "./custom-query.reducer";
import {recentProductsReducer} from "./recent-product.reducer";
import {productDetailReducer} from "./product-detail.reducer";
import {headerProductLanguagesReducer, productLanguagesReducer} from "./product-language.reducer";
import {userInfoReducer} from "./userinfo-reducer";
import {uiselectautoReducer} from "../../widgets/ui-select-auto/ui-select-auto.reducer";

const reducers = {
    /*...bbsReducers,
    ...logcenterReducers,
    ...widgetReducers,
    ...autoCopleteReducer,
    ...uiselectautoReducer,
    ...packageReducer,
    ...kfqaReducer,
    ...misReducers,
    userInfo: userInfoReducer,
    languages: languagesReducer,
    products: productsReducer,
    productTypes: productTypesReducer,
    customQuerys: customQuerysReducer,
    recentProducts: recentProductsReducer,
    productDetail: productDetailReducer,
    productLanguages: productLanguagesReducer,
    headerProductLanguages: headerProductLanguagesReducer*/
};

const developmentReducer = compose(/*storeLogger(),*/ combineReducers)(reducers);
const productionReducer = combineReducers(reducers);

// AoT requires https://github.com/ngrx/store/issues/190
export function reducer(state: any, action: any) {
    if (environment.production) {
        return productionReducer(state, action);
    }
    else {
        return developmentReducer(state, action);
    }
}

import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../shared/services/base.service";
import {simpleMap} from "../../entity/simple.map";
import {Observable} from "rxjs/Observable";
import {LanProState, SEARCH_LANGUGE, SET_LANGUGE, SET_PRODUCTTYPE} from "./language-producttype.reducer";
import {SEARCH_PRODUCT} from "../ui-select-auto/ui-select-auto.reducer";
import {Store} from "@ngrx/store";

@Component({
    selector: '[app-language-producttype]',
    templateUrl: './language-producttype.component.html',
    styleUrls: ['./language-producttype.component.css']
})
export class LanguageProducttypeComponent implements OnInit {

    languageList: Observable<LanProState>;
    currentLanguage: simpleMap = {name: '', value: ''};

    productTypeList: Array<simpleMap> = [{name: '网游', value: '01'}, {name: '单机', value: '02'},];
    currentProductType: simpleMap = {name: '', value: ''};

    constructor(private  $store: Store<LanProState>, private baseServer: BaseService) {
        this.languageList = $store.select('lanPro');

        baseServer.getLanguageList().subscribe(list => {
            if (list.status === '0') {
                const data = list.data.map(function (item) {
                    return item = {name: item.name, value: item.lgId};
                });
                this.currentLanguage = <simpleMap>JSON.parse(window.localStorage.getItem(window.location.hostname + 'language')) || data[0];
                this.currentProductType = <simpleMap>JSON.parse(window.localStorage.getItem(window.location.hostname + 'productType')) || this.productTypeList[0];
                $store.dispatch({type: SET_LANGUGE, payload: {data: [this.currentLanguage]}});
                $store.dispatch({type: SET_PRODUCTTYPE, payload: {data: [this.currentProductType]}});
                $store.dispatch({type: SEARCH_LANGUGE, payload: {data: data}});
                this.queryProduct(false, this.currentLanguage, 1);
            }
        });
    }

    public  queryProduct(isForce: boolean, item: simpleMap, type: number): void {
        switch (type) {
            case 1:
                this.currentLanguage = item;
                window.localStorage.setItem(window.location.hostname + 'language', JSON.stringify(this.currentLanguage));
                break;
            case 2:
                this.currentProductType = item;
                window.localStorage.setItem(window.location.hostname + 'productType', JSON.stringify(this.currentProductType));
                break;
            default:
                return;
        }

        this.baseServer.getProductList(this.currentLanguage.value, this.currentLanguage.value).subscribe(result => {
            if (result.status === '0') {
                const data = result.data.map(function (item) {
                    item = {id: item.productId, text: item.name};
                    return item
                });

                type === 1 && this.$store.dispatch({type: SET_LANGUGE, payload: {data: [this.currentLanguage]}});
                type === 2 && this.$store.dispatch({type: SET_PRODUCTTYPE, payload: {data: [this.currentProductType]}});
                this.$store.dispatch({type: SEARCH_PRODUCT, payload: {data: [{id: '-1', text: '请选择'}, ...data]}});
            }
        });

    }

    ngOnInit() {

    }

}

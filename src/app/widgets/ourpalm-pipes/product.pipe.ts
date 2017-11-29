import {Pipe, PipeTransform} from "@angular/core";
import {Store} from "@ngrx/store";
import {urlParam} from "../../shared/url-param.const";
import {Observable} from "rxjs/Observable";
import {ProductState} from "../../shared/reducers/product.reducer";

@Pipe({
    name: 'product',
    pure: true
})
export class ProductPipe implements PipeTransform {

    products$: Observable<ProductState>;

    constructor(private store$: Store<any>) {
        this.products$ = this.store$.select('products');
    }

    transform(productId: any): Observable<string> {
        productId = productId || urlParam.product;
        return this.products$.map((state: ProductState) => {
            for (let product of state.products) {
                if (product.productId == productId)
                    return product.name;
            }
            return '';
        });
    }

}

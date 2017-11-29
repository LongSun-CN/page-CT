import {Pipe, PipeTransform} from "@angular/core";
import {Store} from "@ngrx/store";
import {urlParam} from "../../shared/url-param.const";
import {LanguageState} from "../../shared/reducers/language.reducer";
import {Observable} from "rxjs/Observable";

@Pipe({
    name: 'language',
    pure: true
})
export class LanguagePipe implements PipeTransform {

    language$: Observable<LanguageState>;

    constructor(private store$: Store<any>) {
        this.language$ = this.store$.select('languages');
    }

    transform(languageId: any): Observable<string> {
        languageId = languageId || urlParam.language;
        return this.language$.map((state: LanguageState) => {
            for (let language of state.languages) {
                if (language.lgId == languageId)
                    return language.name;
            }
            return '';
        });
    }

}

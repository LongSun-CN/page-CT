import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
    name: 'fontColor',
    pure: false
})
export class FontColorPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any, args?: any): any {
        return args ? this.sanitizer.bypassSecurityTrustHtml(`<span style="color:${args}">${value}</span>`) : value;
    }

}

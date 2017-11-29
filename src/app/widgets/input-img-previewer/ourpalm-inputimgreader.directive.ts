import {Directive, ElementRef, forwardRef, HostListener} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs/util/noop";
// import * as $ from "jquery";

export interface Files {
    first?: FileItem;
    files?: FileItem[];
}

export interface FileItem {
    readonly lastModified: number;
    readonly lastModifiedDate: any;
    readonly name: string;
    readonly type: string;
    readonly webkitRelativePath: string;
    readonly data: any;
}

export const CUSTOM_INPUTIMG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OurpalmInputImgReader),
    multi: true
};

@Directive({
    selector: '[ourpalm-inputimgreader]',
    providers: [CUSTOM_INPUTIMG_CONTROL_VALUE_ACCESSOR]
})
export class OurpalmInputImgReader implements ControlValueAccessor {
    protected el: ElementRef;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    public constructor(el: ElementRef) {
        this.el = el;
    }

    private innerValue: Files;

    //get accessor
    get value(): Files {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: Files) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: Files) {
        if (value) {
            this.innerValue = value;
        } else {
            $(this.el.nativeElement).prop('value', '');
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    @HostListener('change')
    change() {
        let fileList: FileList = this.el.nativeElement.files || new FileList();
        if (fileList.length > 0) {
            this.value = {files: []};
            for (let i = 0; i < fileList.length; i++) {
                let file: File = fileList.item(i);
                let reader = new FileReader();
                reader.onload = (ev: any) => {
                    let file: any = fileList.item(i);
                    let fileItem: FileItem = {
                        lastModifiedDate: file.lastModifiedDate,
                        lastModified: file.lastModified,
                        name: file.name,
                        type: file.type,
                        webkitRelativePath: file.webkitRelativePath,
                        data: ev.target.result
                    };
                    (i == 0) && (this.value.first = fileItem);
                    this.value.files.push(fileItem);
                };
                reader.readAsDataURL(file);
            }
        } else {
            this.value = {files: []};
        }
    }
}
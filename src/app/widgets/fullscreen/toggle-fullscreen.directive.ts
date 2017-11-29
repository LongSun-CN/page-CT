import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {

    @Input() element: FullscreenSelectorDirective;

    @HostListener('click') onClick() {
        if (screenfull.enabled) {
            if (this.element) {
                screenfull.toggle(this.element.el.nativeElement);
            } else {
                screenfull.toggle();
            }
        }
    }
}

@Directive({
    selector: '[fullscreenSelector]'
})
export class FullscreenSelectorDirective {

    constructor(public el: ElementRef) {
    }

}
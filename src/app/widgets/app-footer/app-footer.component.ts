import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: 'app-footer',
    styleUrls: ['./app-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app-footer.component.html'
})
export class AppFooterComponent {

    @Input() links: any[];

}

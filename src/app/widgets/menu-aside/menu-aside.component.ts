import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: 'app-menu-aside',
    styleUrls: ['./menu-aside.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent {

    @Input()
    public links: Array<any> = [];

}

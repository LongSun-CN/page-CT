import {Component, Input, OnInit} from "@angular/core";
import {OurpalmBoxComponent} from "./ourpalm-box.component";

@Component({
    selector: 'ourpalm-box-multiform',
    template: `
        <ng-container *ngIf="!box.simple">
            <ng-content></ng-content>
        </ng-container>
    `
})
export class OurpalmBoxMultiFormComponent implements OnInit{

    @Input()
    box: OurpalmBoxComponent;

    ngOnInit(): void {
      setTimeout(()=>{
        this.box.showSearch = true;
      })
    }


}

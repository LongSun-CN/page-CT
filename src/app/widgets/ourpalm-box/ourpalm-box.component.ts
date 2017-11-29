import {Component, Input} from "@angular/core";

@Component({
    selector: 'ourpalm-box',
    styleUrls: ['./ourpalm-box.component.css'],
    template: `
        <div class="box box-default box-solid">
            <div class="box-header with-border">
                <span *ngIf="title" style="font-size:16px;margin-right:10px;">{{title}}</span>
                <span *ngIf="showSearch" class="badge" [ngClass]="{'bg-blue': simple}"
                      (click)="setSimpleSearch();">基本查询</span>
                <span *ngIf="showSearch" class="badge" [ngClass]="{'bg-blue': !simple}" (click)="setNotSimpleSearch();">高级查询</span>
                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="box-body" style="display:block;">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class OurpalmBoxComponent {

    @Input("title")
    title: string = null;
    //基本查询
    simple: boolean = true;

    showSearch: boolean = false;

    setSimpleSearch() {
        this.simple = true;
    }

    setNotSimpleSearch() {
        this.simple = false;
    }

}
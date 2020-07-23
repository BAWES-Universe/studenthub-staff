import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'loading-modal',
    templateUrl: './loading-modal.component.html',
    styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {

    @Input() type: string;
    @Input() loading: boolean;

    constructor() {
    }

    ngOnInit() {
    }

}

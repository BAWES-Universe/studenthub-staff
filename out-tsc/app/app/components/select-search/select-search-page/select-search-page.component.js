import { __decorate } from "tslib";
import { Component } from '@angular/core';
let SelectSearchPageComponent = class SelectSearchPageComponent {
    constructor(params, _viewCtrl) {
        this._viewCtrl = _viewCtrl;
        this.query = '';
        this.collection = params.get("collection");
        this.labelAttr = params.get("labelAttr");
        this.displayedCollection = this.collection;
    }
    ionViewDidLoad() { }
    /**
     * When an item is selected from list
     */
    onSelect(selectedItem) {
        this._viewCtrl.dismiss(selectedItem);
    }
    highlight(item) {
        if (!this.query) {
            return item;
        }
        let reg = new RegExp(this.query, 'gi');
        return item.replace(reg, str => {
            return '<b>' + str + '</b>';
        });
    }
    /**
     * Display search results based on user input
     */
    searchFilter(event) {
        this.query = event.target.value.toLowerCase();
        if (this.query) {
            this.displayedCollection = this.collection.filter((collectionItem) => {
                return collectionItem[this.labelAttr].toLowerCase().indexOf(this.query) >= 0;
            });
        }
        else {
            this.displayedCollection = this.collection.slice();
        }
    }
};
SelectSearchPageComponent = __decorate([
    Component({
        selector: 'app-select-search-page',
        templateUrl: './select-search-page.component.html',
        styleUrls: ['./select-search-page.component.scss'],
    })
], SelectSearchPageComponent);
export { SelectSearchPageComponent };
//# sourceMappingURL=select-search-page.component.js.map
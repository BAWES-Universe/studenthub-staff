var SelectSearchInputComponent_1;
import { __awaiter, __decorate } from "tslib";
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectSearchPageComponent } from '../select-search-page/select-search-page.component';
let SelectSearchInputComponent = SelectSearchInputComponent_1 = class SelectSearchInputComponent {
    constructor(_popoverCtrl) {
        this._popoverCtrl = _popoverCtrl;
        // Input placeholder
        this.placeholder = 'Select a value';
        // the method set in registerOnChange, it is just
        // a placeholder for a method that takes one parameter,
        // we use it to emit changes back to the form
        this._propagateChange = (_) => { };
    }
    get collection() {
        return this._collection;
    }
    set collection(value) {
        this._collection = value;
        this.putSelectedValueAsFirst();
    }
    /**
     * When component clicked
     */
    onClick($ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectPage = yield this._popoverCtrl.create({
                component: SelectSearchPageComponent,
                componentProps: {
                    collection: this.collection,
                    valueAttr: this.valueAttr,
                    labelAttr: this.labelAttr
                },
                cssClass: 'select_search_' + this.valueAttr,
                event: $ev,
                translucent: true
            });
            selectPage.onDidDismiss()
                .then((data) => {
                if (data && data.data) {
                    const selection = data.data;
                    this.value = selection[this.valueAttr];
                    this.selectedItem = selection;
                }
            });
            yield selectPage.present();
        });
    }
    /**
     * Update the collection and place the selected "value" as first item
     */
    putSelectedValueAsFirst() {
        if (!this.collection || !this.value) {
            return;
        }
        for (let i = 0; i < this.collection.length; i++) {
            if (this.collection[i][this.valueAttr] === this.value) {
                this.selectedItem = this.collection[i]; // sets as the selected item
                const removedItem = this.collection.splice(i, 1); // removes the item
                this.collection.unshift(removedItem[0]); // adds it back to the beginning
                break;
            }
        }
        // Matching item wasn't found. Array is unchanged, but you could do something
        // else here if you wish (like an error message).
    }
    /**
     * Getter for Value
     */
    get value() {
        return this._value;
    }
    /**
     * Setter for Value
     */
    set value(val) {
        this._value = val;
        this.putSelectedValueAsFirst();
        // Notify of changes
        this._propagateChange(this._value);
    }
    /**
     * ControlValueAccessor interface methods
     * - They allow this component to be used as a form element (with validation and ngModel)
     */
    /**
     * Called on form Init / Update
     * @param {*} obj
     */
    writeValue(obj) {
        if (obj) {
            this.value = obj;
        }
    }
    /**
     * Propogate change on change, notify outside world of changes
     * @param {any} fn
     */
    registerOnChange(fn) {
        this._propagateChange = fn;
    }
    /**
     * Called on touch/ element blur
     */
    registerOnTouched() { }
};
__decorate([
    Input()
], SelectSearchInputComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], SelectSearchInputComponent.prototype, "valueAttr", void 0);
__decorate([
    Input()
], SelectSearchInputComponent.prototype, "labelAttr", void 0);
__decorate([
    Input('collection')
], SelectSearchInputComponent.prototype, "collection", null);
SelectSearchInputComponent = SelectSearchInputComponent_1 = __decorate([
    Component({
        selector: 'app-select-search-input',
        templateUrl: './select-search-input.component.html',
        styleUrls: ['./select-search-input.component.scss'],
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SelectSearchInputComponent_1),
                multi: true
            }
        ]
    })
], SelectSearchInputComponent);
export { SelectSearchInputComponent };
//# sourceMappingURL=select-search-input.component.js.map
import { __decorate, __param } from "tslib";
import { connectConfigure } from 'instantsearch.js/es/connectors';
import { BaseWidget } from 'angular-instantsearch';
import { InstantSearchComponent } from '../instant-search/instant-search.component';
import { Component, Input, Inject, forwardRef, ContentChild, TemplateRef, } from '@angular/core';
import { isObject } from "rxjs/internal-compatibility";
export function noop(...args) { }
let NgAisConfigure = class NgAisConfigure extends BaseWidget {
    constructor(differs, instantSearchParent) {
        super('Configure');
        this.differs = differs;
        this.instantSearchParent = instantSearchParent;
        this.state = {
            refine: noop,
        };
    }
    set searchParameters(values) {
        if (!values || !isObject(values)) {
            return;
        }
        this.internalSearchParameters = values;
        if (!this.differ && values) {
            this.differ = this.differs.find(values).create();
        }
    }
    ngOnInit() {
        if (this.internalSearchParameters && isObject(this.internalSearchParameters)) {
            this.createWidget(connectConfigure, {
                searchParameters: this.internalSearchParameters,
            });
        }
        else {
            this.createWidget(connectConfigure, {
                searchParameters: {},
            });
        }
        super.ngOnInit();
    }
    ngDoCheck() {
        if (this.differ) {
            const changes = this.differ.diff(this.internalSearchParameters);
            if (changes) {
                this.state.refine(this.internalSearchParameters);
            }
        }
    }
};
__decorate([
    ContentChild(TemplateRef, { static: true })
], NgAisConfigure.prototype, "template", void 0);
__decorate([
    Input()
], NgAisConfigure.prototype, "searchParameters", null);
NgAisConfigure = __decorate([
    Component({
        selector: 'is-configure',
        template: '',
    }),
    __param(1, Inject(forwardRef(() => InstantSearchComponent)))
], NgAisConfigure);
export { NgAisConfigure };
//# sourceMappingURL=configure.js.map
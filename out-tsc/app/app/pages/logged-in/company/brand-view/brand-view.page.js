import { __decorate } from "tslib";
import { Component } from '@angular/core';
let BrandViewPage = class BrandViewPage {
    constructor(navCtrl, modalCtrl, activatedRoute, aws, brandService) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.activatedRoute = activatedRoute;
        this.aws = aws;
        this.brandService = brandService;
        this.brandID = null;
        this.loading = false;
    }
    ngOnInit() {
        this.brandID = this.activatedRoute.snapshot.paramMap.get('id');
        this.loadData();
    }
    /**
     * On candidate selected from list
     */
    candidateSelected(candidate) {
        this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
            state: {
                model: candidate
            }
        });
    }
    /**
     * store selected
     * @param store
     */
    storeSelected(store) {
        this.navCtrl.navigateForward('store-view/' + store.store_id, {
            state: {
                model: store
            }
        });
    }
    /**
     * load brand view
     */
    loadData() {
        this.loading = true;
        this.brandService.view(this.brandID).subscribe(response => {
            this.loading = false;
            this.brand = response;
        });
    }
};
BrandViewPage = __decorate([
    Component({
        selector: 'app-brand-view',
        templateUrl: './brand-view.page.html',
        styleUrls: ['./brand-view.page.scss'],
    })
], BrandViewPage);
export { BrandViewPage };
//# sourceMappingURL=brand-view.page.js.map
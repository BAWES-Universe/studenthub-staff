import { AppModule } from '../app.module';
import { SelectiveLoadingStrategy } from './SelectiveLoadingStrategy';
export function PreLoad(page) {
    return function (constructor) {
        if (!AppModule.injector)
            return null;
        const loader = AppModule.injector.get(SelectiveLoadingStrategy);
        const ngOnInit = constructor.prototype.ngOnInit;
        constructor.prototype.ngOnInit = function (...args) {
            loader.preLoadRoute(page);
            if (ngOnInit) {
                ngOnInit.apply(this, args);
            }
        };
    };
}
//# sourceMappingURL=preLoad.js.map
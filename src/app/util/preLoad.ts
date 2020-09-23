import { AppModule } from '../app.module';
import { SelectiveLoadingStrategy } from './SelectiveLoadingStrategy';

export function PreLoad(page: string): ClassDecorator {
  return function(constructor: any) {
    
    if(!AppModule.injector)
      return null; 

    const loader = AppModule.injector.get(SelectiveLoadingStrategy);

    const ngOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function(...args) {
      
      loader.preLoadRoute(page);

      if (ngOnInit) {
        ngOnInit.apply(this, args);
      }
    };
  };
}
import { of } from 'rxjs';
export class SelectiveLoadingStrategy {
    constructor() {
        this.routes = {};
    }
    preload(route, load) {
        if (route.data && route.data.name) {
            this.routes[route.data.name] = {
                route,
                load
            };
        }
        if (route.data && route.data.preload) {
            return load();
        }
        return of(null);
    }
    preLoadRoute(name) {
        const route = this.routes[name];
        if (route) {
            route.load();
        }
    }
}
//# sourceMappingURL=SelectiveLoadingStrategy.js.map
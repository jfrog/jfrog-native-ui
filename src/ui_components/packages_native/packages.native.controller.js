export default class PackagesNativeController {
    constructor($q, $state, $stateParams, $scope, JFrogEventBus, $location) {
        this.$state = $state;
        this.$scope = $scope;
        this.$location = $location;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.JFrogEventBus = JFrogEventBus;
    }

    $onInit() {
        this.registerEvents();
    }

    registerEvents() {
        this.JFrogEventBus.registerOnScope(this.$scope,
                this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER, (daoParams) => {
                    this.initComponentsData(daoParams);
                });
    }

    initComponentsData(daoParams) {
        this.daoParams = daoParams;
        if (daoParams.packageType) {
            this.packageType = daoParams.packageType;
            if (daoParams.package) {
                if (daoParams.version) {
                    this.initVersionViewData(daoParams);
                } else {
                    this.initPackageViewData(daoParams);
                }
            } else {
                this.initPackagesViewData(daoParams);
            }
        }
    }

    hideAll() {
        this.showPackages = false;
        this.showPackage = false;
        this.showVersion = false;
    }

    initPackageViewData(daoParams) {
        this.hideAll();
        this.refreshPackage(daoParams).then(() => {
            this.showPackage = true;
            this.setStateParams(daoParams);
        });
    }

    initVersionViewData(daoParams) {
        this.hideAll();
        this.refreshVersion(daoParams).then(() => {
            this.showVersion = true;
            this.setStateParams(daoParams);
        });
    }

    initPackagesViewData(daoParams) {
        this.hideAll();
        this.$q.all([
            this.refreshPackageTypes(daoParams),
            this.refreshFilters(daoParams),
            this.refreshPackages(daoParams)
        ]).then(() => {
            this.showPackages = true;
            this.setStateParams(daoParams);
        })
    }

    refreshPackageTypes(daoParams) {
        return this.getPackageTypes({daoParams: daoParams}).then((packageTypes) => {
            this.packageTypes = packageTypes;
        });
    }

    refreshPackages(daoParams) {
        return this.getPackages({daoParams: daoParams}).then((packages) => {
            this.packages = packages;
        });
    }

    refreshFilters(daoParams) {
        return this.getFilters({daoParams: daoParams}).then((filters) => {
            this.filters = filters;
        });
    }

    refreshPackage(daoParams) {
        return this.getPackage({daoParams: daoParams}).then((pkg) => {
            this.package = pkg;
        });
    }

    refreshVersion(daoParams) {
        return this.getVersion({daoParams: daoParams}).then((version) => {
            this.version = version;
        });
    }

    manifestCb(daoParams) {
        return this.getManifest({daoParams: daoParams});
    }

    setStateParams(params) {
        this.$location.search({package: params.package, version: params.version});
    }
}

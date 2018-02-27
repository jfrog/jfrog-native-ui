import {PACKAGE_NATIVE_CONSTANTS} from '../../constants/package.native.constants';

export default class PackagesNativeController {
	constructor($q, $state, $stateParams, $scope, JFrogEventBus, $location, ModelFactory) {
		this.$state = $state;
		this.$scope = $scope;
		this.$location = $location;
		this.$q = $q;
		this.$stateParams = $stateParams;
		this.JFrogEventBus = JFrogEventBus;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
		this.ModelFactory = ModelFactory;
	}

	$onInit() {
		this.packages = {};
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
				if (daoParams.version && daoParams.repo) {
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
		this.refreshPackage(daoParams).then(() => {
			this.hideAll();
			this.showPackage = true;
			this.setStateParams(daoParams);
		});
	}

	initVersionViewData(daoParams) {
		this.refreshVersion(daoParams).then(() => {
			this.hideAll();
			this.showVersion = true;
			this.setStateParams(daoParams);
		});
	}

	initPackagesViewData(daoParams) {
		this.$q.all([
			this.refreshPackageTypes(daoParams),
			this.refreshFilters(daoParams),
			this.refreshPackages(daoParams)
		]).then(() => {
			this.hideAll();
			this.showPackages = true;
			this.setStateParams(daoParams);
		});
	}

	refreshPackageTypes(daoParams) {
		return this.getPackageTypes({daoParams: daoParams}).then((packageTypes) => {
			this.packageTypes = packageTypes;
		});
	}

	initEmptyPackagesPage(daoParams) {
		let defferd = this.$q.defer();
		this.packages.list = this.ModelFactory.getPackageListMedel(daoParams.packageType, []);
		defferd.resolve(this.packages.list);
		return defferd.promise;
	}

	refreshPackages(daoParams) {
		if(!daoParams.filters || !daoParams.filters.length) {
			return this.initEmptyPackagesPage(daoParams);
		}
		let searchParams = {
			packageType: daoParams.packageType,
			filters: daoParams.filters || [],
			sortBy: daoParams.sortBy || 'name',
			order: daoParams.order || 'asc'
		};

		return this.getPackages({daoParams: searchParams}).then((packages) => {
			this.packages.list = this.ModelFactory.getPackageListMedel(daoParams.packageType, packages);
		});
	}

	refreshFilters(daoParams) {
		return this.getFilters({daoParams: daoParams}).then((filters) => {
			this.filters = this.ModelFactory.getFiltersMedel(daoParams.packageType, filters);
		});
	}

	refreshPackage(daoParams) {
		return this.getPackage({daoParams: daoParams}).then((pkg) => {
			this.package = this.ModelFactory.getPackageMedel(daoParams.packageType, pkg);
		});
	}

	refreshVersion(daoParams) {
		return this.getVersion({daoParams: daoParams}).then((version) => {
			this.version = this.ModelFactory.getVersionMedel(daoParams.packageType, version);
		});
	}

	manifestCb(daoParams) {
		return this.getManifest({daoParams: daoParams});
	}

	showInTreeCb(pathParams) {
		return this.showInTree({pathParams: pathParams});
	}

	refreshPackageDownloadsCount(daoParams) {
		return this.getPackageDownloadsCount({daoParams: daoParams});
	}

	refreshVersionDownloadsCount(daoParams) {
		return this.getVersionDownloadsCount({daoParams: daoParams});
	}

	setStateParams(params) {
		this.$location.search({package: params.package, version: params.version, repo: params.repo});
	}
}

import {PACKAGE_NATIVE_CONSTANTS} from '../../constants/package.native.constants';

export default class PackagesNativeController {
	constructor($timeout, JFrogSubRouter, $q, $scope, ModelFactory) {
		this.$scope = $scope;
		this.$q = $q;
		this.$timeout = $timeout;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
		this.ModelFactory = ModelFactory;

		this.packagesReady = false;

		this.JFrogSubRouter = JFrogSubRouter;
	}



	$onInit() {
		this.packages = {};
		this.initSubRouter();
	}

	initSubRouter() {
		this.subRouter = this.JFrogSubRouter.createLocalRouter({
			parentScope: this.$scope,
			urlStructure: '/:packageType/:package/:version/?:repo&:repos&:query',
			hotSyncUrl: true,
			states: [
				{
					name: 'packages',
					params: {mandatory: ['packageType'], nullify: ['package', 'version', 'repo']}
				},
				{
					name: 'package',
					params: {mandatory: ['packageType', 'package'], nullify: ['version', 'repo',  'query']}
				},
				{
					name: 'version',
					params: {mandatory: ['packageType', 'package', 'version', 'repo'], nullify: ['repos', 'query']}
				}
			],
			onInit: () => {
//				console.log('Sub Router onInit')
				if (!this.subRouter.params.packageType) {
					this.subRouter.goto('packages', {packageType: 'docker'});
				}
				this.initComponentsData(this.subRouter.params);
			},
			onChangeFromUrl: (oldParams, newParams) => {
//				console.log('Sub Router onChangeFromUrl', oldParams, newParams)
				this.initComponentsData(this.subRouter.params);
			},
			onStateChange: (oldState, newState) => {
//				console.log('Sub Router onStateChange', `${oldState} -> ${newState}`)
				this.initComponentsData(this.subRouter.params);
			},
			onInvalidState: (oldState, params) => {
//				console.log('Sub Router onInvalidState, oldState =', oldState, params)
				if (oldState === 'version' && params.packageType === 'docker' && params.package && params.version && !params.repo) {
					this.subRouter.goto('package', {packageType: params.packageType, package: params.package});
				}
				else {
					this.subRouter.goto('packages', {packageType: 'docker'});
				}
			}
		})
	}

	initComponentsData(daoParams) {
		this.daoParams = daoParams;
		if (daoParams.packageType) {
			this.packageType = daoParams.packageType;
			if (daoParams.package) {
			} else {
				this.initPackagesViewData(daoParams);
			}
		}
	}

	initPackagesViewData(daoParams) {
		this.refreshPackageTypes(daoParams).then(() => {
			this.$q.all([
				this.refreshFilters(daoParams),
				this.refreshPackages(daoParams)
			]).then(() => {
				this.setStateParams(daoParams);
				this.packagesReady = true;
			});
		})
	}

	refreshPackageTypes(daoParams) {
		return this.getPackageTypes({daoParams: daoParams}).then((packageTypes) => {
			this.packageTypes = packageTypes;
			if (!this.packageTypes[this.subRouter.params.packageType]) {
				this.subRouter.params.packageType = _.find(this.packageTypes, {disabled: false}).text;
			}

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
		_.extend(this.subRouter.params, {package: params.package, version: params.version, repo: params.repo});
	}
}

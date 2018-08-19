export default class PackagesNativeController {
	constructor(JFrogSubRouter, JfFullTextService, $scope, $q, $timeout, NativeUIDescriptor, HostDaoParamFormatter) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$q = $q;
		this.JFrogSubRouter = JFrogSubRouter;
        this.fullTextService = JfFullTextService;
        this.descriptor = NativeUIDescriptor.getDescriptor();
        this.formatter = HostDaoParamFormatter;
        this.stateController = null;


    }

	$onInit() {
	    this.wrapHostDataCalls();
		this.defaultPackageType = localStorage.lastNativeUIPackageType || 'docker';
		this.initSubRouter();
	}

	initSubRouter() {
		this.subRouter = this.JFrogSubRouter.createLocalRouter({
			parentScope: this.$scope,
			urlStructure: '/:packageType/:package/:version/?:repo&:versionPath&:query',
			hotSyncUrl: true,
			encodeSearchParamsAsBase64: 'state',
			states: [
				{
					name: 'packages',
					params: {mandatory: ['packageType'], nullify: ['package', 'version', 'repo', 'versionPath']}
				},
				{
					name: 'package',
					params: {mandatory: ['packageType', 'package'], nullify: ['version', 'repo', 'versionPath']}
				},
				{
					name: 'version',
					params: {mandatory: ['packageType', 'package', 'version', 'repo'], nullify: []}
				}
			],
			onInit: () => {
//				console.log('Sub Router onInit')

                this.getAvailablePackageTypes().then(packageTypes => {
                	this.packageTypes = packageTypes;
                	this.ensurePackageTypeValidity();
                	this.ready = true;
                });
				if (!this.subRouter.params.packageType) {
                    this.subRouter.goto('packages', {packageType: this.defaultPackageType});
				}
                if (!this.subRouter.params.query) this.subRouter.params.query = {};
				else {
                    this.subRouter.params.query = _.pick(this.subRouter.params.query, _.identity);
                }

            },
			onChangeFromUrl: (oldParams, newParams) => {
                if (!this.subRouter.params.query) this.subRouter.params.query = {};
//				console.log('Sub Router onChangeFromUrl', oldParams, newParams)
			},
			onStateChange: (oldState, newState) => {
//				console.log('Sub Router onStateChange', `${oldState} -> ${newState}`)
			},
			onInvalidState: (oldState, params) => {
//				console.log('Sub Router onInvalidState, oldState =', oldState, params)
				if (oldState === 'version' && params.package && params.version && !params.repo) {
                    this.subRouter.goto('package', {packageType: params.packageType, package: params.package});
				}
				else {
                    this.subRouter.goto('packages', {packageType: this.defaultPackageType});
				}
			}
		})

        this.subRouter.listenForChanges(['packageType'], null,
            (oldP, newP) => {
        	    this.ensurePackageTypeValidity();
            }, this.$scope);

    }

    ensurePackageTypeValidity() {
	    let foundByParam = _.find(this.packageTypes, {value: this.subRouter.params.packageType})
        if (!foundByParam || foundByParam.disabled) {
            let lastPackageType = localStorage.lastNativeUIPackageType;
            let found = _.find(this.packageTypes, {value: lastPackageType});
            let validPackageType;
            if (found && !found.disabled) {
                validPackageType = lastPackageType;
            }
            else {
                validPackageType = _.find(this.packageTypes, pt => !pt.disabled).value;
            }
            _.extend(this.subRouter.params, {packageType: validPackageType, package: null, version: null, repo: null, query: {}});
            this.subRouter.updateUrl(true);
        }
    }

    getAvailablePackageTypes() {
	    if (this.packageTypes) return this.$q.when(this.packageTypes);
	    else {
            return this.hostData.getPackageTypes().then((packageTypes) => {
                packageTypes = _.map(packageTypes, pt => {
                    if (!this.descriptor.typeSpecific[pt.value] || this.descriptor.typeSpecific[pt.value].disabled) {
                        pt.disabled = true;
                    }
                    return pt;
                })

                this.packageTypes = _.sortBy(packageTypes, pt => !!pt.disabled)

                return this.packageTypes;

            });
        }
    }

    showAll(e, text, title, asList = false, itemClickCB = null, windowClass = '') {
        e.stopPropagation();
        this.fullTextService.showFullTextModal(text, title, 590, asList, itemClickCB, windowClass);
    }

    filterByKeyword(keyword) {
	    let origState = this.subRouter.state;
        let keywordsId = this.descriptor.typeSpecific[this.subRouter.params.packageType].filters.keywords;
        if (keywordsId) {
            this.subRouter.params.package = null;
            this.subRouter.params.version = null;
            this.subRouter.params.repo = null;
            this.subRouter.params.versionPath = null;
            this.subRouter.params.query = {[keywordsId]: keyword};
        }
        if (origState === 'packages' && this.stateController) {
            this.stateController.initPackagesViewData(this.subRouter.params);
        }
    }

    wrapHostDataCalls() {
	    this.formatter.wrapHostDataCalls(this.hostData);
    }

    getDisplayNameForPackageType(packageType) {
	    if (this.packageTypes) {
	        let found = _.find(this.packageTypes, {value: packageType});
	        if (found) {
	            return found.displayText;
            }
        }
    }

}

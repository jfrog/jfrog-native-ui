export default class PackagesNativeController {
	constructor(JFrogSubRouter, $scope) {
		this.$scope = $scope;
		this.JFrogSubRouter = JFrogSubRouter;
	}

	$onInit() {
		this.initSubRouter();
	}

	initSubRouter() {
		this.subRouter = this.JFrogSubRouter.createLocalRouter({
			parentScope: this.$scope,
			urlStructure: '/:packageType/:package/:version/?:repo&:query',
			hotSyncUrl: true,
			encodeSearchParamsAsBase64: 'state',
			states: [
				{
					name: 'packages',
					params: {mandatory: ['packageType'], nullify: ['package', 'version', 'repo']}
				},
				{
					name: 'package',
					params: {mandatory: ['packageType', 'package'], nullify: ['version', 'repo']}
				},
				{
					name: 'version',
					params: {mandatory: ['packageType', 'package', 'version', 'repo'], nullify: []}
				}
			],
			onInit: () => {
//				console.log('Sub Router onInit')
				if (!this.subRouter.params.packageType) {
                    this.subRouter.goto('packages', {packageType: 'docker'});
				}
                if (!this.subRouter.params.query) this.subRouter.params.query = {};
				else {
                    this.subRouter.params.query = _.pick(this.subRouter.params.query, _.identity);
                }

            },
			onChangeFromUrl: (oldParams, newParams) => {
//				console.log('Sub Router onChangeFromUrl', oldParams, newParams)
			},
			onStateChange: (oldState, newState) => {
//				console.log('Sub Router onStateChange', `${oldState} -> ${newState}`)
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

}

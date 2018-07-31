export default class VersionController {

	constructor(JFrogSubRouter, $scope, JFrogUIUtils, ModelFactory, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.ModelFactory = ModelFactory;
		this.jFrogUIUtils = JFrogUIUtils;
        this.descriptor = NativeUIDescriptor.getDescriptor();
	}


	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.package
		);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.version
		);
		this.packageTypeIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.package;
		this.versionIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.version;
	}

	$onInit() {
		this.getVersionData(this.$stateParams).then(() => {
			this.initConstants();
			if (this.isWithXray && typeof this.isWithXray === 'function') {
				this.isWithXray().then((response) => {
					this.withXray = response;
					this.summaryColumns = this.getSummaryColumns();
				});
			} else {
				this.summaryColumns = this.getSummaryColumns();
			}

			this.subRouter.listenForChanges(['package', 'version'], 'version', () => {
				this.getVersionData(this.$stateParams);
			}, this.$scope);

		})
	}

	getVersionData(daoParams) {
		return this.getVersion({daoParams: daoParams}).then((version) => {
			this.version = this.ModelFactory.getVersionModel(daoParams.packageType, version);
		}).catch(() => {
			delete this.version;
		})
	}

	goBack() {
		this.subRouter.goto('package', {
			packageType: this.$stateParams.packageType,
			package: this.$stateParams.package
		})
	}

	getSummaryColumns() {
		return [
			{
				noWrap: true,
				template: `<div class="summary-icon-column">
							<i class="icon" ng-class="$ctrl.versionIcon"></i>
						</div>`,
				isActive: true,
				width: '120px'
			}, {
				label: `${this.versionAlias} Name`,
				class: 'version-name',
				noWrap: true,
				template: `<span jf-tooltip-on-overflow>{{$ctrl.version.name || 'No version'}}</span>`,
				isActive: true
			}, {
				label: 'Size',
				class: 'version-size',
				template: `{{$ctrl.version.size.length ? $ctrl.version.size : ($ctrl.version.size | filesize)}}`,
				isActive: true
			}, {
				label: `${this.packageAlias} Name`,
				class: 'package-name',
				noWrap: true,
				template: `<span jf-tooltip-on-overflow>{{$ctrl.version.packageName}}</span>`,
				isActive: true
			}, {
				label: `${this.packageAlias} ID`,
				class: 'package-id',
				noWrap: true,
				template: `<span class="package-id-content" 
								 jf-tooltip-on-overflow>
								{{ $ctrl.version.packageId }}
							</span>
							<jf-clip-copy 
								text-to-copy="$ctrl.version.packageId"
							    object-name="{{$ctrl.packageAlias}} ID">
							</jf-clip-copy>`,
				isActive: true
			}, {
				label: 'Security',
				class: 'version-security',
				template: `{{$ctrl.version.security}}`,
				isActive: this.withXray
			}, {
				label: 'Last Modified',
				noWrap: true,
				template: `<span jf-tooltip-on-overflow>
                            {{$ctrl.version.lastModified ? ($ctrl.version.lastModified | date : 'medium')  : '--'}}
                       </span>`,
				isActive: true
			}];
	}

}
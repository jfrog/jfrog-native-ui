import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class VersionController {

	constructor(JFrogSubRouter, $scope, JFrogUIUtils, ModelFactory) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.ModelFactory = ModelFactory;
		this.jFrogUIUtils = JFrogUIUtils;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
	}


	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.$stateParams.packageType].package.alias
		);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.$stateParams.packageType].version.alias
		);
		this.packageTypeIcon = this.PACKAGE_NATIVE_CONSTANTS[this.$stateParams.packageType].package.icon;
		this.versionIcon = this.PACKAGE_NATIVE_CONSTANTS[this.$stateParams.packageType].version.icon;
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

			this.subRouter.on('params.change', (oldParams, newParams) => {
				if ((oldParams.package !== newParams.package || oldParams.version !== newParams.version) && newParams.repo && this.subRouter.state === 'version' ) {
					this.getVersionData(this.$stateParams);
				}
			}, this.$scope)

		})
	}

	getVersionData(daoParams) {
		return this.getVersion({daoParams: daoParams}).then((version) => {
			this.version = this.ModelFactory.getVersionMedel(daoParams.packageType, version);
		});
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
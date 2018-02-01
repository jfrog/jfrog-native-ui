import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class VersionController {

	constructor($state, $scope, JFrogUIUtils, JFrogEventBus) {
		this.$state = $state;
		this.$scope = $scope;
		this.jFrogUIUtils = JFrogUIUtils;
		this.JFrogEventBus = JFrogEventBus;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
	}


	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.packageType].package.alias
		);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.packageType].version.alias
		);
		this.packageTypeIcon = this.PACKAGE_NATIVE_CONSTANTS[this.packageType].package.icon;
	}

	$onInit() {
		this.initConstants();
		this.withXray = false; // TODO: replace stab with footer data
		this.summaryColumns = this.getSummaryColumns();
	}

	goBack() {
		this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER, {
			packageType: this.packageType,
			package: this.packageName
		});
	}

	getSummaryColumns() {
		return [{
			label: `${this.versionAlias} Name`,
			class: 'version-name',
			template: `{{$ctrl.version.name || 'No version'}}`,
			isActive: true
		}, {
			label: 'Size',
			class: 'version-size',
			template: `{{$ctrl.version.size.length ? $ctrl.version.size : ($ctrl.version.size | filesize)}}`,
			isActive: true
		}, {
			label: `${this.packageAlias} Name`,
			class: 'package-name',
			template: `{{$ctrl.version.packageName}}`,
			isActive: true
		}, {
			label: `${this.packageAlias} ID`,
			class: 'Package ID',
			template: '{{$ctrl.version.packageId}}',
			isActive: true
		}, /*{
            label: 'Labels',
            class: 'version-labels',
            template: `<span ng-if="$ctrl.version.labels"
			              jf-tooltip="{{$ctrl.jFrogUIUtils.formatHtmlList($ctrl.version.labels,4) || ''}}"
		                  ng-bind-html="$ctrl.jFrogUIUtils.stringifyData($ctrl.version.labels)">
		               </span>`,
            noWrap: true,
            isActive: true
        },*/{
			label: 'Security',
			class: 'version-security',
			template: `{{$ctrl.version.security}}`,
			isActive: this.withXray
		}, {
			label: 'Last Modified',
			class: 'package-modified-date',
			template: `<span jf-tooltip-on-overflow>
                            {{$ctrl.version.lastModified ? ($ctrl.version.lastModified | date : 'medium') : '--'}}
                       </span>`,
			noWrap: true,
			isActive: true
		}];
	}

}
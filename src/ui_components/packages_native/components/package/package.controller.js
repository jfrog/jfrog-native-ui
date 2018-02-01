import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class PackageController {

	constructor($state, $stateParams, $scope, JFrogTableViewOptions,
	            JFrogUIUtils, JFrogEventBus, $rootScope, JFrogModal) {
		this.$state = $state;
		this.$scope = $scope;
		this.$stateParams = $stateParams;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.jFrogUIUtils = JFrogUIUtils;
		this.JFrogEventBus = JFrogEventBus;
		this.$rootScope = $rootScope;
		this.modal = JFrogModal;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
	}

	$onInit() {
		this.initConstants();
		this.initTable();
		this.summaryColumns = this.getSummaryColumns();
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

	initTable() {
		this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
		this.columns = this.getTableColumns();
		this.tableViewOptions
		    .setColumns(this.columns)
		    .setRowsPerPage(20)
		    .setEmptyTableText('No packages')
		    .setActions(this.getActions())
		    .setData(this.package.versions);
		this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
	}

	onRowClick(row) {
		if (row && row.entity && row.entity.name && row.entity.name !== this.columns[0].header) {
			this.goToVersion(row.entity.name, row.entity.repo);
		}
	}

	getActions() {
		// TODO: Export this to a constants json with all actions relevant to a repo type (and bind to ctrl)
		return [
			{
				icon: 'icon icon-report',
				tooltip: 'View manifest',
				callback: (row) => {
					this.showManifest(row.name, row.repo);
				}
			}
		];
	}

	getTableColumns() {
		return [{
			field: 'name',
			header: `${this.versionAlias} Name`,
			width: '20%',
			cellTemplate: `<div class="name"
                                cm-additional-action="View version"
                                cm-additional-action-icon="icon-docker-tags"
                                ng-click="appScope.$ctrl.goToVersion(row.entity.name,row.entity.repo)">
								    {{row.entity.name}}
                            </div>`
		}, {
			field: 'repo',
			header: 'Repository',
			width: '20%'
		}, {
			field: 'packageId',
			header: `${this.packageAlias} ID`,
			width: '20%'
		}, {
			field: 'lastModified',
			header: 'Last Modified',
			cellTemplate: `<div class="last-modified">
                                {{ row.entity.lastModified | date : 'medium'}}
                            </div>`,
			width: '25%'
		}, {
			field: 'size',
			header: 'Size',
			cellTemplate: `<div class="size">
                                {{ row.entity.size | filesize }}
                           </div>`,
			width: '15%'
		}
			// Xray is for phase 2
			/*{
			field: 'xray',
			header: 'Xray',
			cellTemplate: `<div class="xray">
								{{row.entity.xray}}
							</div>`,
			width: '20%'
		}*/];
	}

	goToVersion(versionName, repo) {
		this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER, {
			packageType: this.packageType,
			package: this.package.name,
			repo: repo,
			version: versionName
		});
	}

	goBack() {
		this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER, {
			packageType: this.packageType
		});
	}

	showManifest(versionName, repo) {
		if (this.getManifest && typeof this.getManifest === 'function') {
			let daoParams = {
				packageType: this.packageType,
				package: this.package.name,
				version: versionName,
				repo: repo,
				manifest: true
			};

			this.getManifest({daoParams: daoParams}).then((response) => {
				this.modalScope = this.$rootScope.$new();
				this.modalScope.modalTitle = 'Manifest.json';

				this.modalScope.closeModal = () => {
					return this.modalInstance.close();
				};
				this.modalScope.downloadManifest = () => {
					this.jFrogUIUtils.saveTextAsFile(this.modalScope.manifest,
						`manifest_${this.package.name}_${versionName}.txt`);
					this.modalScope.closeModal();
				};
				this.modalScope.manifest = JSON.stringify(angular.fromJson(response.fileContent), null, '\t');
				this.modalInstance = this.modal.launchModal('manifest.modal', this.modalScope, 'lg');
			});
		}
	}

	getSummaryColumns() {
		return [{
			label: `${this.packageAlias} Name`,
			class: 'package-name',
			template: `{{$ctrl.package.name || 'No package'}}`,
			isActive: true
		}, {
			label: 'Number Of Downloads',
			class: 'package-downloads-count',
			template: `{{$ctrl.package.downloadsCount}}`,
			isActive: true
		}, {
			label: 'Last Modified',
			class: 'package-modified-date',
			template: `<span jf-tooltip-on-overflow>
                        {{$ctrl.package.lastModified ? ($ctrl.package.lastModified | date : 'medium') : '--'}}
                       </span>`,
			noWrap: true,
			isActive: true
		}];
	}
}
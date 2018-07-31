export default class PackageController {

	constructor(JFrogSubRouter, ModelFactory, $scope, JFrogTableViewOptions,
	            JFrogUIUtils, $rootScope, JFrogModal, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.ModelFactory = ModelFactory;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.jFrogUIUtils = JFrogUIUtils;
		this.$rootScope = $rootScope;
		this.modal = JFrogModal;
		this.descriptor = NativeUIDescriptor.getDescriptor();


	}

	$onInit() {
        this.getPackageSummary({daoParams: this.$stateParams}).then(summary => {
            console.log('!!!!!', summary);
        })

		this.getPackageData().then(() => {
			this.initConstants();
			if (this.isWithXray && typeof this.isWithXray === 'function') {
				this.isWithXray().then((response) => {
					this.withXray = response;
					this.initTable();
				});
			} else {
				this.initTable();
			}

			this.subRouter.listenForChanges(['package', 'repos'], 'package', () => {
				this.getPackageData().then(() => {
					this.tableViewOptions.setData(this.package.versions);
				})
			}, this.$scope);

			this.summaryColumns = this.getSummaryColumns();
		})
	}

	getPackageData(additionalDaoParams) {

		additionalDaoParams = additionalDaoParams || {};
		additionalDaoParams.sortBy = additionalDaoParams.sortBy || 'lastModified';
		additionalDaoParams.order = additionalDaoParams.order || 'desc';

		let daoParams = _.extend({}, this.$stateParams, additionalDaoParams);
		delete daoParams.repos;
		daoParams.repoFilter = [];
		if (this.$stateParams.query.repos) {
			daoParams.repoFilter.push({
				id: 'repo',
				comparator: this.descriptor.defaultComparator,
				values: this.$stateParams.query.repos.split(',')
			});
		}
		if (this.$stateParams.query.version) {
			daoParams.repoFilter.push({
				id: 'version',
				comparator: this.descriptor.defaultComparator,
				values: [this.$stateParams.query.version]
			});
		}

		this.calcPackageDownloads();

		return this.getPackage({daoParams}).then((pkg) => {
			pkg.totalDownloads = this.totalDownloadsForPackage || 0;
			this.package = this.ModelFactory.getPackageModel(this.$stateParams.packageType, pkg);
		});
	}

	calcPackageDownloads() {
		let daoParams = {
			package: this.$stateParams.package,
			packageType: this.$stateParams.packageType
		};
		this.getPackageDownloadsCount({daoParams}).then((response) => {
			if (this.package) this.package.totalDownloads = response.totalDownloads;
			this.totalDownloadsForPackage = response.totalDownloads;
		});
	}

	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.package
		);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.version
		);
		this.packageTypeIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.package;
		this.packagesIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.packages;
	}

	initTable() {
		this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
		this.columns = this.getTableColumns();
		this.tableViewOptions
		    .setColumns(this.columns)
		    .setRowsPerPage(20)
		    .setEmptyTableText(`No ${this.versionAlias}s`)
		    .setActions(this.getActions())
		    .sortBy('lastModified').reverseSortingDir()
		    .setData(this.package.versions);
		this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
		this.tableViewOptions.useExternalSortCallback(this.onSortChange.bind(this));

	}

	onSortChange(field, dir) {
		if (field === 'repo') field = 'repoKey';

		this.getPackageData({
			sortBy: field,
			order: dir
		}).then(() => {
			this.tableViewOptions.setData(this.package.versions);
		})
	}

	onRowClick(row) {
		if (row && row.entity && row.entity.name && !$(row.event.target).is('.copy-to-clip')) {
			this.goToVersion(row.entity.name, row.entity.repo);
		}
	}

	getActions() {
		// TODO: Export this to a constants json with all actions relevant to a repo type (and bind to ctrl)
		return [{
			icon: 'icon icon-show-in-tree',
			tooltip: 'Show In Tree',
			visibleWhen: () => this.showInTree && typeof this.showInTree === 'function',
			callback: (row) => {
				let pathParams = {
					repo: row.repo,
					package: this.package.name,
					version: row.name
				};
				this.showInTree({pathParams: pathParams});
			}
		}, {
			icon: 'icon icon-report',
			tooltip: 'View manifest',
			callback: (row) => {
				this.showManifest(row.name, row.repo);
			}
		}];
	}

	getTableColumns() {
        return _.map(this.descriptor.typeSpecific[this.$stateParams.packageType].versionsTableColumns, column => {
            let columnObj;
        	if (_.isString(column)) {
                columnObj = this.descriptor.common.versionsTableColumns[column];
                columnObj.field = column;
            }
            else columnObj = column;

        	if (columnObj.header.indexOf('@{VERSION_ALIAS}') !== -1) {
                columnObj.header = columnObj.header.replace('@{VERSION_ALIAS}', this.versionAlias);
	        }

	        return columnObj;
        });
	}

	goToVersion(versionName, repo) {
		this.subRouter.goto('version', {
			packageType: this.$stateParams.packageType,
			package: this.package.name,
			repo: repo,
			version: versionName
		})
	}

	goBack() {
		this.subRouter.goto('packages', {packageType: this.$stateParams.packageType})
	}

	showManifest(versionName, repo) {
		if (this.getManifest && typeof this.getManifest === 'function') {
			let daoParams = {
				packageType: this.$stateParams.packageType,
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
			class: 'package-icon',
			template: `<div class="summary-icon-column">
							<i class="icon" ng-class="$ctrl.packagesIcon"></i>
						</div>`,
			isActive: true,
			noWrap: true,
			width: '120px'
		}, {
			label: `${this.packageAlias} Name`,
			class: 'package-name',
			noWrap: true,
			template: `<span jf-tooltip-on-overflow>{{$ctrl.package.name || 'No package'}}</span>`,
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

	calcVersionDownloads(row, e) {
		if (e) e.stopPropagation();
		if (!this.getVersionDownloadsCount || !typeof this.getVersionDownloadsCount === 'function') {
			return;
		}

		let daoParams = {
			repo: row.repo,
			package: this.package.name,
			packageType: this.$stateParams.packageType,
			version: row.name,
		};
		row.pendingCalculation = true;
		this.getVersionDownloadsCount({daoParams: daoParams}).then((response) => {
			row.downloadsCount = response.totalDownloads;
			row.calculated = true;
			row.pendingCalculation = false;
		});
	}

}
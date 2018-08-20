export default class PackageController {

	constructor(JFrogSubRouter, $scope, $q, JFrogTableViewOptions,
	            JFrogUIUtils, $rootScope, JFrogModal, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.$q = $q;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.jFrogUIUtils = JFrogUIUtils;
		this.$rootScope = $rootScope;
		this.modal = JFrogModal;
		this.descriptor = NativeUIDescriptor.getDescriptor();


	}

	$onInit() {
        this.nativeParent.stateController = this;

        let init = () => {
            this.initConstants();
            this.initTable();

            this.subRouter.listenForChanges(['packageType', 'package', 'repos'], 'package', () => {
                this.getSummaryData();
                this.getPackageData().then(() => {
                    this.tableViewOptions.setData(this.package.versions);
                })
            }, this.$scope);

            this.summaryColumns = this.getSummaryColumns();

        }
        this.getSummaryData();
        this.getPackageData().then(() => {
			init();
		}).catch(() => {
            this.package = {};
            init();
		})
	}

    get typeSpecific() {
        return this.descriptor.typeSpecific[this.$stateParams.packageType];
    }

	getSummaryData() {
		if (this.$stateParams.packageType !== 'docker') {
		    let defer = this.$q.defer();
            this.nativeParent.hostData.getPackageSummary(this.$stateParams).then(summaryData => {
                this.summaryData = summaryData
                this.summaryData.installCommand = this.descriptor.typeSpecific[this.$stateParams.packageType].installPrefix + ' ' + this.$stateParams.package;
                if (summaryData.latestPath) {
                    this.nativeParent.hostData.getPackageSummaryExtraInfo(_.extend({},this.$stateParams,{path: summaryData.latestPath})).then(summaryExtraData => {
                        _.extend(this.summaryData, summaryExtraData)
                        defer.resolve();
                    })
                }
                else defer.resolve()
            }).catch(console.error)
            return defer.promise;
		}
		else {
            this.summaryData = {}
            this.summaryData.installCommand = this.descriptor.typeSpecific[this.$stateParams.packageType].installPrefix + ' ' + this.$stateParams.package;
            return this.$q.when();
		}
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
				comparator: this.descriptor.common.defaultComparator,
				values: this.$stateParams.query.repos.split(',')
			});
		}
		if (this.$stateParams.query.version) {
			daoParams.repoFilter.push({
				id: 'version',
				comparator: this.descriptor.common.defaultComparator,
				values: [this.$stateParams.query.version]
			});
		}

		if (this.$stateParams.packageType === 'docker') this.calcPackageDownloads();

        this.cancelPackageExtraInfo();
        return this.nativeParent.hostData.getPackage(daoParams).then((pkg) => {
			pkg.totalDownloads = this.totalDownloadsForPackage || 0;
			this.package = this.descriptor.typeSpecific[this.$stateParams.packageType].transformers.package(pkg);
		});
	}

	calcPackageDownloads() {
		let daoParams = {
			package: this.$stateParams.package,
			packageType: this.$stateParams.packageType
		};
		this.nativeParent.hostData.getPackageDownloadsCount(daoParams).then((response) => {
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

        this.tableViewOptions.on('row.in.view', row => {
            if (row.downloadsCount === undefined) {
            	if (this.$stateParams.packageType === 'docker') this.calcVersionDownloads(row);
            	else if (this.nativeParent.dbType !== 'derby') this.calcPackageExtraData(row);
            }
        });

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
			this.goToVersion(row.entity.name, row.entity.repo || row.entity.repositories[0], row.entity.latestPath);
		}
	}

	getActions() {
		// TODO: Export this to a constants json with all actions relevant to a repo type (and bind to ctrl)
		return [{
			icon: 'icon icon-show-in-tree',
			tooltip: 'Show In Tree',
			callback: (row) => {
			    if (row.latestPath) {
                    this.nativeParent.hostData.showInTree({fullpath: row.latestPath});
                }
                else {
                    let pathParams = {
                        repo: row.repo,
                        package: this.package.name,
                        version: row.name
                    };
                    this.nativeParent.hostData.showInTree(pathParams);
                }
			}
		}, {
			icon: 'icon icon-report',
			tooltip: 'View manifest',
            visibleWhen: () => this.$stateParams.packageType === 'docker',
			callback: (row) => {
				this.showManifest(row.name, row.repo);
			}
		}];
	}

	getTableColumns() {
        if (this.nativeParent.dbType === 'derby') {
            this.typeSpecific.versionsTableColumns = _.filter(this.typeSpecific.versionsTableColumns, col => {
                let hiddenColumns = this.typeSpecific.columnsRemovedForDerby;
                return !_.includes(hiddenColumns, _.isString(col) ? col : col.field)
            })
        }

        return _.map(this.typeSpecific.versionsTableColumns, column => {
            let columnObj;
        	if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.versionsTableColumns[column]);
                columnObj.field = column;
            }
            else columnObj = column;

        	if (columnObj.header.indexOf('@{VERSION_ALIAS}') !== -1) {
                columnObj.header = columnObj.header.replace('@{VERSION_ALIAS}', this.versionAlias);
	        }

	        return columnObj;
        });
	}

	goToVersion(versionName, repo, path) {
        this.cancelPackageExtraInfo();
        this.subRouter.goto('version', {
			packageType: this.$stateParams.packageType,
			package: this.$stateParams.package,
			repo: repo,
	        versionPath: path,
			version: versionName
		})
	}

	goBack() {
		this.subRouter.goto('packages', {packageType: this.$stateParams.packageType})
	}

	showManifest(versionName, repo) {
		let daoParams = {
			packageType: this.$stateParams.packageType,
			package: this.package.name,
			version: versionName,
			repo: repo,
			manifest: true
		};

		this.nativeParent.hostData.getManifest(daoParams).then((response) => {
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

	getSummaryColumns() {
        return _.map(this.descriptor.typeSpecific[this.$stateParams.packageType].packageSummaryColumns, column => {
            let columnObj;
            if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.packageSummaryColumns[column]);
            }
            else columnObj = column;

            ['label', 'template'].forEach(objField => {
                if (columnObj[objField] && columnObj[objField].indexOf('@{PACKAGE_ALIAS}') !== -1) {
                    columnObj[objField] = columnObj[objField].replace('@{PACKAGE_ALIAS}', this.packageAlias);
                }
            })

            return columnObj;

        });
	}

	calcVersionDownloads(row, e) {
		if (e) e.stopPropagation();
		let daoParams = {
			repo: row.repo,
			package: this.package.name,
			packageType: this.$stateParams.packageType,
			version: row.name,
		};
		row.pendingCalculation = true;
		this.nativeParent.hostData.getVersionDownloadsCount(daoParams).then((response) => {
			row.downloadsCount = response.totalDownloads;
			row.calculated = true;
			row.pendingCalculation = false;
		});
	}

    calcPackageExtraData(row) {
        if (!this.extraDataQueue) this.extraDataQueue = [];
        this.extraDataQueue.push(row);

        if (!this.extraDataQueueRunning) {
            this.extraDataQueueRunning = true;
            let fetch = () => {
                if (this.extraDataQueue.length) {
                    let next = this.extraDataQueue[0];
                    this.extraDataQueue.splice(0,1);
                    this._calcPackageExtraData(next).then(() => {
                        fetch();
                    })
                }
                else this.extraDataQueueRunning = false;
            }
            fetch();
        }

    }

    cancelPackageExtraInfo() {
        this.nativeParent.hostData.cancelPackageExtraInfo();
        this.extraDataQueueRunning = false;
        this.extraDataQueue = [];
    }

    _calcPackageExtraData(row) {
        if (row.calculated || row.calculationPending) return;

        let versionName = row.name;
        let daoParams = {
            version: versionName
        };
        row.calculationPending = true;
        return this.nativeParent.hostData.getPackageExtraInfo(daoParams).then((response) => {
            _.merge(row, this.typeSpecific.transformers.version(response));
/*
            if (response.totalDownloads !== undefined) {
                row.downloadsCount = response.totalDownloads;
            }
            else {
                row.manualOnDemendDownloadsCount = true;
            }
*/
            row.calculated = true;
            row.calculationPending = false;
        })
    }

}
export default class PackagesController {

	constructor(JFrogSubRouter, $q, $scope, JFrogTableViewOptions, JFrogUIUtils, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.$q = $q;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.jFrogUIUtils = JFrogUIUtils;
        this.descriptor = NativeUIDescriptor.getDescriptor();
		this.sorting = {sortBy: 'name', order: 'asc'};
		this.ready = false;

		this.extraInfoRequestsToCancel = []
	}

	$onInit() {
	    this.nativeParent.stateController = this;
		this.packages = {};

		this.initPackagesViewData(this.$stateParams);

		this.subRouter.listenForChanges(['packageType', 'query'], 'packages',
			(oldP, newP) => {
				this.initPackagesViewData(this.$stateParams);
				if (!!oldP.query && !newP.query) {
					this.initFilters();
					this.getSelectedRepos();
					this.getFilteredData();
				}
			}, this.$scope);

	}

	getPackagesData(daoParams) {
		if (!daoParams.filters || !daoParams.filters.length) {
			return this.initEmptyPackagesPage(daoParams);
		}

		let searchParams = {
			filters: daoParams.filters || [],
			sortBy: daoParams.sortBy || 'name',
			order: daoParams.order || 'asc'
		};

/*
        if (this.$stateParams.packageType !== 'docker') {
            this.nativeParent.hostData.getPackagesCount(searchParams).then((result) => {
                this.totalCount = result.numOfPackages;
            });
        }
        else delete this.totalCount;
*/
        let cached = this.nativeParent.cache('packages.list');
        if (cached && _.isEqual(cached.searchParams, searchParams)) {
            if (cached.list && cached.list.data) cached.list.data.forEach(row => delete row.calculationPending);
            this.packages.list = cached.list;
            return this.$q.when();
        }
        else {
            this.$pendingData = true;
            return this.nativeParent.hostData.getPackages(searchParams).then((packages) => {
                this.packages.list = this.typeSpecific.transformers.packages(packages);
                this.nativeParent.cache('packages.list', {
                    list: this.packages.list,
                    searchParams: _.cloneDeep(searchParams)
                })
                this.$pendingData = false;
            });
        }

	}

	initPackagesViewData(daoParams) {
        delete this.hasSelectedFilters;
	    this.resetReposList();
        this.refreshPackageTypes(daoParams).then(() => {
			this.$q.all([
				this.refreshFilters(daoParams),
			]).then(() => {
				this.initSelectedPackageType();
				this.refreshAll();
				this.ready = true;
			}).catch(e => console.error(e))
		})
	}

	refreshPackageTypes(daoParams) {
        return this.nativeParent.getAvailablePackageTypes(daoParams).then((packageTypes) => {
            this.packageTypes = packageTypes;
		});
	}

	refreshFilters(daoParams) {
        return this.nativeParent.hostData.getRepos(daoParams).then((filters) => {
            this.filters = this.descriptor.common.transformers.filters(filters, daoParams.packageType);
        });
	}

	initEmptyPackagesPage(daoParams) {
		let defferd = this.$q.defer();
        this.packages.list = this.typeSpecific.transformers.packages([]);
		defferd.resolve(this.packages.list);
		return defferd.promise;
	}

	refreshAll() {
        this.initFilters();
		this.initConstants();
		this.initTable();
	}

	get typeSpecific() {
	    return this.selectedPackageType ? this.descriptor.typeSpecific[this.selectedPackageType.value] : {};
    }

	initConstants() {
	    if (this.typeSpecific && this.typeSpecific.aliases && this.typeSpecific.icons) {
            this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(this.typeSpecific.aliases.package);
            this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(this.typeSpecific.aliases.version);
            this.packageTypeIcon = this.typeSpecific.icons.package;
            this.versionIcon = this.typeSpecific.icons.version;
        }
	}

	initSelectedPackageType() {
        let selected = _.find(this.packageTypes, (packageType) => {
			return packageType.value === this.$stateParams.packageType;
		});
        if (selected) this.selectedPackageType = selected;
    }

	initFilters() {
		this.reposList = _.map(this.filters.repos, (value) => {
			return {
				text: value,
				isSelected: !this.$stateParams.query.repos ? false : _.includes(this.$stateParams.query.repos.split(','), value)
			};
		});
        this.moreFiltersList = _.map(Object.keys(this.filters.extraFilters || {}), (value) => {
		    let id = this.filters.extraFilters[value];
			return {
				text: this.descriptor.typeSpecific[this.$stateParams.packageType].filtersLabels[id],
                id: id,
				isSelected: !!this.$stateParams.query[id],
				inputTextValue: this.$stateParams.query[id] || ''
			};
		});

		this.initialDropDownPlaceholder = this.moreFiltersList[0] ? (this.moreFiltersList[0].text + ' (You can use * or ? as wildcards)') : '';

		if (!_.isEmpty(this.$stateParams.query)) {
			this.getSelectedRepos();
			this.getFilteredData();
		}
	}

	initTable() {
		this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
		this.tableViewOptions
		    .setColumns(this.getColumns())
		    .showFilter(false)
		    .showCounter(false)
		    .showPagination(false)
		    .setPaginationMode(this.tableViewOptions.VIRTUAL_SCROLL)
		    .setRowsPerPage('auto')
		    .setRowHeight(76, 25)
		    .alwaysShowSortingArrows()
		    .setEmptyTableText(`No ${this.packageAlias}s found. You can broaden your search by using the * wildcard`)

		this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
		this.tableViewOptions.useExternalSortCallback(this.onSortChange.bind(this));

		this.tableViewOptions.on('row.in.view', row => {
			if (this.$stateParams.packageType === 'docker' || this.nativeParent.showExtraInfo) this.calcPackageExtraData(row);
		});
	}

	onSortChange(field, dir) {
		if (field === 'versionsCount') field = 'totalVersions';
		this.sorting = {sortBy: field, order: dir};
		this.getFilteredData();
	}

	onRowClick(row) {
		if (row && row.entity && row.entity.name && row.entity.name !== 'Name') {
			this.goToPackage(row.entity.name);
		}
	}

	getColumns() {

	    if (!this.nativeParent.showExtraInfo) {
            let hiddenColumns = this.typeSpecific.columnsRemovedForDerby;
            this.typeSpecific.packagesTableColumns = _.filter(this.typeSpecific.packagesTableColumns, col => {
                return !_.includes(hiddenColumns, _.isString(col) ? col : col.field)
            })
        }

        return _.map(this.typeSpecific.packagesTableColumns, column => {
            let columnObj;
            if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.packagesTableColumns[column]);
                columnObj.field = column;
            }
            else columnObj = column;

            if (columnObj.header.indexOf('@{PACKAGE_ALIAS}') !== -1) {
                columnObj.header = columnObj.header.replace('@{PACKAGE_ALIAS}', this.packageAlias);
            }

            return columnObj;

        });
	}

	resetReposList() {
	    if (this.reposList && this.reposList.length) {
	        this.reposList.forEach(repo => repo.isSelected = false);
        }
        this.selectedRepos = null;
    }

	getSelectedRepos() {
		let selected = _.filter(this.reposList, (repo) => {
			return repo.isSelected;
		});
		if (selected.length) {
			this.selectedRepos = [{
				id: 'repo',
				comparator: this.descriptor.common.defaultComparator,
				values: selected.map((selectedRepo) => {
					return selectedRepo.text;
				})
			}];
		} else {
			this.selectedRepos = null;
		}
	}

	getSelectedFilters() {
		let selected = _.filter(this.moreFiltersList, (filter) => {
			return filter.inputTextValue;
		}).map((filter) => {
			return {
				id: filter.id,
				comparator: this.descriptor.common.defaultComparator,
				values: [filter.inputTextValue || '']
			};
		});
		this.selectedFilters = selected.length ? selected : null;
	}

	getFilteredData(noCache = false) {
		if (noCache) this.nativeParent.cache('packages.list', null);

		this.getSelectedFilters();
		let daoParams = {
			filters: this.concatAllActiveFilters(),
			sortBy: this.sorting.sortBy,
			order: this.sorting.order
		};

        this.moreFiltersList.forEach(filter => {
            let actualFilter = _.find(daoParams.filters, {id: filter.id});
            if (actualFilter && actualFilter.values[0]) {
                this.$stateParams.query[filter.id] = actualFilter.values[0];
            }
            else {
                delete this.$stateParams.query[filter.id];
            }
        })

        this.cancelPackageExtraInfo();
		this.getPackagesData(daoParams).then(() => {
			this.tableViewOptions.setData(this.packages.list.data);
			this.hasSelectedFilters = daoParams.filters.length > 0;
		});
	}

	concatAllActiveFilters() {
		let filters = [];
		filters = (this.selectedFilters ? filters.concat(this.selectedFilters) : filters);
		filters = (this.selectedRepos ? filters.concat(this.selectedRepos) : filters);
		return filters;
	}

	onPackageTypeChange() {
		// Fire a refresh callback for getting packages and filters
		this.$stateParams.packageType = this.selectedPackageType.value;
        localStorage.lastNativeUIPackageType = this.$stateParams.packageType;
        this.packages = {};
        this.$stateParams.query = {};
        delete this.hasSelectedFilters;
        this.cancelPackageExtraInfo();
        this.initPackagesViewData(this.$stateParams);
		this.refreshAll();
		//TODO: when more package types would become available - figure out how to change the view
	}

	onRepoFilterChange() {
		this.getSelectedRepos();

		if (this.selectedRepos && this.selectedRepos[0] && this.selectedRepos[0].values) {
            this.$stateParams.query.repos = this.selectedRepos[0].values.join(',');
        }
        else {
		    delete this.$stateParams.query.repos;
        }
	}

	onExtraFilterChange() {
		this.getSelectedFilters();
	}

	getPackageTypeTemplate($item) {
		return `<div>
                    <i class="icon ${$item.iconClass}"></i>
                    <span>${$item.displayText}</span>
                </div>`;
	}

	goToPackage(packageName) {
	    this.cancelPackageExtraInfo();
		this.subRouter.goto('package', {packageType: this.selectedPackageType.value, package: packageName})
	}

	calcPackageExtraData(row) {
		if (row.calculated || row.calculationPending) return;

		let pkgName = row.name;
		let daoParams = {
			package: pkgName,
			packageType: this.selectedPackageType.value
		};
		row.calculationPending = true;
		return this.nativeParent.hostData.getPackageExtraInfo(daoParams).then((response) => {
		    _.merge(row, this.typeSpecific.transformers.package(response));
/*
			if (response.totalDownloads !== undefined) {
				row.downloadsCount  = response.totalDownloads;
			}
			else {
				row.manualOnDemendDownloadsCount = true;
			}
			if (response.lastModified) row.lastModified = response.lastModified;
			if (response.totalVersions) row.versionsCount = response.totalVersions;
*/
			row.calculated = true;
			row.calculationPending = false;
		})
	}

    cancelPackageExtraInfo() {
        this.nativeParent.hostData.cancelPackageExtraInfo();
    }

	calcPackageDownloads(e, row) {
		e.stopPropagation();
		let pkgName = row.name;
		let daoParams = {
			package: pkgName,
			packageType: this.selectedPackageType.value
		};
		this.nativeParent.hostData.getPackageDownloadsCount(daoParams).then((response) => {
			row.downloadsCount = response.totalDownloads;
			delete row.manualOnDemendDownloadsCount;
		});


	}

}
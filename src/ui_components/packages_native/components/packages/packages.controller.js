import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class PackagesController {

	constructor(JFrogSubRouter, ModelFactory, $q, $scope, JFrogTableViewOptions, JfFullTextService, JFrogUIUtils) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.$q = $q;
		this.ModelFactory = ModelFactory;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.fullTextService = JfFullTextService;
		this.jFrogUIUtils = JFrogUIUtils;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
		this.sorting = {sortBy: 'name', order: 'asc'};
		this.ready = false;
	}

	$onInit() {
		this.packages = {};

		this.initPackagesViewData(this.$stateParams);

		this.subRouter.listenForChanges(['packageType', 'packageQuery', 'versionQuery', 'repos'], 'packages',
			(oldP, newP) => {
				this.initPackagesViewData(this.$stateParams);
				if (!!oldP.packageQuery && !newP.packageQuery || !!oldP.versionQuery && !newP.versionQuery) {
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
			packageType: daoParams.packageType,
			filters: daoParams.filters || [],
			sortBy: daoParams.sortBy || 'name',
			order: daoParams.order || 'asc'
		};

		let pkgFilter = _.find(searchParams.filters, {id: 'pkg'});
		if (pkgFilter && pkgFilter.values[0] && !pkgFilter.values[0].endsWith('*')) {
			pkgFilter.values[0] = pkgFilter.values[0] + '*'
		}

		this.$pendingData = true;
		return this.getPackages({daoParams: searchParams}).then((packages) => {
			this.packages.list = this.ModelFactory.getPackageListMedel(daoParams.packageType, packages);
			this.$pendingData = false;
		});
	}

	initPackagesViewData(daoParams) {
		this.refreshPackageTypes(daoParams).then(() => {
			this.$q.all([
				this.refreshFilters(daoParams),
			]).then(() => {
				this.initSelectedPackageType();
				this.refreshAll();
				this.ready = true;
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

	refreshFilters(daoParams) {
		return this.getFilters({daoParams: daoParams}).then((filters) => {
			this.filters = this.ModelFactory.getFiltersMedel(daoParams.packageType, filters);
		});
	}

	initEmptyPackagesPage(daoParams) {
		let defferd = this.$q.defer();
		this.packages.list = this.ModelFactory.getPackageListMedel(daoParams.packageType, []);
		defferd.resolve(this.packages.list);
		return defferd.promise;
	}

	refreshAll() {
		this.initFilters();
		this.initConstants();
		this.initTable();
	}

	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].package.alias);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].version.alias);
		this.packageTypeIcon = this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].package.icon;
		this.versionIcon = this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].version.icon;
	}

	initSelectedPackageType() {
		this.selectedPackageType = _.find(this.packageTypes, (packageType) => {
			return packageType.text === this.$stateParams.packageType;
		});
	}

	initFilters() {
		//		let savedFilters = this.getSavedFiltersFromUrl();
		this.reposList = _.map(this.filters.repos, (value) => {
			return {
				text: value,
				isSelected: !this.$stateParams.repos ? false : _.includes(this.$stateParams.repos.split(','), value)
			};
		});

		this.moreFiltersList = _.map(this.filters.extraFilters, (value) => {
			return {
				text: value,
				isSelected: value === 'Image Name' ? !!this.$stateParams.packageQuery : value === 'Tag' ? !!this.$stateParams.versionQuery : false,
				inputTextValue: value === 'Image Name' ? this.$stateParams.packageQuery : value === 'Tag' ? this.$stateParams.versionQuery : ''
			};
		});

		if (this.$stateParams.packageQuery || this.$stateParams.versionQuery || this.$stateParams.repos) {
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
			if (row.downloadsCount === undefined) this.calcPackageExtraData(row);
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

	showAllRepos(e, text) {
		e.stopPropagation();
		this.fullTextService.showFullTextModal(text, 'Repositories', 590);
	}

	getColumns() {
		return [{
			field: 'name',
			header: 'Name',
			width: '20%',
			headerCellTemplate: '<div style="padding-right:30px"></div>',
			cellTemplate: `<div class="name">
                                {{row.entity.name}}
                            </div>`
		}, {
			field: 'numOfRepos',
			header: 'Repositories Count',
			width: '10%',
			headerCellTemplate: '<div style="padding-right:0"></div>',
			cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                           </div>`
		}, {
			field: 'repositories',
			header: 'Repositories',
			sortable: false,
			headerCellTemplate: '<div style="padding-right:0"></div>',
			cellTemplate: require('./cellTemplates/repositories.cell.template.html'),
			width: '20%'
		}, {
			field: 'downloadsCount',
			header: 'Download Count',
			sortable: false,
			headerCellTemplate: '<div style="padding-right:0"></div>',
			cellTemplate: require('./cellTemplates/download.count.cell.template.html'),
			width: '20%'
		}, {
			field: 'versionsCount',
			header: 'Versions Count',
			sortable: false,
			headerCellTemplate: '<div style="padding-right:0"></div>',
			cellTemplate: require('./cellTemplates/versions.count.cell.template.html'),
			width: '10%'
		}, {
			field: 'lastModified',
			header: 'Last Modified',
			sortable: false,
			headerCellTemplate: '<div style="padding-right:0"></div>',
			cellTemplate: `<span jf-tooltip-on-overflow>
                            {{row.entity.lastModified ? (row.entity.lastModified | date : 'medium') : '--'}}
                       </span>`,
			width: '20%'
		}];
	}

	getSelectedRepos() {
		let selected = _.filter(this.reposList, (repo) => {
			return repo.isSelected;
		});
		if (selected.length) {
			this.selectedRepos = [{
				id: 'repo',
				comparator: this.PACKAGE_NATIVE_CONSTANTS.defaultComparator,
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
				id: this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].filters[filter.text],
				comparator: this.PACKAGE_NATIVE_CONSTANTS.defaultComparator,
				values: [filter.inputTextValue || '']
			};
		});
		this.selectedFilters = selected.length ? selected : null;
	}

	getFilteredData() {
		this.getSelectedFilters();
		let daoParams = {
			filters: this.concatAllActiveFilters(),
			packageType: this.selectedPackageType.text,
			sortBy: this.sorting.sortBy,
			order: this.sorting.order
		};

		let pkgFilter = _.find(daoParams.filters, {id: 'pkg'});
		if (pkgFilter && pkgFilter.values[0]) {
			this.$stateParams.packageQuery = pkgFilter.values[0];
		}
		else {
			this.$stateParams.packageQuery = null;
		}

		let versionFilter = _.find(daoParams.filters, {id: 'version'});
		if (versionFilter && versionFilter.values[0]) {
			this.$stateParams.versionQuery = versionFilter.values[0];
		}
		else {
			this.$stateParams.versionQuery = null;
		}


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
		this.$stateParams.packageType = this.selectedPackageType.text;
		this.refreshAll();
		//TODO: when more package types would become available - figure out how to change the view
	}

	onRepoFilterChange() {
		this.getSelectedRepos();
		this.$stateParams.repos = this.selectedRepos && this.selectedRepos[0] && this.selectedRepos[0].values ? this.selectedRepos[0].values.join(
			',') : null;
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
		this.subRouter.goto('package', {packageType: this.selectedPackageType.text, package: packageName})
	}

	calcPackageExtraData(row) {
		if (row.calculated || row.calculationPending) return;

		if (!this.getPackageExtraInfo || !(typeof this.getPackageExtraInfo === 'function')) {
			return;
		}

		let pkgName = row.name;
		let daoParams = {
			package: pkgName,
			packageType: this.selectedPackageType.text
		};
		row.calculationPending = true;
		this.getPackageExtraInfo({daoParams: daoParams}).then((response) => {
			if (response.totalDownloads !== undefined) {
				row.downloadsCount = response.totalDownloads;
			}
			else {
				row.manualOnDemendDownloadsCount = true;
			}
			row.lastModified = response.lastModified;
			row.versionsCount = response.totalVersions;
			row.calculated = true;
			row.calculationPending = false;
		});
	}

	calcPackageDownloads(e, row) {
		e.stopPropagation();
		if (!this.getPackageDownloadsCount || !(typeof this.getPackageDownloadsCount === 'function')) {
			return;
		}

		let pkgName = row.name;
		let daoParams = {
			package: pkgName,
			packageType: this.selectedPackageType.text
		};
		this.getPackageDownloadsCount({daoParams: daoParams}).then((response) => {
			row.downloadsCount = response.totalDownloads;
			delete row.manualOnDemendDownloadsCount;
		});


	}

}
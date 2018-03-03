import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class PackagesController {

	constructor(JFrogSubRouter, $state, $scope, JFrogTableViewOptions, JfFullTextService, JFrogUIUtils) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$state = $state;
		this.$scope = $scope;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.fullTextService = JfFullTextService;
		this.jFrogUIUtils = JFrogUIUtils;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
		this.sorting = {sortBy: 'name', order: 'asc'}
	}

	$onInit() {
		this.initSelectedPackageType();
		this.refreshAll();

		this.subRouter.on('params.change', (oldParams, newParams) => {
			if (oldParams.query !== newParams.query) {
				this.initFilters();
			}
		}, this.$scope)
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
		let savedFilters = this.getSavedFiltersFromUrl();
		this.reposList = _.map(this.filters.repos, (value) => {
			return {
				text: value,
				isSelected: !this.$stateParams.repos ? false : _.includes(this.$stateParams.repos.split(','), value)
			};
		});

		this.moreFiltersList = _.map(this.filters.extraFilters, (value) => {
			return {
				text: value,
				isSelected: value === 'Image Name' ? !!this.$stateParams.query : !!savedFilters.otherFilters[value],
				inputTextValue: value === 'Image Name' ? this.$stateParams.query : savedFilters.otherFilters[value] || ''
			};
		});

		if (this.$stateParams.query) {
			this.getFilteredData();
		}
	}

	initTable() {
		this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
		this.tableViewOptions
		    .setColumns(this.getColumns())
		    .showFilter(false)
		    .showCounter(false)
//		    .showHeaders(false)
		    .showPagination(false)
		    .setPaginationMode(this.tableViewOptions.VIRTUAL_SCROLL)
		    .setRowsPerPage('auto')
		    .setRowHeight(76,25)
		    .setEmptyTableText(`No ${this.packageAlias}s found. You can broaden your search by using the * wildcard`)
		    .setData(this.packages.list.data);

		this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
		this.tableViewOptions.useExternalSortCallback(this.onSortChange.bind(this));

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
			headerCellTemplate: '<div></div>',
			cellTemplate: `<div class="name">
                                {{row.entity.name}}
                            </div>`
		}, {
			field: 'numOfRepos',
			header: 'Repositories Count',
			width: '10%',
			headerCellTemplate: '<div></div>',
			cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                           </div>`
		}, {
			field: 'repositories',
			header: 'Repositories',
			sortable: false,
			headerCellTemplate: '<div></div>',
			cellTemplate: require('./cellTemplates/repositories.cell.template.html'),
			width: '20%'
		}, {
			field: 'downloadsCount',
			header: 'Download Count',
			sortable: false,
			headerCellTemplate: '<div></div>',
			cellTemplate: require('./cellTemplates/download.count.cell.template.html'),
			width: '20%'
		}, {
			field: 'versionsCount',
			header: 'Versions Count',
			headerCellTemplate: '<div></div>',
			cellTemplate: require('./cellTemplates/versions.count.cell.template.html'),
			width: '10%'
		}, {
			field: 'lastModified',
			header: 'Last Modified',
			headerCellTemplate: '<div></div>',
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
		if (this.refreshPackages && typeof this.refreshPackages === 'function') {
			let daoParams = {
				filters: this.concatAllActiveFilters(),
				packageType: this.selectedPackageType.text,
				sortBy: this.sorting.sortBy,
				order: this.sorting.order
			};
			// TODO: Continue development of filters saving mechanism
			//daoParams.f = this.encodeJSONToBase64String(daoParams.filters);
			//this.saveFiltersInURL(daoParams.f);

			let pkgFilter = _.find(daoParams.filters, {id: 'pkg'});
			if (pkgFilter && pkgFilter.values[0]) {
				this.$stateParams.query = pkgFilter.values[0];
			}

			this.refreshPackages({daoParams: daoParams}).then(() => {
				this.tableViewOptions.setData(this.packages.list.data);
				this.hasSelectedFilters = daoParams.filters.length > 0;
			});
		}
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
		this.$stateParams.repos = this.selectedRepos && this.selectedRepos[0] && this.selectedRepos[0].values ? this.selectedRepos[0].values.join(',') : null;
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

	//TODO: Export these methods to jfUiUtils after dev is finished
	encodeJSONToBase64String(jsonObject) {
		let jsonSting = JSON.stringify(jsonObject);
		return btoa(jsonSting);
	}

	decodeJSONFromBase64String(encodedJsonSting) {
		if (!encodedJsonSting) {
			return [];
		}
		let jsonString = atob(encodedJsonSting);
		return JSON.parse(jsonString);
	}

	getSavedFiltersFromJson(savedFiltersJson) {
		let repos = [];
		let otherFilters = [];
		let selectedRepoTypeFilters = this.PACKAGE_NATIVE_CONSTANTS[this.selectedPackageType.text].filters;
		_.forEach(savedFiltersJson, (savedFilter) => {
			if (savedFilter.id === 'repo') {
				repos = savedFilter.values;
			} else {
				let savedFilterName = _.findKey(selectedRepoTypeFilters, (v) => {
					return v === savedFilter.id;
				});
				otherFilters[savedFilterName] = savedFilter.values[0];
			}
		});
		return {repos: repos, otherFilters: otherFilters};
	}

	saveFiltersInURL(base64String) {
//		this.$location.search({f: base64String});
	}

	getSavedFiltersFromUrl() {
		return this.getSavedFiltersFromJson(this.decodeJSONFromBase64String(this.$stateParams.f));
	}

	calcPackageDownloads(e, row) {
		e.stopPropagation();
		if (!this.getPackageDownloadsCount || !typeof this.getPackageDownloadsCount === 'function') {
			return;
		}

		let pkgName = row.name;
		let daoParams = {
			package: pkgName,
			packageType: this.selectedPackageType.text
		};
		this.getPackageDownloadsCount({daoParams: daoParams}).then((response) => {
			row.downloadsCount = response.totalDownloads;
			row.calculated = true;
		});
	}

}
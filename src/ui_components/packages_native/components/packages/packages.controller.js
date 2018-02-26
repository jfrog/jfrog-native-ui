import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class PackagesController {

	constructor($state, $stateParams, $scope, JFrogTableViewOptions, JfFullTextService, JFrogUIUtils, JFrogEventBus
		, $location) {
		this.$state = $state;
		this.$scope = $scope;
		this.$stateParams = $stateParams;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.fullTextService = JfFullTextService;
		this.jFrogUIUtils = JFrogUIUtils;
		this.JFrogEventBus = JFrogEventBus;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
		this.$location = $location;
	}

	$onInit() {
		this.initSelectedPackageType();
		this.refreshAll();
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
				isSelected: !!savedFilters.repos[value]
			};
		});

		this.moreFiltersList = _.map(this.filters.extraFilters, (value) => {
			return {
				text: value,
				isSelected: !!savedFilters.otherFilters[value],
				inputTextValue: savedFilters.otherFilters[value] || ''
			};
		});
	}

	initTable() {
		this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
		this.tableViewOptions
		    .setColumns(this.getColumns())
		    .showFilter(false)
		    .showCounter(false)
		    .showHeaders(false)
		    .showPagination(false)
		    .setPaginationMode(this.tableViewOptions.VIRTUAL_SCROLL)
		    .setRowsPerPage('auto')
		    .setRowHeight(76)
		    .setEmptyTableText(`No ${this.packageAlias}s found. You can broaden your search by using the * wildcard`)
		    .sortBy(null)
		    .setData(this.packages.list.data);

		this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
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
			cellTemplate: `<div class="name">
                                {{row.entity.name}}
                            </div>`
		}, {
			field: 'numOfRepos',
			header: 'Repositories Count',
			width: '10%',
			cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                           </div>`
		}, {
			field: 'repositories',
			header: 'Repositories',
			cellTemplate: require('./cellTemplates/repositories.cell.template.html'),
			width: '20%'
		}, {
			field: 'downloadsCount',
			header: 'Download Count',
			cellTemplate: require('./cellTemplates/download.count.cell.template.html'),
			width: '20%'
		}, {
			field: 'versionsCount',
			header: 'Versions Count',
			cellTemplate: require('./cellTemplates/versions.count.cell.template.html'),
			width: '10%'
		}, {
			field: 'lastModified',
			header: 'Last Modified',
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
				packageType: this.selectedPackageType.text
			};
			// TODO: Continue development of filters saving mechanism
			//daoParams.f = this.encodeJSONToBase64String(daoParams.filters);
			//this.saveFiltersInURL(daoParams.f);

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
		this.refreshAll();
		//TODO: when more package types would become available - figure out how to change the view
		//this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER, {
		//	packageType: this.selectedPackageType
		//});
	}

	onRepoFilterChange() {
		this.getSelectedRepos();
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
		this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER,
			{packageType: this.selectedPackageType.text, package: packageName});
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
		this.$location.search({f: base64String});
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
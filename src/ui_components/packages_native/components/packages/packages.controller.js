import {PACKAGE_NATIVE_CONSTANTS} from '../../../../constants/package.native.constants';

export default class PackagesController {

	constructor($state, $stateParams, $scope, JFrogTableViewOptions, JfFullTextService, JFrogUIUtils, JFrogEventBus) {
		this.$state = $state;
		this.$scope = $scope;
		this.$stateParams = $stateParams;
		this.JFrogTableViewOptions = JFrogTableViewOptions;
		this.fullTextService = JfFullTextService;
		this.jFrogUIUtils = JFrogUIUtils;
		this.JFrogEventBus = JFrogEventBus;
		this.PACKAGE_NATIVE_CONSTANTS = PACKAGE_NATIVE_CONSTANTS;
	}

	$onInit() {
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

	initFilters() {
		this.selectedPackageType = _.find(this.packageTypes, (packageType) => {
			return packageType.text === this.$stateParams.packageType;
		});

		this.reposList = _.map(this.filters.repos, (value) => {
			return {
				text: value,
				isSelected: false
			};
		});

		this.moreFiltersList = _.map(this.filters.extraFilters, (value) => {
			return {
				text: value,
				isSelected: false
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
		    .setRowsPerPage(900000000) // Temporary workaround inorder to use native (non virtual) scrolling, until full support for smooth virtual scrolling will be completed.
		    .setRowHeight(66)
		    .setEmptyTableText(`No ${this.packageAlias}s`)
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
		this.fullTextService.showFullTextModal(text, 'Repositories');
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
			field: 'repositories',
			header: 'Repositories',
			cellTemplate: require('./cellTemplates/repositories.cell.template.html'),
			width: '20%'
		}, {
			field: 'description',
			header: 'Description',
			cellTemplate: `<div class="description">
                                {{row.entity.description}}
                            </div>`,
			width: '35%'
		}, {
			field: 'downloadsCount',
			header: 'Download Count',
			cellTemplate: require('./cellTemplates/download.count.cell.template.html'),
			width: '15%'
		}, {
			field: 'versionsCount',
			header: 'Versions Count',
			cellTemplate: require('./cellTemplates/versions.count.cell.template.html'),
			width: '10%'
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
			return filter.isSelected && !filter.isAllToggleCheckbox;
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
			let filters = [];
			filters = (this.selectedFilters ? filters.concat(this.selectedFilters) : filters);
			filters = (this.selectedRepos ? filters.concat(this.selectedRepos) : filters);
			let daoParams = {
				filters: filters,
				packageType: this.selectedPackageType.text
			};
			this.refreshPackages({daoParams: daoParams}).then(()=>{
				this.tableViewOptions.setData(this.packages.list.data);
			})
		}
	}

	isAnyRepoSelected() {
		return this.selectedRepos &&
			this.selectedRepos.length;
	}

	isExtraFilterSelected() {
		return this.selectedFilters &&
			this.selectedFilters.length;
	}

	isValidFilterForm() {
		//return ( this.isAnyRepoSelected() && !this.isExtraFilterSelected()) ||
		//	(this.isExtraFilterSelected());
		return true;
	}

	onPackageTypeChange() {
		// Fire a refresh callback for getting packages and filters
		this.refreshAll();
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
                    <span>${$item.text}</span>
                </div>`;
	}

	goToPackage(packageName) {
		this.JFrogEventBus.dispatch(this.JFrogEventBus.getEventsDefinition().NATIVE_PACKAGES_ENTER,
			{packageType: this.selectedPackageType.text, package: packageName});
	}

}
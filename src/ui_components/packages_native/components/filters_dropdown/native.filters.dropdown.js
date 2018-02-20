export default class NativeFiltersDropdown {
	constructor() {
		this.template = require('./native.filters.dropdown.view.html');
		this.controller = NativeFiltersDropdownController;
		this.bindings = {
			title: '@',
			label: '@',
			filterPlaceholder: '@',
			repos: '=',
			extraFilters: '=',
			disabled: '=?',
			onChange: '&?',
			noSort: '=?',
			onOpenStateChange: '&?',
			dropdownOpened: '=',
			showSelected: '@',
			noSelectedFirst: '=?',
			borderless: '<?',
			onSearchSubmit: '&?'
		};
	}
}


class NativeFiltersDropdownController {
	constructor($scope, $filter, $element) {
		this.$scope = $scope;
		this.$element = $element;

		this.filter = $filter('filter');
		this.opened = false;

		this.handleOutsideClick();

		this.$scope.$watch('NativeFiltersDropdown.repos', (newVal, oldVal) => {
			if (newVal) {
				this.sortItems();
			}
		});

		this.$scope.$watch('NativeFiltersDropdown.dropdownOpened', (val) => {
			if (val === true) {
				if (!this.repos) {
					return;
				}
				this.opened = true;
				this.filterText = '';
			}
			else if (val === false) {
				this.opened = false;
				this.filterText = '';
			}
		});
	}

	sendOpenStateChange() {
		if (this.onOpenStateChange) {
			this.onOpenStateChange({opened: this.opened});
		}
	}

	handleOutsideClick() {
		let handler = (e) => {
			let outside = !$(e.target).parents('.native-filters-dropdown').length || $(e.target).parents(
				'.native-filters-dropdown')[0] !== $(this.$element).find('.native-filters-dropdown')[0];
			if (outside) {
				this.opened = false;
				this.sendOpenStateChange();
				this.sortItems();
			}
			this.$scope.$apply();
		};
		$(document).on('click', handler);
		this.$scope.$on('$destroy', () => {
			$(document).off('click', handler);
		});
	}

	getSelectedForTitle() {
		let selected = this.selectedItems();
		if (!selected || !selected.length) {
			return this.title;
		}
		return selected.join('; ');
	}

	onClick() {
		if (this.disabled !== true) {
			if (!this.repos) {
				return;
			}
			this.opened = !this.opened;
			this.sendOpenStateChange();
			if (!this.opened) {
				this.sortItems();
			}
			this.filterText = '';
		}
	}

	applyChanges() {
		if (this.onChange) {
			this.onChange();
		}
	}

	selectedItems() {
		let selected = _.filter(this.extraFilters, (filter) => filter.inputTextValue)
		                .concat(_.filter(this.repos, (repo) => repo.isSelected))
		                .map(s => s.inputTextValue || s.text);
		return selected;
	}

	sortItems() {
		if (this.noSelectedFirst) {
			return;
		}
		if (!this.repos) {
			return;
		}
		let selected = this.noSort ? _.filter(this.repos, (repo) => repo.isSelected) : _.sortBy(
			_.filter(this.repos, (item) => item.isSelected), 'text');
		let unSelected = this.noSort ? _.filter(this.repos, (repo) => !repo.isSelected) : _.sortBy(
			_.filter(this.repos, (repo) => !repo.isSelected), 'text');
		this.lastSelectedIndex = selected.length - 1;
		let combined = selected.concat(unSelected);
		this.repos.splice.apply(this.repos, [0, this.repos.length].concat(combined));
	}

	selectAll() {
		this.filter(this.repos, this.filterText).forEach((repo) => {
			if (!repo.disabled) {
				repo.isSelected = true;
			}
		});
		this.applyChanges();
	}

	unSelectAll() {
		this.filter(this.repos, this.filterText).forEach((repo) => {
			if (!repo.disabled) {
				repo.isSelected = false;
			}
		});
		this.applyChanges();
	}

	onSelection() {
		this.applyChanges();
	}

	clearSelection() {
		if (this.extraFilters) {
			_.forEach(this.extraFilters, (filter) => {
				filter.inputTextValue = '';
			});
		}
		this.unSelectAll();
	}

	onSubmit() {
		this.opened = false;
		this.onSearchSubmit();
	}

	onKeyPress(e) {
		if (e.key === 'Enter' || e.keyCode === 13) {
			this.onSubmit();
		}
	}

	isMainFilterDisabled () {
		let selected = this.selectedItems();
		return ((selected.length > 1 && this.extraFilters[0].inputTextValue) ||
			(selected.length > 0 && !this.extraFilters[0].inputTextValue));
	}
}

export default class VersionController {

	constructor(JFrogSubRouter, $scope, JFrogUIUtils, NativeUIDescriptor, JfFullTextService) {
        this.fullTextService = JfFullTextService;
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.jFrogUIUtils = JFrogUIUtils;
        this.descriptor = NativeUIDescriptor.getDescriptor();

        this.widgetsOptions = {
            outerPadding: 0,
	        padding: 15,
            expandablePanes: true,
	        sharedModel: {
            	versionCtrl: this
	        }
        };

    }


	initConstants() {
		this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.package
		);
		this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
			this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.version
		);
		this.packageTypeIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.package;
		this.versionIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.version;
	}

	$onInit() {
        this.getSummaryData();
		this.getVersionData(this.$stateParams).then(() => {
			this.initConstants();
            this.nativeParent.hostData.isXrayEnabled().then((response) => {
                this.withXray = response;
            });
            this.summaryColumns = this.getSummaryColumns();

			this.subRouter.listenForChanges(['packageType', 'package', 'version'], 'version', () => {
                this.getSummaryData();
				this.getVersionData(this.$stateParams);
			}, this.$scope);

		})
	}

	getVersionData(daoParams) {
		return this.nativeParent.hostData.getVersion(daoParams).then((version) => {
			this.version = this.descriptor.typeSpecific[daoParams.packageType].transformers.version(version);
		}).catch((data) => {
            delete this.version;
		})
	}

    getSummaryData() {
        this.nativeParent.hostData.getVersionSummary(this.$stateParams).then(summaryData => {
            this.summaryData = summaryData;
        }).catch(() => {
            this.summaryData = {}
        })
    }


    goBack() {
		this.subRouter.goto('package', {
			packageType: this.$stateParams.packageType,
			package: this.$stateParams.package
		})
	}

	getSummaryColumns() {
        return _.map(this.descriptor.typeSpecific[this.$stateParams.packageType].versionSummaryColumns, column => {
            let columnObj;
            if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.versionSummaryColumns[column] || this.descriptor.common.packageSummaryColumns[column]);

            }
            else columnObj = column;

            if (columnObj.label && columnObj.label.indexOf('@{PACKAGE_ALIAS}') !== -1) {
                columnObj.label = columnObj.label.replace('@{PACKAGE_ALIAS}', this.packageAlias);
            }
            if (columnObj.label && columnObj.label.indexOf('@{VERSION_ALIAS}') !== -1) {
                columnObj.label = columnObj.label.replace('@{VERSION_ALIAS}', this.versionAlias);
            }

            return columnObj;

        });
    }

    //This is currently duplicated from package level, should be moved to common place, if unchanged, to keep d.r.y
    filterByKeyword(keyword) {
        let keywordsId = this.descriptor.typeSpecific[this.$stateParams.packageType].filters.keywords;
        if (keywordsId) {
            this.$stateParams.package = null;
            this.$stateParams.version = null;
            this.$stateParams.repo = null;
            this.$stateParams.query = {[keywordsId]: keyword};
        }
    }

    //This is currently duplicated from package level, should be moved to common place, if unchanged, to keep d.r.y
    showAll(e, text, title, asList = false, itemClickCB = null) {
        e.stopPropagation();
        this.fullTextService.showFullTextModal(text, title, 590, asList, itemClickCB);
    }

}
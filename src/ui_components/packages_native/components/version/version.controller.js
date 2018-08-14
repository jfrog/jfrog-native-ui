export default class VersionController {

	constructor(JFrogSubRouter, $scope, $q, JFrogUIUtils, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.$q = $q;
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

    $onInit() {
        this.nativeParent.stateController = this;

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

	getVersionData(daoParams) {
        if (this.$stateParams.packageType === 'docker') {
            return this.nativeParent.hostData.getVersion(daoParams).then((version) => {
                this.version = this.descriptor.typeSpecific[daoParams.packageType].transformers.version(version);
            })
        }
        else return this.$q.when();
	}

    getSummaryData() {
	    if (this.$stateParams.packageType !== 'docker') {
            this.nativeParent.hostData.getVersionSummary(this.$stateParams).then(summaryData => {
                this.summaryData = summaryData;
                this.nativeParent.hostData.getVersionSummaryExtraInfo(_.extend({},this.$stateParams,{path: summaryData.latestPath})).then(summaryExtraData => {
                    _.extend(this.summaryData, summaryExtraData);
                })
            })
        }
        else {
            this.summaryData = {}
            return this.$q.when();
        }
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
}
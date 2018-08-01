export default class VersionController {

	constructor(JFrogSubRouter, $scope, JFrogUIUtils, ModelFactory, NativeUIDescriptor) {
		this.subRouter = JFrogSubRouter.getActiveRouter();
		this.$stateParams = this.subRouter.params;
		this.$scope = $scope;
		this.ModelFactory = ModelFactory;
		this.jFrogUIUtils = JFrogUIUtils;
        this.descriptor = NativeUIDescriptor.getDescriptor();

        this.widgetsOptions = {
            outerPadding: 0,
	        padding: 15,
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
		this.getVersionData(this.$stateParams).then(() => {
			this.initConstants();
			if (this.isWithXray && typeof this.isWithXray === 'function') {
				this.isWithXray().then((response) => {
					this.withXray = response;
					this.summaryColumns = this.getSummaryColumns();
				});
			} else {
				this.summaryColumns = this.getSummaryColumns();
			}

			this.subRouter.listenForChanges(['package', 'version'], 'version', () => {
				this.getVersionData(this.$stateParams);
			}, this.$scope);

		})
	}

	getVersionData(daoParams) {
		return this.getVersion({daoParams: daoParams}).then((version) => {
			this.version = this.ModelFactory.getVersionModel(daoParams.packageType, version);
		}).catch(() => {
			delete this.version;
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
                columnObj = _.cloneDeep(this.descriptor.common.versionSummaryColumns[column]);
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
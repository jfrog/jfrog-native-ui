export default class PropertiesWidgetController {
    constructor(JFrogTableViewOptions) {
        this.JFrogTableViewOptions = JFrogTableViewOptions;
    }

    $onInit() {
        this.hostData = this.$scope.versionCtrl.nativeParent.hostData;
        this.subRouter = this.$scope.versionCtrl.subRouter;
        this.createTable();
        this.getProperties();
    }

    createTable() {
        this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
        this.tableViewOptions.setColumns(this.getColumns())
            .setObjectName('property/properties')
    }

    getColumns() {
        return [
            {
                header: 'Key name',
                field: 'propKey'
            },
            {
                header: 'Value',
                field: 'propVal'
            },
        ]

    }

    getProperties() {
        this.hostData.getVersionData({dataType: 'props', path: this.subRouter.params.versionPath}).then(properties => {
            properties = _.map(Object.keys(properties.props), prop => {
                let value = properties.props[prop];
                return {propKey: prop, propVal: value};
            });
            this.tableViewOptions.setData(properties);
        })
    }
}
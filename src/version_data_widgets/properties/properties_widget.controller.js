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
            .showPagination(false)
            .setObjectName('property/properties')
    }

    getColumns() {
        return [
            {
                header: 'Key name',
                field: 'key'
            },
            {
                header: 'Values',
                field: 'values',
                cellTemplate:`<div>{{row.entity.values.join (',')}}</div>`
            },
        ]

    }

    getProperties() {
        this.hostData.getVersionData({dataType: 'props', path: this.subRouter.params.versionPath}).then(response => {
            this.tableViewOptions.setData(response.properties);
        })
    }
}
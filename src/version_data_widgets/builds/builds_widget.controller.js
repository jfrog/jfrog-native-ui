export default class BuildsWidgetController {
    constructor(JFrogTableViewOptions, $state) {
        this.$state = $state;
        this.JFrogTableViewOptions = JFrogTableViewOptions;
    }

    $onInit() {
        this.hostData = this.$scope.versionCtrl.nativeParent.hostData;
        this.subRouter = this.$scope.versionCtrl.subRouter;
        this.createTable();
        this.getBuilds();
    }

    createTable() {
        this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
        this.tableViewOptions.setColumns(this.getColumns())
            .setActions(this.getActions())
            .showPagination(false)
            .setObjectName('build')
    }

    getColumns() {
        return [
            {
                header: 'Build Name',
                field: 'name'
            },
            {
                header: 'Build Number',
                field: 'number'
            },
            {
                header: 'Creation Date',
                field: 'createDate',
                cellTemplate: `<div>{{row.entity.createDate | date : 'medium'}}</div>`
            },
        ]

    }

    getActions() {
        return [
            {
                icon: 'icon icon-arrow',
                tooltip: 'Go to build',
                callback: (row) => this.$state.go('builds.build_page', {buildName:row.name,buildNumber:row.number,tab:null})
            }
        ]
    }

    getBuilds() {
        this.hostData.getVersionData({dataType: 'builds', path: this.subRouter.params.versionPath}).then(response => {
            this.tableViewOptions.setData(response.results);
        })
    }
}
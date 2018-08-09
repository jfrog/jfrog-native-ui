export default class DependenciesWidgetController {
    constructor() {
    }

    $onInit() {
        this.hostData = this.$scope.versionCtrl.nativeParent.hostData;
        this.subRouter = this.$scope.versionCtrl.subRouter;
        this.getDependencies();
    }

    getDependencies() {
        this.hostData.getVersionData({dataType: 'dependencies', path: this.subRouter.params.versionPath}).then(response => {
            this.data = {
                dependencies: _.map(response.dependencies, 'name'),
                devDependencies: _.map(response.devDependencies, 'name'),
            };
        })
    }
}
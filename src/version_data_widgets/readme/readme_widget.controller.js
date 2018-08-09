export default class ReadmeWidgetController {
    constructor() {
    }

    $onInit() {
        this.hostData = this.$scope.versionCtrl.nativeParent.hostData;
        this.subRouter = this.$scope.versionCtrl.subRouter;
        this.getReadme();
    }

    getReadme() {
        this.hostData.getVersionData({dataType: 'readme', path: this.subRouter.params.versionPath}).then(response => {
            this.readme = response.readme;
        })
    }
}
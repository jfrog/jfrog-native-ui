export default class DockerLayersWidgetController {
    constructor($animate) {
    	this.$animate = $animate;
    }

    $onInit() {
    	this.$animate.enabled(this.$element, true);
    }

}
import KEY_DICTIONARY from './details_key_dictionary.js';

class jfDockerV2LayersController {
    constructor($scope, $attrs) {
        this.KEY_DICTIONARY = KEY_DICTIONARY;

        this.selectedLayer = null;
        this.layerDirectives = [];

        this.controller.layersController = this;
    }

    setSelected(layer) {
        if (this.selectedLayer && this.selectedLayer !== layer)
            this.selectedLayer.setSelected(false);
        this.selectedLayer = layer;
    }

    refreshView() {
        if (this.layerDirectives.length)
            this.layerDirectives[0].setSelected(true);

        $('#jf-artifacts .main-view').animate({ scrollTop: "0" }, 400);
    }
}

export function jfDockerV2Layers() {
    return {
        restrict: 'E',
        scope: {
            controller: '=',
            data: '=',
            currentPath: '@'
        },
        controller: jfDockerV2LayersController,
        controllerAs: 'jfDockerV2Layers',
        templateUrl: 'directives/jf_docker_v2_layers/jf_docker_v2_layers.html',
        bindToController: true
    };
}

import {jfDockerV2Layer} from "./jf_docker_v2_layer/jf_docker_v2_layer";
import {jfDockerV2Layers} from "./jf_docker_v2_layers/jf_docker_v2_layers";

angular.module('directives', [])
    .directive({
	    'jfDockerV2Layer': jfDockerV2Layer,
	    'jfDockerV2Layers': jfDockerV2Layers,
    });

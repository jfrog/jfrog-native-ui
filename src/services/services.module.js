import DockerImageListModel from './models/DockerImageListModel';
import DockerImageModel from './models/DockerImageModel';
import DockerImageListFiltersModel from './models/DockerImageListFiltersModel';
import DockerLayerModel from './models/DockerLayerModel';
import DockerTagModel from './models/DockerTagModel';
import DockerTagInfoModel from './models/DockerTagInfoModel';

angular.module('services', [])
       .factory('DockerImageModel', DockerImageModel)
       .factory('DockerImageListModel', DockerImageListModel)
       .factory('DockerImageListFiltersModel', DockerImageListFiltersModel)
       .factory('DockerTagInfoModel', DockerTagInfoModel)
       .factory('DockerTagModel', DockerTagModel)
       .factory('DockerLayerModel', DockerLayerModel);
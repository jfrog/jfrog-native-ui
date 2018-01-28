import BaseModel from './models/BaseModel';
import DockerImageListModel from './models/DockerImageListModel';
//import PackageBaseModel from './models/PackageBaseModel';
import DockerImageModel from './models/DockerImageModel';
//import VersionBaseModel from './models/VersionBaseModel';
//import PackageListFiltersModel from './models/PackageListFiltersModel';
import DockerLayerModel from './models/DockerLayerModel';
import DockerTagModel from './models/DockerTagModel';

angular.module('services', [])
       .factory('DockerImageModel', DockerImageModel)
       .factory('DockerImageListModel', DockerImageListModel)
       .factory('DockerTagModel', DockerTagModel)
       .factory('DockerLayerModel', DockerLayerModel);
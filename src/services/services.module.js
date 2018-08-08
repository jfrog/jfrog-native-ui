import HostDaoParamFormatter from './HostDaoParamFormatter';
import NativeUIDescriptor from './native_ui_descriptor/NativeUIDescriptor';
import CommonDescriptor from './native_ui_descriptor/CommonDescriptor';
import DockerDescriptor from './native_ui_descriptor/DockerDescriptor';
import NpmDescriptor from './native_ui_descriptor/NpmDescriptor';

angular.module('services', [])
       .service('HostDaoParamFormatter', HostDaoParamFormatter)
       .service('NativeUIDescriptor', NativeUIDescriptor)
       .service('CommonDescriptor', CommonDescriptor)
       .service('DockerDescriptor', DockerDescriptor)
       .service('NpmDescriptor', NpmDescriptor)
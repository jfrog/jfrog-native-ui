import ModelFactory from './models/ModelFactory';
import NativeUIDescriptor from './native_ui_descriptor/NativeUIDescriptor';

angular.module('services', [])
       .service('ModelFactory', ModelFactory)
       .service('NativeUIDescriptor', NativeUIDescriptor)
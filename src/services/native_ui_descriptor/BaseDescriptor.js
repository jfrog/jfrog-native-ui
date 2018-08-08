export default class BaseDescriptor {
    constructor() {
    }

    getDescriptor() {
        return this.descriptor;
    }

    getRootDescriptor() {
        let rootDescriptor = angular.element(document.body).injector().get('NativeUIDescriptor');
        return rootDescriptor.getDescriptor();
    }
}
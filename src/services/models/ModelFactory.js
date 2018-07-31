import {MODELS} from './models.list';

export default class ModelFactory {
	constructor(NativeUIDescriptor) {
        this.descriptor = NativeUIDescriptor.getDescriptor();
		this.MODELS = MODELS;
	}

	getPackageListModel(packageType, data) {
		return new this.MODELS[packageType].packages(data);
	}

	getPackageModel(packageType, data) {
		return new this.MODELS[packageType].package(data);
	}

	getVersionModel(packageType, data) {
		return new this.MODELS[packageType].version(data);
	}

	getFiltersModel(packageType, data) {
		return new this.MODELS.common.filters(data, packageType, this.descriptor);
	}
}
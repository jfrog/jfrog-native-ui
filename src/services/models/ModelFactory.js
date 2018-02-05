import {MODELS} from './models.list';

export default class ModelFactory {
	constructor() {
		this.MODELS = MODELS;
	}

	getPackageListMedel(packageType, data) {
		return new this.MODELS[packageType].packages(data);
	}

	getPackageMedel(packageType, data) {
		return new this.MODELS[packageType].package(data);
	}

	getVersionMedel(packageType, data) {
		return new this.MODELS[packageType].version(data);
	}

	getFiltersMedel(packageType, data) {
		return new this.MODELS[packageType].filters(data);
	}
}
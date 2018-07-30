import DockerImageListModel from '../../models/DockerImageListModel';
import DockerImageModel from '../../models/DockerImageModel';
import NpmImageListModel from '../../models/NpmImageListModel';
import NpmImageModel from '../../models/NpmImageModel';
import DockerTagModel from '../../models/DockerTagModel';
import PackageListFiltersModel from '../../models/PackageListFiltersModel';

export const MODELS = {
	common: {
		filters: PackageListFiltersModel
	},
	docker: {
		packages: DockerImageListModel,
		package: DockerImageModel,
		version: DockerTagModel,
	},
	npm: {
		packages: NpmImageListModel,
		package: NpmImageModel,
		version: DockerTagModel,
	}
};
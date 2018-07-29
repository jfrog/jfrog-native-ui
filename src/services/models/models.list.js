import DockerImageListModel from '../../models/DockerImageListModel';
import DockerImageModel from '../../models/DockerImageModel';
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
		packages: DockerImageListModel,
		package: DockerImageModel,
		version: DockerTagModel,
	}
};
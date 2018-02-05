import DockerImageListModel from '../../models/DockerImageListModel';
import DockerImageModel from '../../models/DockerImageModel';
import DockerTagModel from '../../models/DockerTagModel';
import DockerImageListFiltersModel from '../../models/DockerImageListFiltersModel';

export const MODELS = {
	docker: {
		packages: DockerImageListModel,
		package: DockerImageModel,
		version: DockerTagModel,
		filters: DockerImageListFiltersModel
	}
};
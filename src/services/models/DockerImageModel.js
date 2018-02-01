/**
 * Created by tomere on 14/01/2018.
 */
import PackageBaseModel from './PackageBaseModel';

export default function DockerImageModel(DockerTagModel) {
	return class DockerImageModel extends PackageBaseModel {
		constructor(data) {
			super(data);
			this.name = data.name || data.packageName;
			this.repositories = data.repositories;
			this.description = data.description;
			this.downloadsCount = data.totalDownloads;
			this.versionsCount = data.totalVersions;
			this.lastModified = data.lastModified;

			if(data.versions){
				this.versions = data.versions.map((version) => {
					return new DockerTagModel(version);
				});
			}
		}
	}

}
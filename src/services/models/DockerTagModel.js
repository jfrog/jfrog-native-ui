/**
 * Created by tomere on 16/01/2018.
 */
import VersionBaseModel from './VersionBaseModel';

export default function DockerTagModel(DockerLayerModel) {
	return class DockerTagModel extends VersionBaseModel {
		constructor(data) {
			super(data);
			this.name = data.name;
			this.packageName = data.packageName;
			this.repo = data.repoKey;
			this.lastModified = data.lastModified;
			this.size = data.size;
			this.xray = data.xray;
			this.security = data.security;
			this.labels = data.labels;

			if (data.layers && data.layers.length) {
				this.layers = data.layers.map((layer) => {
					return new DockerLayerModel(layer);
				});
			}
		}
	};
}
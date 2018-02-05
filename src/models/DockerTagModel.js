/**
 * Created by tomere on 16/01/2018.
 */
import DockerLayerModel from './DockerLayerModel';
import DockerTagInfoModel from './DockerTagInfoModel';

export default class DockerTagModel extends DockerTagInfoModel {
	constructor(data) {
		super(data);
		this.security = data.security;
		this.labels = data.labels;
		this.repo = data.repoKey;

		if (data.blobsInfo && data.blobsInfo.length) {
			this.layers = data.blobsInfo.map((layer) => {
				return new DockerLayerModel(layer);
			});
		}
	}
}
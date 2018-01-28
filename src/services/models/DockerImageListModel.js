/**
 * Created by tomere on 14/01/2018.
 */
import BaseModel from './BaseModel';

export default function DockerImageListModel(DockerImageModel) {
	return class DockerImageListModel extends BaseModel {
		constructor(data) {
			super(data);
			if (data.results && data.results.length) {
				this.data = data.results.map((image) => {
					return new DockerImageModel(image);
				});
			}
			this.packageCount = data.resultsCount;
		}
	}
}
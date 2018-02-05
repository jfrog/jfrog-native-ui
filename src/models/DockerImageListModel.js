/**
 * Created by tomere on 14/01/2018.
 */
import BaseModel from './BaseModel';
import DockerImageModel from './DockerImageModel';

export default class DockerImageListModel extends BaseModel {
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
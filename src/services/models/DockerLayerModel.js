/**
 * Created by tomere on 16/01/2018.
 */
import BaseModel from './BaseModel';

export default function DockerLayerModel() {
	return class DockerLayerModel extends BaseModel {
		constructor(data) {
			super(data);
			this.id = data.id;
			this.shortId = data.shortId;
			this.digest = data.digest;
			this.size = data.size;
			this.created = data.created;
			this.command = data.command;
			this.commandText = data.commandText;
		}
	};
}
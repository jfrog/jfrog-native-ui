/**
 * Created by tomere on 16/01/2018.
 */
import VersionBaseModel from './VersionBaseModel';

export default function DockerTagInfoModel() {
	return class DockerTagInfoModel extends VersionBaseModel {
		constructor(data) {
			super(data);
			this.name = data.name;
			this.packageName = data.packageName;
			this.packageId = data.packageId;
			this.lastModified = data.lastModified;
			this.size = data.size;
			this.xray = data.xray;
		}
	};
}
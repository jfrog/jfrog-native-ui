/**
 * Created by tomere on 30/01/2018.
 */
import PackageListFiltersModel from './PackageListFiltersModel';
import {PACKAGE_NATIVE_CONSTANTS} from '../../constants/package.native.constants';

export default function DockerImageListFiltersModel() {
	return class DockerImageListFiltersModel extends PackageListFiltersModel {
		constructor(data) {
			super(data);
			this.extraFilters = Object.keys(PACKAGE_NATIVE_CONSTANTS.docker.filters);
		}
	};
}
import {PACKAGE_NATIVE_CONSTANTS} from '../constants/package.native.constants';

/**
 * Created by tomere on 14/01/2018.
 */
import BaseModel from "./BaseModel";

export default class PackageListFiltersModel extends BaseModel {
    constructor(data, packageType) {
        super(data);
        this.repos = data.results;
        this.reposCount = data.resultsCount;
        this.extraFilters = Object.keys(PACKAGE_NATIVE_CONSTANTS.typeSpecific[packageType].filters);
    }
}
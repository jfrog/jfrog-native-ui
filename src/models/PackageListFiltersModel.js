/**
 * Created by tomere on 14/01/2018.
 */
import BaseModel from "./BaseModel";

export default class PackageListFiltersModel extends BaseModel {
    constructor(data, packageType, descriptor) {
        super(data);
        this.repos = data.results;
        this.reposCount = data.resultsCount;
        this.extraFilters = descriptor.typeSpecific[packageType].filters;
    }
}
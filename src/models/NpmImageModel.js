/**
 * Created by tomere on 14/01/2018.
 */
import PackageBaseModel from './PackageBaseModel';

export default class NpmImageModel extends PackageBaseModel {
    constructor(data) {
        super(data);
        this.name = data.name || data.packageName;
        this.repositories = data.repositories;
        this.numOfRepos = data.numOfRepos;
        this.downloadsCount = data.totalDownloads;
        this.versionsCount = data.numOfVersions;
        this.lastModified = data.lastModified;
        this.keywords = data.keywords;
    }

}
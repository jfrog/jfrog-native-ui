import BaseDescriptor from './BaseDescriptor';

export default class DockerDescriptor extends BaseDescriptor{
    constructor() {
        super()
        this.init();
    }

    init() {
        this.descriptor = {
            transformers: {
                packages: data => {
                    let result = {};
                    if (data.results && data.results.length) {
                        result.data = data.results.map((image) => {
                            if (image.lastModified === 0) delete image.lastModified;
                            return this.descriptor.transformers.package(image);
                        });
                    }
                    result.itemsCount = data.resultsCount;
                    return result;
                },
                package: data => {
                    let result = {};
                    result.name = data.name || data.packageName;
                    result.repositories = data.repositories;
                    result.numOfRepos = data.numOfRepos;
                    result.downloadsCount = data.totalDownloads;
                    result.versionsCount = data.totalVersions;
                    result.lastModified = data.lastModified;
                    if (data.versions) {
                        result.versions = data.versions.map((version) => {
                            return this.descriptor.transformers.version(version);
                        });
                    }
                    return result;
                },
                version: data => {
                    let result = {};
                    result.name = data.name;
                    result.packageName = data.packageName;
                    result.packageId = data.packageId;
                    result.lastModified = data.lastModified;
                    result.size = data.size;
                    result.xray = data.xray;

                    result.security = data.security;
                    result.labels = data.labels;
                    result.repo = data.repoKey;
                    result.downloadsCount = data.totalDownloads;

                    result.layers = data.blobsInfo;

                    return result;
                }
            },

            aliases: {
                package: 'image',
                version: 'tag'
            },
            icons: {
                packages: 'icon-navigation-products',
                package: 'repotype iconrepo iconrepo-docker',
                version: 'icon-docker-tags'
            },
            filters: {
                package: 'pkg',
                version: 'version',
/*
                checksum: 'checksum',
*/
            },
            filtersLabels: {
                pkg: 'Image Name',
                version: 'Tag',
/*
                checksum: 'Checksum',
*/
            },
            installPrefix: 'docker pull',
            packagesTableColumns: [
                'name',
                'repositories',
                'downloadsCount',
                'versionsCount',
                'lastModified',
            ],
            versionsTableColumns: [
                'name',
                'repo',
                'packageId',
                'lastModified',
                'downloadsCount'
            ],
            packageSummaryColumns: [
                'packageIcon',
                'packageName',
                'numberOfDownloads',
                'lastModified',
/*
                'installCommand'
*/
            ],
            versionSummaryColumns: [
                'versionIcon',
                'versionName',
                'size',
                'packageName',
                'packageId',
                'lastModified'
            ],
            widgetsLayout: {
                main: {
                    rows: [
                        {
                            size: '100%',
                            cells: ['100% @dockerLayers']
                        }
                    ]
                }
            }
        }
    }

}
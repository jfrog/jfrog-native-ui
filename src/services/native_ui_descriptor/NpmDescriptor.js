import BaseDescriptor from './BaseDescriptor';

export default class NpmDescriptor extends BaseDescriptor{
    constructor() {
        super()
        this.init();
    }

    init() {
        this.descriptor = {
            transformers: {
                packages: data => {
                    let result = {}
                    if (data.results && data.results.length) {
                        result.data = data.results.map((image) => {
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
                    result.versionsCount = data.numOfVersions;
                    result.lastModified = data.lastModified;
                    result.latestPath = data.latestPath;
                    result.keywords = data.keywords;
                    if (data.results) {
                        result.versions = data.results.map((version) => {
                            delete version.numOfDownloads;
                            return this.descriptor.transformers.version(version);
                        });
                    }

                    return result;
                },
                version: data => {
                    data.downloadsCount = data.numOfDownloads || data.totalDownloads;
                    return data;
                }
            },
            aliases: {
                package: 'package',
                version: 'version'
            },
            icons: {
                packages: 'icon-navigation-products',
                package: 'repotype iconrepo iconrepo-npm',
                version: 'icon-docker-tags'
            },
            filters: {
                package: 'npmName',
                version: 'npmVersion',
                keywords: 'npmKeywords',
                scope: 'npmScope',
                checksum: 'npmChecksum',
            },
            filtersLabels: {
                'npmName': 'Package Name',
                'npmVersion': 'Version',
                'npmKeywords': 'Keywords',
                'npmScope': 'Scope',
                'npmChecksum': 'Checksum',
            },
            installPrefix: 'npm i',
            packagesTableColumns: [
                'name',
                'repositories',
                'downloadsCount',
                'versionsCount',
                'lastModified',
                'keywords'
            ],
            versionsTableColumns: [
                'name',
                'repositories',
                'lastModified',
                'downloadsCount',
                'keywords'
            ],
            columnsRemovedForDerby: [
                'downloadsCount',
                'keywords'
            ],
            packageSummaryColumns: [
                'packageIcon',
                'packageName',
                'description',
                'license',
                'numberOfDownloads',
                'lastModified',
                'installCommand'
            ],
            versionSummaryColumns: [
                'versionIcon',
                'versionName',
                'description',
                'license',
                'numberOfDownloads',
                'lastModified',
                'installCommand'
/*
                'versionIcon',
                'versionName',
                'description',
                'keywords',
                'license',
                'numberOfDownloads',
                'lastModified'
*/
            ],
            widgetsLayout: {
                main: {
                    rows: [
                        {
                            size: '100%',
                            cells: ['50% @readme', '50% #rightSide'],
                        }
                    ]
                },
                rightSide: {
                    rows: [
                        {
                            size: '33%',
                            cells: ['100% @properties']
                        },
                        {
                            size: '33%',
                            cells: ['100% @dependencies']
                        },
                        {
                            size: '33%',
                            cells: ['100% @builds']
                        },
                    ]
                }
            }


        }
    }

}
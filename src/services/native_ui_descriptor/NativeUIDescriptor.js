import cellTemplates from '../../constants/cell.templates.constants';

export default class NativeUIDescriptor {
    constructor(JFrogTableViewOptions) {
        this.cellTemplatesGenerators = JFrogTableViewOptions.cellTemplateGenerators;
        this.init();
    }

    init() {
        this.descriptor = {
            defaultComparator: 'matches',
            common: {
                packagesTableColumns: {
                    name: {
                        header: '@{PACKAGE_ALIAS} Name',
                        width: '15%',
                        //                        headerCellTemplate: '<div style="padding-right:30px"></div>',
                        cellTemplate: `<div class="name">
                                {{row.entity.name}}
                               </div>`
                    },
                    numOfRepos: {
                        header: 'Repositories Count',
                        width: '15%',
                        //                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                               </div>`
                    },
                    repositories: {
                        header: 'Repositories',
                        sortable: false,
                        //                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        //                        cellTemplate: cellTemplates.packages.repositories,
                        cellTemplate: this.cellTemplatesGenerators.listableColumn('row.entity.repositories','row.entity.name'),
                        width: '15%'
                    },
                    downloadsCount: {
                        header: 'Download Count',
                        sortable: false,
                        //                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: cellTemplates.packages.downloadsCount,
                        width: '15%'
                    },
                    versionsCount: {
                        header: 'Versions Count',
                        sortable: false,
                        //                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: cellTemplates.packages.versionsCount,
                        width: '15%'
                    },
                    lastModified: {
                        header: 'Last Modified',
                        sortable: false,
                        //                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: `<span jf-tooltip-on-overflow>
                                    {{row.entity.lastModified ? (row.entity.lastModified | date : 'medium') : '--'}}
                               </span>`,
                        width: '15%'
                    },
                    keywords: {
                        header: 'Keywords',
                        sortable: false,
                        cellTemplate: cellTemplates.packages.keywords,
                        width: '15%'
                    }
                },
                versionsTableColumns: {
                    name: {
                        header: `@{VERSION_ALIAS} Name`,
                        width: '15%',
                        cellTemplate: cellTemplates.versions.name
                    },
                    repo: {
                        header: 'Repository',
                        width: '15%'
                    },
                    repositories: {
                        header: 'Repositories',
                        sortable: false,
                        cellTemplate: this.cellTemplatesGenerators.listableColumn('row.entity.repositories','row.entity.name'),
                        width: '15%'
                    },
                    packageId: {
                        header: `Digest`,
                        sortable: false,
                        cellTemplate: cellTemplates.versions.packageId,
                        width: '15%'
                    },
                    lastModified: {
                        header: 'Last Modified',
                        cellTemplate: `<div class="last-modified">
                                    {{ row.entity.lastModified | date : 'medium'}}
                                </div>`,
                        width: '15%'
                    },
                    downloadsCount: {
                        header: 'Downloads',
                        sortable: false,
                        width: '15%',
                        cellTemplate: cellTemplates.versions.downloadsCount
                    },
                    keywords: {
                        header: 'Keywords',
                        sortable: false,
                        cellTemplate: cellTemplates.packages.keywords,
                        width: '15%'
                    }
                },
                packageSummaryColumns: {
                    packageIcon: {
                        class: 'package-icon',
                        template: `<div class="summary-icon-column">
                                        <i class="icon" ng-class="$ctrl.packagesIcon"></i>
                                    </div>`,
                        isActive: true,
                        noWrap: true,
                        width: '120px'
                    },
                    packageName: {
                        label: `@{PACKAGE_ALIAS} Name`,
                        class: 'package-name',
                        noWrap: true,
                        template: `<span jf-tooltip-on-overflow>{{$ctrl.summaryData.name || $ctrl.package.name || 'No package'}}</span>`,
                        isActive: true,
                        width: '180px'
                    },
                    numberOfDownloads: {
                        label: 'Number Of Downloads',
                        class: 'package-downloads-count',
                        template: `{{$ctrl.summaryData.numOfDownloads !== undefined ? $ctrl.summaryData.numOfDownloads : $ctrl.package.downloadsCount}}`,
                        isActive: true
                    },
                    lastModified: {
                        label: 'Last Modified',
                        class: 'package-modified-date',
                        template: `<span jf-tooltip-on-overflow>
                            {{($ctrl.summaryData.lastModified || $ctrl.package.lastModified) ? (($ctrl.summaryData.lastModified || $ctrl.package.lastModified) | date : 'medium') : '--'}}
                           </span>`,
                        noWrap: true,
                        isActive: true
                    },
                    installCommand: {
                        label: 'Installation command',
                        class: 'package-install-command',
                        template: `<span jf-tooltip-on-overflow>
                                    <div class="install-command">{{$ctrl.summaryData.installCommand}}</div>
                                   </span>`,
                        noWrap: true,
                        isActive: true
                    },
                    keywords: {
                        label: 'Related keywords',
                        class: 'related-keywords',
                        template: `<span>
                                        <div class="keywords-wrap">
                                            <div class="keyword"
                                                 ng-repeat="keyword in $ctrl.summaryData.keywords.slice(0,4)"
                                                 ng-click="$ctrl.filterByKeyword(keyword)"
                                                 jf-tooltip-on-overflow>
                                                {{keyword}}
                                            </div>
                                        
                                            <div class="keyword"
                                                 ng-if="$ctrl.summaryData.keywords.length > 4"
                                                 jf-tooltip="{{'Show All (' + $ctrl.summaryData.keywords.length + ')'}}"
                                                 ng-click="$ctrl.showAll($event,$ctrl.summaryData.keywords, 'Keywords', true, $ctrl.filterByKeyword.bind($ctrl))">
                                                ...
                                            </div>
                                        </div>    
                                   </span>`,
                        noWrap: true,
                        isActive: true
                    },
                    description: {
                        label: 'Description',
                        class: 'summary-description',
                        template: `<span class="description-text"jf-tooltip-on-overflow>
                                        {{$ctrl.summaryData.description}}
                                   </span>`,
                        noWrap: false,
                        isActive: true
                    },
                    license: {
                        label: 'License',
                        class: 'summary-license',
                        template: `<span jf-tooltip-on-overflow>
                                        {{$ctrl.summaryData.license || '?'}}
                                   </span>`,
                        noWrap: true,
                        isActive: true
                    }
                },
                versionSummaryColumns: {
                    versionIcon: {
                        noWrap: true,
                        template: `<div class="summary-icon-column">
							<i class="icon" ng-class="$ctrl.versionIcon"></i>
						</div>`,
                        isActive: true,
                        width: '120px'
                    },
                    versionName: {
                        label: `@{VERSION_ALIAS} Name`,
                        class: 'version-name',
                        noWrap: true,
                        template: `<span jf-tooltip-on-overflow>{{$ctrl.summaryData.name || $ctrl.version.name || 'No version'}}</span>`,
                        isActive: true
                    },
                    size: {
                        label: 'Size',
                        class: 'version-size',
                        template: `{{$ctrl.version.size.length ? $ctrl.version.size : ($ctrl.version.size | filesize)}}`,
                        isActive: true
                    },
                    packageName: {
                        label: `@{PACKAGE_ALIAS} Name`,
                        class: 'package-name',
                        noWrap: true,
                        template: `<span jf-tooltip-on-overflow>{{$ctrl.version.packageName}}</span>`,
                        isActive: true
                    },
                    packageId: {
                        label: `@{PACKAGE_ALIAS} ID`,
                        class: 'package-id',
                        noWrap: true,
                        template: `<span class="package-id-content" 
								 jf-tooltip-on-overflow>
								{{ $ctrl.version.packageId }}
							</span>
							<jf-clip-copy 
								text-to-copy="$ctrl.version.packageId"
							    object-name="{{$ctrl.packageAlias}} ID">
							</jf-clip-copy>`,
                        isActive: true
                    },
                    lastModified: {
                        label: 'Last Modified',
                        noWrap: true,
                        template: `<span jf-tooltip-on-overflow>
                            {{($ctrl.summaryData.lastModified || $ctrl.version.lastModified) ? (($ctrl.summaryData.lastModified || $ctrl.version.lastModified) | date : 'medium') : '--'}}
                       </span>`,
                        isActive: true
                    }
                },
                widgets: {
                    dockerLayers: {
                        name: 'Docker Layers',
                        id: 'docker-layers',
                        template: `
                                    <div class="docker-layers">
                                       <h4>Layers</h4>
                                       <jf-docker-v2-layers
                                               controller="ctrl.$scope.versionCtrl"
                                               data="ctrl.$scope.versionCtrl.version.layers"
                                               current-path="a/latest">
                                       </jf-docker-v2-layers>
                                    </div>
`,
                        scroll: true,
                        showSpinner: false
                    },
                    readme: {
                        name: 'Read me',
                        id: 'readme',
                        template: `<div style="padding: 40px">README !</div>`,
                        scroll: true,
                        showSpinner: false
                    },
                    properties: {
                        name: 'Properties',
                        id: 'properties',
                        template: `<div style="padding: 40px">PROPERTIES !</div>`,
                        scroll: true,
                        showSpinner: false
                    },
                    dependencies: {
                        name: 'Dependencies',
                        id: 'dependencies',
                        template: `<div style="padding: 40px">DEPENDENCIES !</div>`,
                        scroll: true,
                        showSpinner: false
                    },
                    builds: {
                        name: 'Builds',
                        id: 'builds',
                        template: `<div style="padding: 40px">BUILDS !</div>`,
                        scroll: true,
                        showSpinner: false
                    },
                },
                transformers: {
                    filters: (data, packageType) => {
                        let result = {};
                        result.repos = data.results;
                        result.reposCount = data.resultsCount;
                        result.extraFilters = this.descriptor.typeSpecific[packageType].filters;
                        return result;
                    }
                }
            },
            typeSpecific: {
                docker: {
                    transformers: {
                        packages: data => {
                            let result = {};
                            if (data.results && data.results.length) {
                                result.data = data.results.map((image) => {
                                    return this.descriptor.typeSpecific.docker.transformers.package(image);
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
                                    return this.descriptor.typeSpecific.docker.transformers.version(version);
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
                        package: 'icon-docker',
                        version: 'icon-docker-tags'
                    },
                    filters: {
                        'Image Name': 'pkg',
                        'Tag': 'version',
                        'Checksum': 'checksum',
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
                        'installCommand'
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
                },
                npm: {
                    transformers: {
                        packages: data => {
                            let result = {}
                            if (data.results && data.results.length) {
                                result.data = data.results.map((image) => {
                                    return this.descriptor.typeSpecific.npm.transformers.package(image);
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
                            result.keywords = data.keywords;
                            if (data.results) {
                                result.versions = data.results.map((version) => {
                                    return this.descriptor.typeSpecific.npm.transformers.version(version);
                                });
                            }

                            return result;
                        },
                        version: data => {
                            data.downloadsCount = data.numOfDownloads;
                            return data;
                        }
                    },
                    aliases: {
                        package: 'package',
                        version: 'version'
                    },
                    icons: {
                        packages: 'icon-navigation-products',
                        package: 'icon-npm',
                        version: 'icon-docker-tags'
                    },
                    filters: {
                        'Package Name': 'npmName',
                        'Version': 'npmVersion',
                        'Keywords': 'npmKeywords',
                        'Scope': 'npmScope',
                        'Checksum': 'npmChecksum',
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
                    packageSummaryColumns: [
                        'packageIcon',
                        'packageName',
                        'description',
                        'keywords',
                        'numberOfDownloads',
                        'lastModified',
                        'installCommand'
                    ],
                    versionSummaryColumns: [
                        'versionIcon',
                        'versionName',
                        'description',
                        'keywords',
                        'license',
                        'numberOfDownloads',
                        'lastModified'
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
    }

    getDescriptor() {
        return this.descriptor;
    }

}
import cellTemplates from '../../constants/cell.templates.constants';

export default class NativeUIDescriptor {
    constructor(JFrogTableViewOptions) {
        this.cellTemplatesGenerators = JFrogTableViewOptions.cellTemplateGenerators;
    }

    getDescriptor() {
        return {
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
//                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: cellTemplates.packages.keywords,
                        width: '15%'
                    }
                },
                versionsTableColumns: {
                    name: {
                        header: `@{VERSION_ALIAS} Name`,
                        width: '30%',
                        cellTemplate: require('../../ui_components/packages_native/components/package/cellTemplates/name.cell.template.html')
                    },
                    repo: {
                        header: 'Repository',
                        width: '20%'
                    },
                    packageId: {
                        header: `Digest`,
                        sortable: false,
                        cellTemplate: require('../../ui_components/packages_native/components/package/cellTemplates/package.id.cell.template.html'),
                        width: '20%'
                    },
                    lastModified: {
                        header: 'Last Modified',
                        cellTemplate: `<div class="last-modified">
                                    {{ row.entity.lastModified | date : 'medium'}}
                                </div>`,
                        width: '30%'
                    },
                    /*
                                        size: {
                                            header: 'Size',
                                            cellTemplate: `<div class="size">
                                                                {{ row.entity.size.length ? row.entity.size : (row.entity.size | filesize)}}
                                                           </div>`,
                                            width: '15%'
                                        },
                    */
                    downloadsCount: {
                        header: 'Downloads',
                        sortable: false,
                        width: '25%',
                        cellTemplate: require('../../ui_components/packages_native/components/package/cellTemplates/download.count.cell.template.html'),
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
                        template: `<span jf-tooltip-on-overflow>
                                        {{$ctrl.summaryData.description}}
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
                        template: `<span jf-tooltip-on-overflow>{{$ctrl.version.name || 'No version'}}</span>`,
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
                            {{$ctrl.version.lastModified ? ($ctrl.version.lastModified | date : 'medium')  : '--'}}
                       </span>`,
                        isActive: true
                    }
                }
            },
            typeSpecific: {
                docker: {
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
                        //'Image ID': 'pkgId', //Currently not working due to a bug in backend
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
                    ]
                },
                npm: {
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
                    packageSummaryColumns: [
                        'packageIcon',
                        'packageName',
                        'description',
                        'keywords',
                        'numberOfDownloads',
                        'lastModified',
                        'installCommand'
                    ]

                }
            }
        }
    }

}
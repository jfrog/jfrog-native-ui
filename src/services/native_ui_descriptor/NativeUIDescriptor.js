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
                        header: 'Name',
                        width: '15%',
                        headerCellTemplate: '<div style="padding-right:30px"></div>',
                        cellTemplate: `<div class="name">
                                {{row.entity.name}}
                               </div>`
                    },
                    numOfRepos: {
                        header: 'Repositories Count',
                        width: '15%',
                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                               </div>`
                    },
                    repositories: {
                        header: 'Repositories',
                        sortable: false,
                        headerCellTemplate: '<div style="padding-right:0"></div>',
//                        cellTemplate: cellTemplates.packages.repositories,
                        cellTemplate: this.cellTemplatesGenerators.listableColumn('row.entity.repositories','row.entity.name'),
                        width: '15%'
                    },
                    downloadsCount: {
                        header: 'Download Count',
                        sortable: false,
                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: cellTemplates.packages.downloadsCount,
                        width: '15%'
                    },
                    versionsCount: {
                        header: 'Versions Count',
                        sortable: false,
                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: cellTemplates.packages.versionsCount,
                        width: '15%'
                    },
                    lastModified: {
                        header: 'Last Modified',
                        sortable: false,
                        headerCellTemplate: '<div style="padding-right:0"></div>',
                        cellTemplate: `<span jf-tooltip-on-overflow>
                                    {{row.entity.lastModified ? (row.entity.lastModified | date : 'medium') : '--'}}
                               </span>`,
                        width: '15%'
                    },
                    keywords: {
                        header: 'Keywords',
                        sortable: false,
                        headerCellTemplate: '<div style="padding-right:0"></div>',
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
                    ]
                },
                npm: {
                    aliases: {
                        package: 'package',
                        version: 'version'
                    },
                    icons: {
                        packages: 'icon-navigation-products',
                        package: 'icon-docker',
                        version: 'icon-docker-tags'
                    },
                    filters: {
                        'Package Name': 'npmName',
                        'Version': 'npmVersion',
                        'Keywords': 'npmKeywords',
                        'Scope': 'npmScope',
                        'Checksum': 'npmChecksum',
                    },
                    packagesTableColumns: [
                        'name',
                        'repositories',
                        'downloadsCount',
                        'versionsCount',
                        'lastModified',
                        'keywords'
                    ]
                }
            }
        }
    }

}
import cellTemplates from '../../constants/cell.templates.constants';
import BaseDescriptor from './BaseDescriptor';

export default class CommonDescriptor extends BaseDescriptor{
    constructor(JFrogTableViewOptions) {
        super()
        this.cellTemplatesGenerators = JFrogTableViewOptions.cellTemplateGenerators;
        this.init();
    }

    init() {
        this.descriptor = {
            defaultComparator: 'matches',
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
                                             ng-click="$ctrl.nativeParent.filterByKeyword(keyword)"
                                             ng-style="{'max-width': $ctrl.summaryData.keywords.length > 4 ? '20%' : $ctrl.summaryData.keywords.length > 0 ? (100/$ctrl.summaryData.keywords.length) + '%' : 0}"
                                             jf-tooltip-on-overflow>
                                            {{keyword}}
                                        </div>
                                    
                                        <div class="keyword"
                                             ng-if="$ctrl.summaryData.keywords.length > 4"
                                             jf-tooltip="{{'Show All (' + $ctrl.summaryData.keywords.length + ')'}}"
                                             ng-click="$ctrl.nativeParent.showAll($event,$ctrl.summaryData.keywords, 'Keywords', true, $ctrl.nativeParent.filterByKeyword.bind($ctrl.nativeParent), 'keywords-modal')">
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
                    template: require('../../version_data_widgets/docker_layers/docker_layers_widget.html'),
                    scroll: true,
                    showSpinner: false
                },
                readme: {
                    name: 'Read me',
                    id: 'readme',
                    template: require('../../version_data_widgets/readme/readme_widget.html'),
                    controller: require('../../version_data_widgets/readme/readme_widget.controller'),
                    scroll: true,
                    showSpinner: false
                },
                properties: {
                    name: 'Properties',
                    id: 'properties',
                    template: require('../../version_data_widgets/properties/properties_widget.html'),
                    controller: require('../../version_data_widgets/properties/properties_widget.controller'),
                    scroll: true,
                    showSpinner: false
                },
                dependencies: {
                    name: 'Dependencies',
                    id: 'dependencies',
                    template: require('../../version_data_widgets/dependencies/dependencies_widget.html'),
                    controller: require('../../version_data_widgets/dependencies/dependencies.controller'),
                    scroll: true,
                    showSpinner: false
                },
                builds: {
                    name: 'Builds',
                    id: 'builds',
                    template: require('../../version_data_widgets/builds/builds_widget.html'),
                    controller: require('../../version_data_widgets/builds/builds_widget.controller'),
                    scroll: true,
                    showSpinner: false
                },
            },
            transformers: {
                filters: (data, packageType) => {
                    let result = {};
                    result.repos = data.results;
                    result.reposCount = data.resultsCount;
                    if (this.getRootDescriptor().typeSpecific[packageType]) {
                        result.extraFilters = this.getRootDescriptor().typeSpecific[packageType].filters;
                    }
                    return result;
                }
            }
        }
    }

}
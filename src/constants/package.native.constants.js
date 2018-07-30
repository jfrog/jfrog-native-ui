export const PACKAGE_NATIVE_CONSTANTS = {
	defaultComparator: 'matches',
	common: {
		packagesTableColumns: {
			name: {
                header: 'Name',
                width: '20%',
                headerCellTemplate: '<div style="padding-right:30px"></div>',
                cellTemplate: `<div class="name">
                                {{row.entity.name}}
                               </div>`
            },
            numOfRepos: {
                header: 'Repositories Count',
                width: '10%',
                headerCellTemplate: '<div style="padding-right:0"></div>',
                cellTemplate: `<div>
                                {{row.entity.numOfRepos}} {{row.entity.numOfRepos===1 ? 'Repository' : 'Repositories'}}
                               </div>`
            },
            repositories: {
                header: 'Repositories',
                sortable: false,
                headerCellTemplate: '<div style="padding-right:0"></div>',
                cellTemplate: require('../ui_components/packages_native/components/packages/cellTemplates/repositories.cell.template.html'),
                width: '20%'
            },
            downloadsCount: {
                header: 'Download Count',
                sortable: false,
                headerCellTemplate: '<div style="padding-right:0"></div>',
                cellTemplate: require('../ui_components/packages_native/components/packages/cellTemplates/download.count.cell.template.html'),
                width: '20%'
            },
            versionsCount: {
                header: 'Versions Count',
                sortable: false,
                headerCellTemplate: '<div style="padding-right:0"></div>',
                cellTemplate: require('../ui_components/packages_native/components/packages/cellTemplates/versions.count.cell.template.html'),
                width: '10%'
            },
            lastModified: {
                header: 'Last Modified',
                sortable: false,
                headerCellTemplate: '<div style="padding-right:0"></div>',
                cellTemplate: `<span jf-tooltip-on-overflow>
                                    {{row.entity.lastModified ? (row.entity.lastModified | date : 'medium') : '--'}}
                               </span>`,
                width: '20%'
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
            	'numOfRepos',
            	'repositories',
            	'downloadsCount',
            	'versionsCount',
            	'lastModified',
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
                'Keyword': 'npmKeywords',
                'Scope': 'npmScope',
                'Checksum': 'npmChecksum',
            },
            packagesTableColumns: [
                'name',
                'numOfRepos',
                'repositories',
                'downloadsCount',
                'versionsCount',
                'lastModified',
            ]
        }
	}
};
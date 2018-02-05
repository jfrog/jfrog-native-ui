export const PACKAGE_NATIVE_CONSTANTS = {
	defaultComparator: 'matches',
	docker: {
		packages: {
			icon: 'icon-navigation-products'
		},
		package: {
			alias: 'image',
			icon: 'icon-docker'
		},
		version: {
			alias: 'tag',
			icon: 'icon-docker-tags'
		},
		filters: {
			//'Image ID': 'pkgId', //Currently not working due to a bug in backend
			'Tag': 'version',
			'Image Name': 'pkg'
		},
	}
};
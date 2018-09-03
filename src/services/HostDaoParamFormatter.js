export default class HostDaoParamFormatter {
    constructor(JFrogSubRouter, NativeUIDescriptor) {
        this.descriptor = NativeUIDescriptor.getDescriptor();
        this.getSubRouter = () => JFrogSubRouter.getActiveRouter();
    }

    format(params, daoMethod = '') {
        if (!daoMethod) return this.defaultFormat(params);
    }

    wrapHostDataCalls(hostDataCalls) {
        let excludedMethods = ['getPackageTypes','isXrayEnabled','showInTree', 'cancelPackageExtraInfo', 'cancelVersionExtraInfo', 'showExtraInfo'];
        Object.keys(hostDataCalls).forEach(method => {
            if (!_.includes(excludedMethods, method)) {
                let origMethod = hostDataCalls[method];
                hostDataCalls[method] = (params) => {
                    return origMethod(this.format(params));
                }
            }
        })
    }

    getFiltersFromState(overrides) {
        let stateParams = this.getSubRouter().params;
        let filters = [];
        let addFilter = (id,values,comparator = this.descriptor.common.defaultComparator) => {
            return filters.push({id, comparator, values});
        }

        if (stateParams.query) {
            Object.keys(stateParams.query).forEach(queryParam => {
                addFilter(queryParam === 'repos' ? 'repo' : queryParam, (stateParams.query[queryParam] || '').split(','))
            })
        }

        let typeDescriptor = this.descriptor.typeSpecific[stateParams.packageType];

        let pkgFilter = _.find(filters, {id: typeDescriptor.filters.package});
        let versionFilter = _.find(filters, {id: typeDescriptor.filters.version});

        if (pkgFilter && pkgFilter.values[0] && !pkgFilter.values[0].endsWith('*')) {
            pkgFilter.values[0] = pkgFilter.values[0] + '*'
        }

        if (stateParams.package || overrides.package) {
            if (pkgFilter) {
                pkgFilter.values = [stateParams.package || overrides.package];
                pkgFilter.comparator = 'equals';
            }
            else addFilter(typeDescriptor.filters.package, [stateParams.package || overrides.package], 'equals');
        }
        if (stateParams.version || overrides.version) {
            if (versionFilter) {
                versionFilter.values = [stateParams.version || overrides.version];
                versionFilter.comparator = 'equals';
            }
            else addFilter(typeDescriptor.filters.version, [stateParams.version || overrides.version], 'equals');
        }

        return filters;
    }

    defaultFormat(params) {
        return {
            pathAndQuery: this._getDefaultPathAndQueryParams(params),
            payload: this.getFiltersFromState(params)
        }
    }

    _getDefaultPathAndQueryParams(params) {
        let pathAndQueryParams = {};

        params = _.extend({}, this.getSubRouter().params, params || {});

        let set = (from, to) => {
            if (params[from]) pathAndQueryParams[to] = params[from];
        };

        set('package', 'packageName');
        set('version', 'versionName');
        set('packageType', 'packageType');
        set('repo', 'repo');
        set('path', 'path');
        set('dataType', 'dataType');
        set('manifest', 'manifest');
        set('order', 'order');
        set('sortBy', 'sort_by');
        set('$no_spinner', '$no_spinner');

        return pathAndQueryParams;
    }



}
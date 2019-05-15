import {rawMockData} from '../../../../constants/mock_xray_graph_data';
const SEVERITIES_COLORS = {
    security_high:'#fbc02d',
    security_medium:'#fdd981',
    security_low:'#fef3d5',
    security_unknown:'#eef5a7',
    license_high:'#4a7cb8',
    license_medium:'#92b0d4',
    license_low:'#dbe5f1',
    license_unknown:'#6a68f1',
    downloads: "#6317d3"
}
export default class PackageController {

    constructor(JFrogSubRouter, $scope, $q, JFrogTableViewOptions,
                JFrogUIUtils, $rootScope, JFrogModal, NativeUIDescriptor, $window) {
        this.subRouter = JFrogSubRouter.getActiveRouter();
        this.$stateParams = this.subRouter.params;
        this.$scope = $scope;
        this.$window = $window;
        this.$q = $q;
        this.JFrogTableViewOptions = JFrogTableViewOptions;
        this.jFrogUIUtils = JFrogUIUtils;
        this.$rootScope = $rootScope;
        this.modal = JFrogModal;
        this.descriptor = NativeUIDescriptor.getDescriptor();
        this.showSecurityViolations = true;
        this.showLicensesViolations = true;
        this.showDownloadsStats = true;

    }

    $onInit() {

        this.severitiesDictionary = {
            high:'high',
            medium:'medium',
            low:'low',
            unknown:'unknown'

        }
        this.oldSeverityModel = ["security_critical", "security_major", "security_minor", "security_unknown", "license_critical", "license_major", "license_minor", "license_unknown"]
        this.newSeverityModel = ["security_high", "security_medium", "security_low", "security_unknown", "license_high", "license_medium", "license_low", "license_unknown"]
        this.selectedSeveritiesModel = this.newSeverityModel
        this.nativeParent.stateController = this;

        let init = () => {
            this.initTable();
            this.limitOptions = ['5', '10', '15'];
            this.limitVal = '10';
            this.dateSpanOptions = [
                {displayName: "All Times", value: null},
                {displayName: "Last 24 Hours", value: "LAST_24H"},
                {displayName: "Last 7 Days", value: "LAST_7D"},
                {displayName: "Last 14 Days", value: "LAST_14D"}
            ];
            this.selectedTimeSpan = this.dateSpanOptions[0];
            this.$scope.$watch('$ctrl.toggleByStringModel', () => {
                this.tableViewOptions.update();
            });

            this.subRouter.listenForChanges(['packageType', 'package', 'repos'], 'package', () => {
                this.getSummaryData();
                this.getPackageData().then(() => {
                    this.tableViewOptions.setData(this.package.versions);
                })
            }, this.$scope);

            this.summaryColumns = this.getSummaryColumns();

        }
        this.nativeParent.hostData.isXrayEnabled().then((response) => {
            this.withXray = response;
            if (this.withXray) {
                this.getXrayData();
            } else {
                this.chartConfig = this.getGraphObj();
            }
        });
        this.initConstants();
        this.getSummaryData();
        this.getPackageData().then(() => {
            init();
        }).catch(() => {
            this.package = {};
            init();
        })
    }

    get typeSpecific() {
        return this.descriptor.typeSpecific[this.$stateParams.packageType];
    }

    getSummaryData() {

        if (this.$stateParams.packageType !== 'docker') {
            let defer = this.$q.defer();

            let cached = this.nativeParent.cache('package.summary');
            if (cached && _.isEqual(cached.state, this.$stateParams)) {
                this.summaryData = cached.data;
                defer.resolve();
            }
            else {
                this.nativeParent.hostData.getPackageSummary(this.$stateParams).then(summaryData => {
                    this.summaryData = summaryData;
                    this.nativeParent.cache('package.summary', {
                        data: this.summaryData,
                        state: _.cloneDeep(this.$stateParams)
                    })
                    this.summaryData.installCommand = this.descriptor.typeSpecific[this.$stateParams.packageType].installPrefix + ' ' + this.$stateParams.package;
                    if (summaryData.latestPath) {
                        this.nativeParent.hostData.getPackageSummaryExtraInfo(_.extend({}, this.$stateParams, {path: summaryData.latestPath})).then(summaryExtraData => {
                            _.extend(this.summaryData, summaryExtraData);
                            defer.resolve();
                        })
                    }
                    else defer.resolve()
                }).catch(console.error)
            }
            return defer.promise;
        }
        else {
            this.summaryData = {}
            this.summaryData.installCommand = this.descriptor.typeSpecific[this.$stateParams.packageType].installPrefix + ' ' + this.$stateParams.package;
            return this.$q.when();
        }
    }

    getPackageData(additionalDaoParams) {
        additionalDaoParams = additionalDaoParams || {};
        additionalDaoParams.sortBy = additionalDaoParams.sortBy || 'lastModified';
        additionalDaoParams.order = additionalDaoParams.order || 'desc';

        let daoParams = _.extend({}, this.$stateParams, additionalDaoParams);
        delete daoParams.repos;
        daoParams.repoFilter = [];
        if (this.$stateParams.query.repos) {
            daoParams.repoFilter.push({
                id: 'repo',
                comparator: this.descriptor.common.defaultComparator,
                values: this.$stateParams.query.repos.split(',')
            });
        }
        if (this.$stateParams.query.version) {
            daoParams.repoFilter.push({
                id: 'version',
                comparator: this.descriptor.common.defaultComparator,
                values: [this.$stateParams.query.version]
            });
        }

        if (this.$stateParams.packageType === 'docker') this.calcPackageDownloads();

        this.cancelVersionExtraInfo();


        let cached = this.nativeParent.cache('package');
        if (cached && _.isEqual(cached.state, daoParams)) {
            if (cached.package.versions) cached.package.versions.forEach(row => delete row.calculationPending);
            this.package = cached.package;
            return this.$q.when();
        }
        else {

            return this.nativeParent.hostData.getPackage(daoParams).then((pkg) => {
                pkg.totalDownloads = this.totalDownloadsForPackage || 0;
                this.package = this.descriptor.typeSpecific[this.$stateParams.packageType].transformers.package(pkg);
                this.nativeParent.cache('package', {
                    package: this.package,
                    state: _.cloneDeep(daoParams)
                })

            });
        }
    }

    getXrayData(additionalDaoParams) {

        additionalDaoParams = additionalDaoParams || {};
        additionalDaoParams.sortBy = additionalDaoParams.sortBy || 'lastModified';
        additionalDaoParams.order = 'asc';
        additionalDaoParams.with_xray = true;
        additionalDaoParams.limit = this.limitVal;
        if (this.selectedTimeSpan) {
            additionalDaoParams.from = this.selectedTimeSpan.value
        }
        additionalDaoParams.$no_spinner = true;

        this.nativeParent.hostData.getPackage(additionalDaoParams).then((data) => {
            if (data.errorStatus) {
                switch(data.errorStatus) {
                    case 'Incompatible Xray version': {
                        this.xrayError = 'Incompatible JFrog Xray version. This feature is supported from JFrog Xray 2.4.0 and above.\n' +
                                         'Upgrade JFrog Xray to get license and security violations data.\n' +
                                         'This mock-up graph presents what you could see if you had JFrog Xray 2.4.0 and above.';

                        this.graphData = rawMockData;
                        this.chartConfig = this.getGraphObj();
                        break;
                    }
                    case 'Xray is not available': {
                        this.xrayError = 'Cannot display data. JFrog Xray is unavailable.';
                        break;
                    }
                }
                //

            }
            else {
                if (this.$stateParams.packageType == 'docker') {
                    this.graphData = data.versions;
                } else {
                    this.graphData = data.results;
                }

                this.chartConfig = this.getGraphObj();
            }
        });
    }

    calcPackageDownloads() {
        let daoParams = {
            package: this.$stateParams.package,
            packageType: this.$stateParams.packageType
        };
        this.nativeParent.hostData.getPackageDownloadsCount(daoParams).then((response) => {
            if (this.package) this.package.totalDownloads = response.totalDownloads;
            this.totalDownloadsForPackage = response.totalDownloads;

        });
    }

    initConstants() {
        this.packageAlias = this.jFrogUIUtils.capitalizeFirstLetter(
            this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.package
        );
        this.versionAlias = this.jFrogUIUtils.capitalizeFirstLetter(
            this.descriptor.typeSpecific[this.$stateParams.packageType].aliases.version
        );
        this.packageTypeIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.package;
        this.packagesIcon = this.descriptor.typeSpecific[this.$stateParams.packageType].icons.packages;
    }

    initTable() {
        this.tableViewOptions = new this.JFrogTableViewOptions(this.$scope);
        this.columns = this.getTableColumns();
        this.tableViewOptions
            .setColumns(this.columns)
            .setRowsPerPage(20)
            .setEmptyTableText(`No ${this.versionAlias}s`)
            .setActions(this.getActions())
            .sortBy('lastModified').reverseSortingDir()
            .setData(this.package.versions);
        this.tableViewOptions.on('row.clicked', this.onRowClick.bind(this));
        this.tableViewOptions.useExternalSortCallback(this.onSortChange.bind(this));

        this.tableViewOptions.on('row.in.view', row => {
            if (row.downloadsCount === undefined) {
                if (this.$stateParams.packageType === 'docker') this.calcVersionDownloads(row);
                else if (this.nativeParent.showExtraInfo) this.calcPackageExtraData(row);
            }
        });

    }

    onSortChange(field, dir) {
        if (field === 'repo') field = 'repoKey';

        this.getPackageData({
            sortBy: field,
            order: dir
        }).then(() => {
            this.tableViewOptions.setData(this.package.versions);
        })
    }

    onRowClick(row) {
        if (row && row.entity && row.entity.name && !$(row.event.target).is('.copy-to-clip')) {
            this.goToVersion(row.entity.name, row.entity.repo || row.entity.repositories[0], row.entity.latestPath);
        }
    }

    getActions() {
        // TODO: Export this to a constants json with all actions relevant to a repo type (and bind to ctrl)
        return [{
            icon: 'icon icon-show-in-tree',
            tooltip: 'Show In Tree',
            callback: (row) => {
                if (row.latestPath) {
                    this.nativeParent.hostData.showInTree({fullpath: row.latestPath});
                }
                else {
                    let pathParams = {
                        repo: row.repo,
                        package: this.package.name,
                        version: row.name
                    };
                    this.nativeParent.hostData.showInTree(pathParams);
                }
            }
        }, {
            icon: 'icon icon-report',
            tooltip: 'View manifest',
            visibleWhen: () => this.$stateParams.packageType === 'docker',
            callback: (row) => {
                this.showManifest(row.name, row.repo);
            }
        }];
    }

    getTableColumns() {
        if (!this.nativeParent.showExtraInfo) {
            let hiddenColumns = this.typeSpecific.columnsRemovedForDerby;
            this.typeSpecific.versionsTableColumns = _.filter(this.typeSpecific.versionsTableColumns, col => {
                return !_.includes(hiddenColumns, _.isString(col) ? col : col.field)
            })
        }

        return _.map(this.typeSpecific.versionsTableColumns, column => {
            let columnObj;
            if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.versionsTableColumns[column]);
                columnObj.field = column;
            }
            else columnObj = column;

            if (columnObj.header.indexOf('@{VERSION_ALIAS}') !== -1) {
                columnObj.header = columnObj.header.replace('@{VERSION_ALIAS}', this.versionAlias);
            }

            return columnObj;
        });
    }

    goToVersion(versionName, repo, path) {
        this.cancelVersionExtraInfo();
        this.subRouter.goto('version', {
            packageType: this.$stateParams.packageType,
            package: this.$stateParams.package,
            repo: repo,
            versionPath: path,
            version: versionName
        })
    }

    goBack() {
        this.subRouter.goto('packages', {packageType: this.$stateParams.packageType})
    }

    showManifest(versionName, repo) {
        let daoParams = {
            packageType: this.$stateParams.packageType,
            package: this.package.name,
            version: versionName,
            repo: repo,
            manifest: true
        };

        this.nativeParent.hostData.getManifest(daoParams).then((response) => {
            this.modalScope = this.$rootScope.$new();
            this.modalScope.modalTitle = 'Manifest.json';

            this.modalScope.closeModal = () => {
                return this.modalInstance.close();
            };
            this.modalScope.downloadManifest = () => {
                this.jFrogUIUtils.saveTextAsFile(this.modalScope.manifest,
                    `manifest_${this.package.name}_${versionName}.txt`);
                this.modalScope.closeModal();
            };
            this.modalScope.manifest = JSON.stringify(angular.fromJson(response.fileContent), null, '\t');
            this.modalInstance = this.modal.launchModal('manifest.modal', this.modalScope, 'lg');
        });
    }

    getSummaryColumns() {
        return _.map(this.descriptor.typeSpecific[this.$stateParams.packageType].packageSummaryColumns, column => {
            let columnObj;
            if (_.isString(column)) {
                columnObj = _.cloneDeep(this.descriptor.common.packageSummaryColumns[column]);
            }
            else columnObj = column;

            ['label', 'template'].forEach(objField => {
                if (columnObj[objField] && columnObj[objField].indexOf('@{PACKAGE_ALIAS}') !== -1) {
                    columnObj[objField] = columnObj[objField].replace('@{PACKAGE_ALIAS}', this.packageAlias);
                }
            })

            return columnObj;

        });
    }

    calcVersionDownloads(row, e) {
        if (e) e.stopPropagation();
        let daoParams = {
            repo: row.repo,
            package: this.package.name,
            packageType: this.$stateParams.packageType,
            version: row.name,
        };
        row.pendingCalculation = true;
        this.nativeParent.hostData.getVersionDownloadsCount(daoParams).then((response) => {
            row.xrayStatus = response.xrayStatus
            row.downloadsCount = response.totalDownloads;
            row.calculated = true;
            row.pendingCalculation = false;
        });
    }

    cancelVersionExtraInfo() {
        this.nativeParent.hostData.cancelVersionExtraInfo();
    }

    calcPackageExtraData(row) {
        if (row.calculated || row.calculationPending) return;

        let versionName = row.name;
        let daoParams = {
            version: versionName
        };
        row.calculationPending = true;
        return this.nativeParent.hostData.getVersionExtraInfo(daoParams).then((response) => {
            _.merge(row, this.typeSpecific.transformers.version(response));
            /*
                        if (response.totalDownloads !== undefined) {
                            row.downloadsCount = response.totalDownloads;
                        }
                        else {
                            row.manualOnDemendDownloadsCount = true;
                        }
            */
            row.calculated = true;
            row.calculationPending = false;
        })
    }

    /* ======== Chart Config Mock Methods ========== */

    getGraphObj(type = "chart") {
        let _this = this;


        return {
            id: "xray-data-chart",
            data: {
                json: _this.getFormattedData(),
                colors: {
                    ['security_'+ _this.severitiesDictionary.high]: SEVERITIES_COLORS.security_high,
                    ['security_'+ _this.severitiesDictionary.low]: SEVERITIES_COLORS.security_low,
                    ['security_'+ _this.severitiesDictionary.unknown]:SEVERITIES_COLORS.security_unknown,
                    ['security_'+ _this.severitiesDictionary.medium]: SEVERITIES_COLORS.security_medium,
                    ['license_'+ _this.severitiesDictionary.low]: SEVERITIES_COLORS.license_low,
                    ['license_'+ _this.severitiesDictionary.unknown]: SEVERITIES_COLORS.license_unknown,
                    ['license_'+ _this.severitiesDictionary.medium]: SEVERITIES_COLORS.license_medium,
                    ['license_'+ _this.severitiesDictionary.high]: SEVERITIES_COLORS.license_high,
                    downloads: SEVERITIES_COLORS.downloads
                },
                x: "x",
                keys: {
                    // x: "name", // it's possible to specify 'x' when category axis
                    value: ["x", ..._this.selectedSeveritiesModel, "downloads"]
                },
                types: {
                    downloads: "spline",
                    ['security_'+ _this.severitiesDictionary.unknown]: "bar",
                    ['security_'+ _this.severitiesDictionary.low]: "bar",
                    ['security_'+ _this.severitiesDictionary.medium]: "bar",
                    ['security_'+ _this.severitiesDictionary.high]: "bar",
                    ['license_'+ _this.severitiesDictionary.unknown]:"bar",
                    ['license_'+ _this.severitiesDictionary.low]: "bar",
                    ['license_'+ _this.severitiesDictionary.medium]: "bar",
                    ['license_'+ _this.severitiesDictionary.high]: "bar"
                },
                groups: [
                    [
                        `security_${ _this.severitiesDictionary.high}`,
                        `security_${ _this.severitiesDictionary.medium}`,
                        `security_${ _this.severitiesDictionary.low}`,
                        `security_${ _this.severitiesDictionary.unknown}`
                    ],
                    [
                        `license_${ _this.severitiesDictionary.high}`,
                        `license_${ _this.severitiesDictionary.medium}`,
                        `license_${ _this.severitiesDictionary.low}`,
                        `license_${ _this.severitiesDictionary.unknown}`
                    ]
                ],
                axes: {
                    downloads: "y2"
                },
                onover: function (d) {

                }

            },
            tooltip: {
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                        titleFormat = function (title) {
                            return _this.getFormattedData()[title].x;
                        },
                        nameFormat = config.tooltip_format_name || function (name) {
                            return _this.removeChart(name);
                        },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {
                        if (!(d[i] && (d[i].value || d[i].value === 0))) {
                            continue;
                        }

                        if (!text) {
                            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                            text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                        }

                        name = nameFormat(d[i].name);
                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                        /*
                                                console.log("***** Building Tooltip for *****",d);
                                                console.log("Name: "+ name);
                                                console.log("Value: "+ value);
                        */
                        text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                        text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                        text += "<td class='value'>" + value + "</td>";
                        text += "</tr>";
                    }
                    //return text + "</table>";
                    return `<div class="${$$.CLASS.tooltip } data-point-tooltip"> 

<div>
<span class="tooltip-label">Version: </span>
<span class="tooltip-value bold">${title}</span>
</div>

${_this.buildTooltip(d)}

                    </div>`
                }
            },
            grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            },
            bar: {
                width: {
                    ratio: 0.5,
                    max: 31
                },
                padding: 5
            },
            axis: {
                x: {
                    type: "category",
                    tick: {
                        multiline: true,
                        tooltip: true,
                        centered: false,
                        width: 70
                    },
                    height: 35
                },
                y2: {
                    show: true,
                    label: {
                        text: "Downloads Count",
                        position: "outer-middle"
                    },
                    tick: {
                        format: function (x) {
                            return x % 1 === 0 ? x : '';
                        }
                    }
                },
                y: {
                    show: true,
                    label: {
                        text: "Violations Count",
                        position: "outer-middle"
                    },
                    tick: {
                        format: function (x) {
                            return x % 1 === 0 ? x : '';
                        }
                    }

                }
            },
            subchart: {
                show: false
            },
            legend: {
                contents: {
                    bindto: "#bb-legend",
                    template: (title, color) => {
                        return `<div class="legend-item bb-legend-item"> <div class="legend-text">${this.getViolation(title)}</div><div class="legend-color" style="background-color: ${color}" ></div> <div class="legend-text">${this.removeChart(title)}</div></div>`
                    },
                },
                item: {
                    onclick: () => {
                        return
                    }
                }
            },
            oninit: () => {
                this.legendRendered = false;
            },
            onrendered: () => {
                if (!this.legendRendered) {
                    this.groupLegends();
                    this.setLinkableLabels()
                }
            }
        }
    }

    setLinkableLabels() {
        let _this = this;
        $('.bb-axis-x g text').each(function () {
            let version = $(this).find('title').text();
            let foundDataItem = _.findWhere(_this.finalData, {x: version});
            if (foundDataItem) {
                let url = foundDataItem.xrayUrl;
                if (url) {
                    $(this).addClass('link-generated');
                    $(this).click(function () {
                        _this.$window.open(url, "_blank");
                    });
                }
            }
        });
    }

    groupLegends() {
        this.legendRendered = true;
        $("span[class*='legend-item bb-legend-item bb-legend-item-security']").wrapAll("<h4>Security Issues</h4> <div class='security-wrapper' />")
        $("span[class*='legend-item bb-legend-item bb-legend-item-license']").wrapAll("<h4>Licenses Issues</h4>  <div class='license-wrapper'/>")

    }


    removeChart(txt) {
        if (txt.indexOf('_') > -1) {
            return _.capitalize(txt.split('_')[1]);
        }
        return _.capitalize(txt);

    }
    getViolation(txt) {
        if (txt === 'downloads') { return '' }
        const txtValue = txt.split('_');
        if (txtValue.length > 1) {
            if(txtValue[1] != 'high') {
                return '';
            }
            return _.capitalize(`${txtValue[0]} Violations`);
        }
        return _.capitalize(`${txt} Violations`);
    }

    getTooltipText(type, data) {

        if (type == 'download') {
            if (_.findWhere(data, {id: 'downloads'})) {
                return _.findWhere(data, {id: 'downloads'}).value;
            }
            return "N/A"
        }

        if (type == 'security' || type == 'license') {
            let txt = "";
            let ObjArr = _.filter(data, (i) => {
                return i.id.indexOf(type + '_') > -1;
            });

            _.each(ObjArr, (val, key) => {
                let comma = ",";
                if (ObjArr.length - 1 == key) {
                    comma = "";
                }
                txt += this.removeChart(val.id) + " (" + val.value + ")" + comma + " "

            });

            return txt;
        }

    }


    buildTooltip(d) {

        let securityToolTip = "", licenseTooltip = "";

        let hasSecurity = _.filter(d, (i) => {
            return i.id.indexOf('security_') > -1;
        }).length > 0;
        let hasLicense = _.filter(d, (i) => {
            return i.id.indexOf('license_') > -1;
        }).length > 0;

        if (hasSecurity) {
            securityToolTip = `<div>
                <span class="tooltip-label">Security Violations: </span>
                 <span class="tooltip-value bold">${this.getTooltipText('security', d)}</span>
                    </div>`
        }

        if (hasLicense) {

            licenseTooltip = `<span class="tooltip-label">License Violations: </span>
<span class="tooltip-value bold">${this.getTooltipText('license', d)}</span>
</div>`
        }
        return `<div>
                    ${licenseTooltip}
                    ${securityToolTip}

<div>
<span class="tooltip-label">Downloads:</span> 
<span class="tooltip-value bold">${this.getTooltipText('download', d)}</span>
</div>`
    }

    getFormattedData() {
        let finalDataArr = [];
        if (!this.withXray) {
            this.graphData = rawMockData;

        }
        let aggregatedData = _.countBy(this.graphData, 'xrayViolations.version');
        let duplicatedVersions = _.map(_.filter(_.map(Object.keys(aggregatedData),key => [key, aggregatedData[key]]), e => e[1] > 1), i => i[0]);
        _.each(this.graphData, (val, index) => {

            if (_.includes(duplicatedVersions, val.xrayViolations.version)) {
                val.xrayViolations.version = val.repoKey + '/' + val.xrayViolations.version;
            }

            let tmpObj = {};
            _.map(val.xrayViolations.violations.license, (v, k) => {
                tmpObj['license_' + k] = v
            })
            _.map(val.xrayViolations.violations.security, (v, k) => {
                tmpObj['security_' + k] = v
            })
            let unScannedFlag = "";
            if (val.xrayViolations.xrayStatus && val.xrayViolations.xrayStatus.toLowerCase() == 'unscanned') {
                unScannedFlag = "(Unscanned)";
            }
            if(this.withXray){
                tmpObj.x = val.xrayViolations.version + ' ' + unScannedFlag;
                tmpObj.downloads = val.xrayViolations.totalDownloads;
            }else{
                tmpObj.x = val.version + ' ' + unScannedFlag;
                tmpObj.downloads = val.downloads;
            }

            tmpObj.xrayUrl = val.xrayViolations.detailsUrl

            finalDataArr.push(tmpObj)
        });

        if(finalDataArr[0]){
            let isOldModel = _.includes(_.keys(finalDataArr[0]),'security_critical')

            if(isOldModel){
                this.selectedSeveritiesModel = this.oldSeverityModel;
                this.severitiesDictionary = {
                    high:'critical',
                    medium:'major',
                    low:'minor',
                    unknown:'unknown'
                }
            }

        }


        this.finalData = finalDataArr;
        return finalDataArr;
    }

    groupItems() {
        $("span[class*='legend-item bb-legend-item bb-legend-item-security']").wrapAll("<h3>Security Issues</h3> <div class='security-wrapper' />")
        $("span[class*='legend-item bb-legend-item bb-legend-item-license']").wrapAll("<h3>Licenses Issues</h3>  <div class='license-wrapper'/>")

    }

    toggleChart(type) {
        // toggle 'data1'
        let toggleArr = _.map(_.filter(bb.instance[0].data(), (i) => {
            return i.id.indexOf(type) > -1
        }), 'id')
        bb.instance[0].toggle(toggleArr)
    }

    securityViewState(state = 'hide') {
        if (state === 'hide') {
            bb.instance[0].hide(["security_minor", "security_major", "security_critical", "security_unknown"])
        } else if (state === 'show') {
            bb.instance[0].show(["security_minor", "security_major", "security_critical", "security_unknown"])
        }
    }
}

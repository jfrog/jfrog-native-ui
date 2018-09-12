const rawMockData = [
    {
        "version": "1.02",
        "downloads": 120,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 22,
                "minor": 42,
                "major": 53,
                "critical": 30
            },
            "security": {
                "unknown": 22,
                "minor": 422,
                "major": 123,
                "critical": 220
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.03",
        "downloads": 130,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 32,
                "minor": 42,
                "major": 53,
                "critical": 320
            },
            "security": {
                "unknown": 52,
                "minor": 32,
                "major": 23,
                "critical": 72
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.1",
        "downloads": 640,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 22,
                "minor": 52,
                "major": 33,
                "critical": 80
            },
            "security": {
                "unknown": 0,
                "minor": 9,
                "major": 33,
                "critical": 70
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.2",
        "downloads": 120,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 0,
                "minor": 0,
                "major": 0,
                "critical": 14
            },
            "security": {
                "unknown": 0,
                "minor": 0,
                "major": 3,
                "critical": 54
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.3",
        "downloads": 100,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 11,
                "minor": 2,
                "major": 4,
                "critical": 120
            },
            "security": {
                "unknown": 12,
                "minor": 52,
                "major": 33,
                "critical": 80
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.4",
        "downloads": 180,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 22,
                "minor": 21,
                "major": 32,
                "critical": 60
            },
            "security": {
                "unknown": 32,
                "minor": 22,
                "major": 23,
                "critical": 20
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.5",
        "downloads": 500,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 2,
                "minor": 2,
                "major": 3,
                "critical": 20
            },
            "security": {
                "unknown": 2,
                "minor": 2,
                "major": 3,
                "critical": 20
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.6",
        "downloads": 200,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 0,
                "minor": 0,
                "major": 0,
                "critical": 0
            },
            "security": {
                "unknown": 0,
                "minor": 0,
                "major": 0,
                "critical": 0
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.7",
        "downloads": 250,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 2,
                "minor": 2,
                "major": 3,
                "critical": 20
            },
            "security": {
                "unknown": 42,
                "minor": 22,
                "major": 23,
                "critical": 20
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.8",
        "downloads": 32,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 22,
                "minor": 22,
                "major": 13,
                "critical": 220
            },
            "security": {
                "unknown": 92,
                "minor": 42,
                "major": 63,
                "critical": 220
            }
        },
        "details_url": "http://xray/..."
    },
    {
        "version": "1.9",
        "downloads": 800,
        "status": "critical(15)",
        "violations": {
            "license": {
                "unknown": 32,
                "minor": 22,
                "major": 13,
                "critical": 420
            },
            "security": {
                "unknown": 22,
                "minor": 52,
                "major": 53,
                "critical": 320
            }
        },
        "details_url": "http://xray/..."
    }
];
export default class PackageController {

    constructor(JFrogSubRouter, $scope, $q, JFrogTableViewOptions,
                JFrogUIUtils, $rootScope, JFrogModal, NativeUIDescriptor) {
        this.subRouter = JFrogSubRouter.getActiveRouter();
        this.$stateParams = this.subRouter.params;
        this.$scope = $scope;
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
        this.nativeParent.stateController = this;
        this.limitOptions=['10', '15', '30'];
        let init = () => {
            this.initTable();

            this.subRouter.listenForChanges(['packageType', 'package', 'repos'], 'package', () => {
                this.getSummaryData();
                this.getPackageData().then(() => {
                    this.tableViewOptions.setData(this.package.versions);
                })
            }, this.$scope);
            this.getXrayData();
            this.summaryColumns = this.getSummaryColumns();

        }
        this.initConstants();
        this.getSummaryData();
        this.getPackageData().then(() => {
            init();
        }).catch(() => {
            this.package = {};
            init();
        })

        this.chartConfig = this.getmockCharConf();
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
        console.log("Getting package data!");


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
        additionalDaoParams.order = additionalDaoParams.order || 'desc';
        additionalDaoParams.with_xray = true;
        additionalDaoParams.$no_spinner = true;

        this.nativeParent.hostData.getPackage(additionalDaoParams).then((data) => {
            console.log("Data Arrived", data);
            this.graphData = data.results;
            this.chartConfig = this.getGraphObj();
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
            console.log("Returned Row", response);
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
                colors: {
                    security_critical: "#fbc02d",
                    security_minor: "#fef3d5",
                    security_unknown: "#eef5a7",
                    security_major: "#fdd981",
                    license_minor: "#dbe5f1",
                    license_unknown: "#6a68f1",
                    license_major: "#92b0d4",
                    license_critical: "#4a7cb8",
                    downloads: "#6317d3"
                },
                x: "x",
                json: _this.getFormattedData(),
                keys: {
                    // x: "name", // it's possible to specify 'x' when category axis
                    value: ["x", "security_critical", "security_major", "security_minor", "security_unknown", "license_critical", "license_major", "license_minor", "license_unknown", "downloads"]
                },
                types: {
                    downloads: "spline",
                    security_unknown: "bar",
                    security_minor: "bar",
                    security_major: "bar",
                    security_critical: "bar",
                    license_unknown: "bar",
                    license_minor: "bar",
                    license_major: "bar",
                    license_critical: "bar"
                },
                groups: [
                    [
                        "security_critical",
                        "security_major",
                        "security_minor",
                        "security_unknown"
                    ],
                    [
                        "license_critical",
                        "license_major",
                        "license_minor",
                        "license_unknown"
                    ]
                ],
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
                        multiline: false,
                        tooltip: true,
                        centered: false
                    },
                    height: 50
                }
            },
            subchart: {
                show: false
            },
            legend: {
                contents: {
                    bindto: "#bb-legend",
                    template: (title, color) => {
                        return `<span style="position:relative" class="legend-item bb-legend-item"> 
                        <span style="background-color: ${color}" ></span> ${this.removeChart(title)} </span>`
                    }
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
                console.log("Render DONE!");
                if (!this.legendRendered) {
                    this.groupLegends();
                }
            }
        }
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

        _.each(this.graphData, (val, index) => {
            let tmpObj = {};
            _.map(val.xrayViolations.violations.license, (v, k) => {
                tmpObj['license_' + k] = v
            })
            _.map(val.xrayViolations.violations.security, (v, k) => {
                tmpObj['security_' + k] = v
            })
            tmpObj.x = val.xrayViolations.version;
            if (val.downloads) {
                tmpObj.downloads = val.downloads;
            }
            finalDataArr.push(tmpObj)
        });


        console.log("Final data is", finalDataArr);
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
        console.log(toggleArr);
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
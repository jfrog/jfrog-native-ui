
import PackagesController from "./packages.controller";

export default class PackagesComponent {
    constructor() {
        this.template = require('./packages.view.html');
        this.controller = PackagesController;
        this.bindings = {
            packageTypes: '<',
            packages: '<',
            filters: '<',
            refreshPackages: '&?',
	        getPackageDownloadsCount: '&?',
        };
    }
}
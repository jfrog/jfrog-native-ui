import VersionController from "./version.controller";

export default class VersionComponent {
    constructor() {
        this.template = require('./version.view.html');
        this.controller = VersionController;
        this.bindings = {
            packageType: '<',
            packageName: '<',
            version: '<',
            refreshVersion: '&?',
	        isWithXray: '&?'
        };
    }
}
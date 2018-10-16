/**
 * those files will be loaded and concat by gulp
 * @type {{JS: string[], CSS: string[]}}
 */

const DIST_VENDORS = require('../node_modules/jfrog-ui-essentials/dist/vendor');
module.exports = {
    JS: [
	    ...DIST_VENDORS.ESSENTIALS_VENDORS.js.core
    ],
    JS_FOR_KARMA: [],
    CSS: [
	    ...DIST_VENDORS.ESSENTIALS_VENDORS.css.core
    ],
    FONTS: [
	    ...DIST_VENDORS.ESSENTIALS_VENDORS.fonts.core
    ],
    ASSETS: [
	    ...DIST_VENDORS.ESSENTIALS_VENDORS.assets.core,
    ]
};
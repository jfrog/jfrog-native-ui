export default class PackageGraphsComponent {
    constructor() {
        this.template = `<div ng-non-bindable id="xray-graphs"></div>`;
        this.controller = PackageGraphsController;
        this.bindings = {
            graphObject: '<',
        };
    }
}

class PackageGraphsController {
	constructor() {

	}

	$onInit() {
		const Comp = Vue.extend({
			props: ['graphObject'],
			template: `
			<div>
				<jf-graphs :options="graphObject"></jf-graphs>
			</div>`
		});
		const vm = new Comp({
			propsData: {
				graphObject: this.graphObject
			}
		});
		vm.$mount('#xray-graphs');
	}
}

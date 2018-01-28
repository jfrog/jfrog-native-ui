
angular.module('native_ui', [
    // Library modules
        'ui_components',
        'native_ui.templates',
        'directives',
        'services'
    ])
    .run(main);

/* @ngInject */
function main($httpBackend, $animate) {}


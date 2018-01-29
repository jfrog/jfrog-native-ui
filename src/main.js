
angular.module('jfrog.native.ui', [
    // Library modules
        'ui_components',
        'templates',
        'directives',
        'services'
    ])
    .run(main);

/* @ngInject */
function main($httpBackend, $animate) {}


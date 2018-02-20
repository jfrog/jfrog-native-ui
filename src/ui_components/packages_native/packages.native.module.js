import PackagesComponent from "./components/packages/packages.component";
import PackageComponent from "./components/package/package.component";
import PackagesNativeComponent from "./packages.native.component";
import VersionComponent from "./components/version/version.component";
import NativeFiltersDropdown from './components/filters_dropdown/native.filters.dropdown';

export default angular.module('packages.native', [])
        .component('packagesNativeComponent', new PackagesNativeComponent())
        .component('packagesComponent', new PackagesComponent())
        .component('packageComponent', new PackageComponent())
        .component('versionComponent', new VersionComponent())
        .component('nativeFiltersDropdown', new NativeFiltersDropdown());

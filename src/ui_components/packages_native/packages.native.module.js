import PackagesComponent from "./components/packages/packages.component";
import PackageComponent from "./components/package/package.component";
import PackagesNativeComponent from "./packages.native.component";
import VersionComponent from "./components/version/version.component";

export default angular.module('packages.native', [])
        .component('packagesNativeComponent', new PackagesNativeComponent())
        .component('packagesComponent', new PackagesComponent())
        .component('packageComponent', new PackageComponent())
        .component('versionComponent', new VersionComponent());

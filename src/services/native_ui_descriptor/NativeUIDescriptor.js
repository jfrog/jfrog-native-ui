import cellTemplates from '../../constants/cell.templates.constants';
import BaseDescriptor from './BaseDescriptor';

export default class NativeUIDescriptor extends BaseDescriptor{
    constructor(CommonDescriptor, DockerDescriptor, NpmDescriptor) {
        super();
        this.CommonDescriptor = CommonDescriptor;
        this.DockerDescriptor = DockerDescriptor;
        this.NpmDescriptor = NpmDescriptor;
        this.init();
    }

    init() {
        this.descriptor = {
            common: this.CommonDescriptor.getDescriptor(),
            typeSpecific: {
                docker: this.DockerDescriptor.getDescriptor(),
                npm: this.NpmDescriptor.getDescriptor(),
            }
        }
    }


}
export default class BaseModel {
    constructor(data) {}

    build() {
        return this;
    }

    static buildListOfModels(items) {
        return _.map(items, (item) => {
            return item.build();
        });
    }
}
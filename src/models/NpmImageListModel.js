/**
 * Created by tomere on 14/01/2018.
 */
import BaseModel from './BaseModel';
import NpmImageModel from './NpmImageModel';

export default class NpmImageListModel extends BaseModel {
    constructor(data) {
        super(data);
        if (data.results && data.results.length) {
            this.data = data.results.map((image) => {
                return new NpmImageModel(image);
            });
        }
        this.itemsCount = data.resultsCount;
    }
}
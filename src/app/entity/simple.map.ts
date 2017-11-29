/**
 * Created by admin on 2017/6/19.
 */
export class simpleMap {
    name: string = '';
    value: string = '';
}

export class simpleObject {
    id: string = '';
    text: string = '';
}

export interface serviceMap {
    name: string;
    value: string;
    key: string;
}
export const simpleMaps: Array<simpleMap> = [];



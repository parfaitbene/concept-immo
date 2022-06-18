import { Property } from "./property.model";

export class Category {
    id: number;
    name: string;
    image: any;
    num: number;
    properties: Property[] = [];
    
    constructor(id: number, name: string, image: any = null, num: number) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.num = num;
    }
}
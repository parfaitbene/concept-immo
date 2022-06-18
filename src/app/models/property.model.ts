import { Location } from "./location.model";

export class Property {
    id: string;
    name: string;
    adress: string;
    type: string;
    balance: number;
    expense: number;
    detail: any;
    image: any;

    locations: Location[] = [];
}
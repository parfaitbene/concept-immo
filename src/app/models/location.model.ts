import { Property } from "./property.model";
import { Service } from "./service.model";
import { Tenant } from "./tenant.model";

export class Location {
    id: number;
    property: Property;
    active: boolean;
    name: string;
    start: any;
    end: any;
    balance: number;
    tenant: Tenant;
    services: Service[] = [];
}
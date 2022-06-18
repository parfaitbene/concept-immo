export class Service {
    name: string;
    amount: number;
    date: string;
    service_type: string;

    constructor(name: string, amount: number, date: string, service_type: string) {
        this.name = name;
        this.amount = amount;
        this.date = date;
        this.service_type = service_type;
    }
}
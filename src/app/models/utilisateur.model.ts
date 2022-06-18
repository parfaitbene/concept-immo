export class Utilisateur {
    #system
    id: number;
    email: string;
    password: string;
    isAuth: boolean = false;
    image: any;
    partner_type: string;


    constructor() {
        this.email = 'Anonyme';
        this.isAuth = false;
    }
}

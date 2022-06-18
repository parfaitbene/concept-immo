import { AUTHENTIFICATION_FAIL_MSG } from 'src/app/services/app-config.service';

export class DefaultApiError {
    private status: number;
    private message: string;

    constructor(code: number, message: string) {
        this.status = code;
        this.message = message;
    }

    getCode(){ return this.status; }

    getMessage(){ return this.message; }
}

export class DefaultApiResponseParser {

    fetch(result: any): DefaultApiResponse{
        return new DefaultApiResponse(result.status, result.data || null, this.parseError(result));
    }

    parseError(result:{ status: number, message: string}) {
        try {
            //cas erreur
            return new DefaultApiError(result.status, result.message);
        }
        catch(error){ 
            //cas de sussès
            return new DefaultApiError(200, ""); 
        }
    }

    handleErrors(error: DefaultApiError): string {
      let message = '';

      try { //Erreur API
        return error.getMessage();
      }
      catch (error) { //Erreur HTTP
        return AUTHENTIFICATION_FAIL_MSG;
      }
    }
}

export class DefaultApiResponse {
    private status: number;
    private data: any;
    private error: DefaultApiError;
        
    constructor(status: number, data: any, error: DefaultApiError) {
        this.status = status;
        this.data = data;
        this.error = error;
    }

    getStatus(){ return this.status; }

    getData(){ return this.data; }

    isSuccess() { return (this.status == 200)? true : false; }

    getError(){ return this.error; }
}

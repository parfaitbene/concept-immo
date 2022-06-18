export const APP_SESSION_TIMEOUT = 15; // Minutes

export const ITEMS_BY_PAGE_NUMBER = 10;

export const AUTHENTIFICATION_FAIL_MSG = 'Service indisponible, veuillez réessayer plus tard.';

export class AppConfig {
  logo = "../../assets/img/logo.png";

  devise = "FCFA";

  api = {
    default: {
      url: "https://conceptimmo.advancecloud.org"
    }
  };
  
  PARTNER_TYPE = {
    PROPRIETAIRE: "landlord",
    LOCATAIRE: "tenant",
  }; 
}

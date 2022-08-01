import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { JSONRPCClient } from 'json-rpc-2.0';
import { Subject } from 'rxjs';
import { DefaultApiResponseParser } from '../models/api-response.model';
import { Location } from '../models/location.model';
import { Property } from '../models/property.model';
import { Service } from '../models/service.model';
import { Tenant } from '../models/tenant.model';
import { AppConfig } from './app-config.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    locationSubject = new Subject<Location>();
    private location: Location;
    private defaultApiResponseParser = new DefaultApiResponseParser();

    constructor(
        private appConfig: AppConfig,
        private loadCtrl: LoadingController,
    ){}

    emitLocationList() {
        this.locationSubject.next(this.location);
    }

    getLocationList() {
    return this.location;
    }

    getLocationListFromServer(uid: number) {
        return new Promise(
            async (resolve, reject) => {
              await (await (this.loadCtrl.create())).present();
              const client = new JSONRPCClient((jsonRPCRequest) =>
              fetch(this.appConfig.api.default.url+"/api/get/tenant_info/", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(jsonRPCRequest),
              }).then((response) => {
                this.loadCtrl.dismiss();
    
                if (response.status === 200) {
                  return response
                    .json()
                    .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
                } else if (jsonRPCRequest.id !== undefined) {
                  return Promise.reject(new Error(response.statusText));
                }
              })
            );
            client
                .request("/api/get/tenant_info", {'uid': uid})
                .then((result) => {
                  const response = this.defaultApiResponseParser.fetch(result);
    
                  if (response.isSuccess()) {
                    for (let index = 0; index < response.getData().length; index++) {
                        const data = response.getData()[index];
                        
                        const location: Location = new Location()
                        location.id = data.lease_id;
                        location.name = data.name;
                        location.balance = data.balance;

                        console.log(data)
                        data.services.forEach(
                            (s: any) => {
                                location.services.push(new Service(s.name, s.amount, s.date, s.service_type));
                            }
                        );
                        this.location = location;

                        this.emitLocationList();
                        resolve(this.location);
                    }
                  } else {
                    reject(response.getError());
                  }
                });
            }
        );
    }
}
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { JSONRPCClient } from 'json-rpc-2.0';
import { Subject } from 'rxjs';
import { DefaultApiResponseParser } from '../models/api-response.model';
import { Category } from '../models/category.model';
import { Location } from '../models/location.model';
import { Property } from '../models/property.model';
import { Tenant } from '../models/tenant.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryListSubject = new Subject<Category[]>();
  private categoryList: Category[] = [];
  private defaultApiResponseParser = new DefaultApiResponseParser();

  constructor(
    private userService: UserService,
    private loadCtrl: LoadingController,
    ) {
  }

  emitCategoryList() {
    this.categoryListSubject.next(this.categoryList);
  }

  getCategoryList() {
    return this.categoryList;
  }

  getCategoryListFromServer(uid: number) {
    return new Promise(
        async (resolve, reject) => {
          await (await (this.loadCtrl.create())).present();
          this.categoryList = [];

          const client = new JSONRPCClient((jsonRPCRequest) =>
          fetch("https://conceptimmo.advancecloud.org/api/get/landlord_info/", {
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
            .request("/api/get/landlord_info", {'uid': uid})
            .then((result) => {
              const response = this.defaultApiResponseParser.fetch(result);

              if (response.isSuccess()) {
                const data = response.getData();
                for (let index = 0; index < response.getData().length; index++) {
                  const category = new Category(data[index].categ_id, data[index].category, null, data[index].num);
                  this.categoryList.push(category);

                  data[index].properties.forEach(property_data => {
                    let property: Property = new Property();
                    property.id = property_data.id;
                    property.name = property_data.name;
                    property.adress = property_data.adress;
                    property.type = property_data.type;
                    property.balance = property_data.balance;
                    property.expense = property_data.expense;
                    property.detail = property_data.detail;
                    property.image = property_data.image;
                    
                    property_data.lease_detail.forEach(lease => {
                      let location = new Location()
                      location.active = lease.active;
                      location.name = lease.name;
                      location.start = lease.start;
                      location.end = lease.end;
                      location.balance = lease.balance;
                      location.tenant = new Tenant(lease.tenant);
                      location.property = property;
                      property.locations.push(location);
                    });

                    category.properties.push(property)
                  });
                }
                this.emitCategoryList();
                
                resolve(this.categoryList);
              } else {
                reject(response.getError());
              }
            });
        }
    );
  }
}

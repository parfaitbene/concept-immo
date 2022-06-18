import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from './app-config.service';
import { DefaultApiResponseParser } from '../models/api-response.model';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { LoadingController } from '@ionic/angular';
import { JSONRPC, JSONRPCClient, JSONRPCRequest } from "json-rpc-2.0";

@Injectable()
export class UserService{
    private user: Utilisateur = new Utilisateur();
    private defaultApiResponseParser = new DefaultApiResponseParser();
    userSubject = new Subject<Utilisateur>();
    usagersCount: number = 0;

    constructor(private appConfig: AppConfig,
                private httpClient: HttpClient,
                private loadCtrl: LoadingController,
                private router: Router,
                private storageService: StorageService
                ){
                }


  buildUSerFromJSON(user: Utilisateur, data: any){
    user.id = data.id || user.id;
    user.email = data.email || user.email;
    user.id = data.user || data.user;
    user.isAuth = data.isAuth || user.isAuth;
    user.image = data.image || user.image;

    return user;
  }

  getUser(){ return this.user; }

  setUser(user: Utilisateur){
    this.user = user;
    this.storageService.set('user', JSON.stringify(this.user));
    this.emitUser(); 
  }

  sendToken(token){
    return this.httpClient.post<any>(this.appConfig.api.default.url+"/token/validate/", {recaptcha: token})
  }

  emitUser(){
    this.userSubject.next(this.user);
  }

  signIn(email: string, password: string, partner_type: string){
      return new Promise(
          (resolve, reject) => {
            const client = new JSONRPCClient((jsonRPCRequest) =>
            fetch("https://conceptimmo.advancecloud.org/api/authen/", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(jsonRPCRequest),
            }).then((response) => {
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
              .request("/api/authen", {'email': email, 'password': password, 'partner_type': partner_type})
              .then((result) => {
                const response = this.defaultApiResponseParser.fetch(result);

                if (response.isSuccess()) {
                  this.user = new Utilisateur();
                  this.user.id = result.user;
                  this.user.email = email;
                  this.user.partner_type = partner_type;
                  this.user.image = result.image
                  this.user.isAuth = true;
                  this.storageService.set('user', JSON.stringify(this.user));
                  this.emitUser();
                  
                  resolve(this.user);
                } else {
                  reject(response.getError());
                }
              });
          }
      );
  }

}

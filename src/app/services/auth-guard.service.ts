import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import { UserService } from './user.service';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../auth/login/login.component';

@Injectable()
export class AuthGuard implements CanActivate {
    authStatus: boolean;
    authStatusSubscription: Subscription;
    
    constructor(private userService: UserService, 
                private router: Router,
                public modalController: ModalController
                ){
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.authStatusSubscription = this.userService.userSubject.subscribe(
            (user: Utilisateur) => {
                this.authStatus = user.isAuth;
            }
        );
        this.userService.emitUser();

        if(this.authStatus){
            return true;
        }else{
            this.presentModal();
        }
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: LoginComponent
          });
        await modal.present();
    }
}
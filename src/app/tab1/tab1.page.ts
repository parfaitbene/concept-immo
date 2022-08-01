import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public actionSheetController: ActionSheetController, private userService: UserService, private router: Router) {}

  async onProfileClick(){
      const actionSheet = await this.actionSheetController.create({
        header: 'Actions',
        buttons: [{
          text: 'Déconnexion',
          role: 'destructive',
          icon: 'log-out-outline',
          handler: () => {
            this.userService.signOut();
            this.router.navigate(['login']);
          }
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await actionSheet.present();
  }
}

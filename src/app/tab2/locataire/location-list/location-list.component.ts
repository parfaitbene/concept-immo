import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DefaultApiError, DefaultApiResponseParser } from 'src/app/models/api-response.model';
import { Location } from 'src/app/models/location.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { AppConfig } from 'src/app/services/app-config.service';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  location: Location;
  locationSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
    public modalController: ModalController,
    private loadCtrl: LoadingController,
    private appConfig: AppConfig,
    private locatoinService: LocationService
  ) {}

  ngOnInit(): void {
    this.locatoinService.getLocationListFromServer(this.userService.getUser().id);

    this.locationSubscription = this.locatoinService.locationSubject.subscribe(
      (location: Location) => {
        this.location = location;
      }, 
      async (error: DefaultApiError) => {
        const toast = await this.toastCtrl.create({
          message: (new DefaultApiResponseParser()).handleErrors(error),
          duration: 5000
        });
        toast.present();
      }
    );
    this.locatoinService.emitLocationList();
  }

}

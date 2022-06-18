import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DefaultApiError, DefaultApiResponseParser } from '../models/api-response.model';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { TabService } from '../services/tab.service';
import { UserService } from '../services/user.service';
import { PropertyListComponent } from './property/property-list/property-list.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private userService: UserService,
    public modalController: ModalController,
    private router: Router,
    private tabService: TabService
    ) {}

  ngOnInit(): void {
    this.categoryService.getCategoryListFromServer(this.userService.getUser().id).then(
      (categories: Category[]) => {
        this.categories =  categories;
      },
      async (error: DefaultApiError) => {
        const toast = await this.toastCtrl.create({
          message: (new DefaultApiResponseParser()).handleErrors(error),
          duration: 5000
        });
        toast.present();
      }
    );
  }

  ionViewWillEnter(){
    this.tabService.navSubject.next(false);
  }

  getImage(blob: string){
    return 'data:image/png;base64,'+ blob;
  }

  async onCategoryClick(category: Category) {
    this.router.navigate(['tabs', 'tab2', 'property-list', category.id])
  }
}

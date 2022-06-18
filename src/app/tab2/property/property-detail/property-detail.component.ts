import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category.model';
import { Property } from 'src/app/models/property.model';
import { CategoryService } from 'src/app/services/category.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss'],
})
export class PropertyDetailComponent implements OnInit {
  category: Category;
  property: Property;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private tabService: TabService
  ) { }

  ngOnInit() {
    if(
      !this.route.snapshot.params['idCategory'] || this.route.snapshot.params['idCategory'] == undefined || 
      !this.route.snapshot.params['idProperty'] || this.route.snapshot.params['idProperty'] == undefined || 
      !this.categoryService.getCategoryList().length
      ){ 
        this.router.navigate(['tabs', 'tab2']); 
      }
    this.category = this.categoryService.getCategoryList().find((c) => { return c.id == this.route.snapshot.params['idCategory']});
    this.property = this.category.properties.find(p => { return p.id == this.route.snapshot.params['idProperty']; });

    this.tabService.navSubject.next(true);
  }

  getNetResult() {
    return this.property.balance - this.property.expense;
  }

  getColor(status: boolean) {
    return (status == false)? 'danger' : 'success';
  }
  
  getImage(blob: string){
    return 'data:image/png;base64,'+ blob;
  }
}

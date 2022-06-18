import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category.model';
import { Property } from 'src/app/models/property.model';
import { CategoryService } from 'src/app/services/category.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
})
export class PropertyListComponent implements OnInit {
  category: Category;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private tabService: TabService
  ) { }

  ngOnInit() {
    if(!this.route.snapshot.params['idCategory'] || this.route.snapshot.params['idCategory'] == undefined || !this.categoryService.getCategoryList().length){ 
      this.router.navigate(['tabs', 'tab2']); 
    }
    this.category = this.categoryService.getCategoryList().find((c) => { return c.id == this.route.snapshot.params['idCategory']});
    this.tabService.navSubject.next(true);
  }
  
  getImage(blob: string){
    return 'data:image/png;base64,'+ blob;
  }
  
  onPropertyClick(property: Property) {
    this.router.navigate(['tabs', 'tab2', 'property-detail', this.category.id, property.id])
  }
}

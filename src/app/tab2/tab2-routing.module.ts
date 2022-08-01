import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './locataire/location-list/location-list.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { Tab2Page } from './tab2.page';
import { AuthGuard } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
  {
    path: 'property-list/:idCategory',
    component: PropertyListComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'property-detail/:idCategory/:idProperty',
    component: PropertyDetailComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'location-list',
    component: LocationListComponent,
    canActivate: [AuthGuard] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}

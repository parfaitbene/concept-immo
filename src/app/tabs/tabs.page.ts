import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabService } from '../services/tab.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  showTabs: boolean = false;
  tabSubscription: Subscription;

  constructor(
    private tabService: TabService
  ) {}

  ngOnInit(): void {
    this.tabSubscription = this.tabService.navSubject.subscribe(
      (val: boolean) => { this.showTabs = val; }
    );
    this.tabService.navSubject.next(this.showTabs);
  }

  ngOnDestroy(): void {
    if(this.tabSubscription){ this.tabSubscription.unsubscribe(); }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
  };

  constructor(public router: Router) { }

  ngOnInit() {}

  onHomePage() {
    this.router.navigate(['login']);
  }

}

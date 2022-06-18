import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppConfig } from 'src/app/services/app-config.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  myForm: FormGroup;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    public modalController: ModalController,
    private loadCtrl: LoadingController,
    private appConfig: AppConfig
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.required]],
    });
  }

  async onForgotPassword() {
  }

  dismissModal(){
    this.modalController.dismiss();
  }

}

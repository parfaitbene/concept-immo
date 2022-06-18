import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DefaultApiError, DefaultApiResponseParser } from 'src/app/models/api-response.model';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { AppConfig } from 'src/app/services/app-config.service';
import { UserService } from 'src/app/services/user.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  authStatus: boolean;
  authStatusSubscription: Subscription;
  pwdInputType: string = 'password';
  pwdIconName: string = 'eye';
  partner_type: string = "";
  proprietaireChoice: boolean = true;
  locataireChoice: boolean = false;
  
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
    this.partner_type = this.appConfig.PARTNER_TYPE.PROPRIETAIRE;
    this.initForm();

    this.authStatusSubscription = this.userService.userSubject.subscribe(
    (user: Utilisateur) => {
      this.authStatus = user.isAuth;
    },
    async (error: DefaultApiError) => {
      const toast = await this.toastCtrl.create({
        message: (new DefaultApiResponseParser()).handleErrors(error),
        duration: 5000
      });
      toast.present();
    });
    this.userService.emitUser();


    if(this.authStatus || this.userService.getUser().isAuth){ this.router.navigate(['tabs', 'tab1']); }
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onProprietaireClick() {
    this.proprietaireChoice = true;
    this.locataireChoice = false;
    this.partner_type = this.appConfig.PARTNER_TYPE.PROPRIETAIRE;
  }
  
  onLocataireClick() {
    this.proprietaireChoice = false;
    this.locataireChoice = true;
    this.partner_type = this.appConfig.PARTNER_TYPE.LOCATAIRE;
  }

  async onSignIn() {
    const loader = await this.loadCtrl.create({
      message: "Connexion..."
    });
    loader.present();

    let formValue = this.myForm.value;

    this.userService.signIn(formValue["email"], formValue["password"], this.partner_type).then(
      async (user: Utilisateur) => {
        loader.dismiss();
        this.authStatus = user.isAuth;
        const toast = await this.toastCtrl.create({
          message: "Connexion réussie",
          duration: 5000
        });
        toast.present();
        if(user.partner_type == this.appConfig.PARTNER_TYPE.PROPRIETAIRE){
          this.router.navigate(['tabs', 'tab2']);
        }
        else {
          this.router.navigate(['tabs', 'tab2', 'location-list']);
        }
      },
      async (error: DefaultApiError) => {
        loader.dismiss();
        try{
          const toast = await this.toastCtrl.create({
            message: error.getMessage(),
            duration: 5000
          });
          toast.present();
        }catch(e){
          const toast = await this.toastCtrl.create({
            message: error.getMessage(),
            duration: 5000
          });
          toast.present(); 
        }
      }
    );
  }

  onTogglePassword() {
    this.pwdInputType = (this.pwdInputType == 'password')? 'text' : 'password';
    this.pwdIconName = (this.pwdInputType == 'password')? 'eye' : 'eye-off';
  }

  getPasswordType(){
    return this.pwdInputType;
  }
  
  getIconName() {
    return this.pwdIconName;
  }

  async onForgotPasswordFunc() {
    await (await this.modalController.create({
      component: ForgetPasswordComponent
    })).present();
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}

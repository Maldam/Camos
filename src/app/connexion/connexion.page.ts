import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {
  
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    public toastController: ToastController,
    public afAuth: AngularFireAuth
  ) { }

  login() {
  this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
  .then(auth => {
    console.log('utilisateur connecté');
  })
  .catch(err => {
    console.log('Erreur: ' + err);
    this.errorMail();
  });
  this.loginData = {
    email: '',
    password: ''
  };
}

async errorMail() {
  const toast = await this.toastController.create({
    message: 'Email ou mot de passe incorrect',
    duration: 2000,
    position: 'top'
  });
  toast.present();
}

signUp() {
  this.afAuth.auth.createUserWithEmailAndPassword(this.loginData.email, this.loginData.password)
  .then(auth => {
    console.log('utilisateur connecté');
  })
  .catch(err => {
    console.log('Erreur: ' + err);
    this.errorMail();  
  });
  this.loginData = {
    email: '',
    password: ''
  }
}
  ngOnInit() {
  }

}

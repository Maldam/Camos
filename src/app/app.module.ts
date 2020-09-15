import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './app.firebase.config';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { ProduitsService } from './services/produits.service';
import { ClientsService } from './services/clients.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { ConnexionService } from './services/connexion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GardeConnexionService } from './services/garde-connexion.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { CommandesService } from './services/commandes.service';
import { ModalClientPageModule } from './modals/modal-client/modal-client.module';
import { ModalProduitPageModule } from './modals/modal-produit/modal-produit.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ModalCommandesPageModule } from './modals/modal-commandes/modal-commandes.module';
import { CoordonneesService } from './services/coordonnees.service';
import { ModalListeContactsPageModule } from './modals/modal-liste-contacts/modal-liste-contacts.module';
import { ModalContactPageModule } from './modals/modal-contact/modal-contact.module';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    ModalClientPageModule,
    ModalProduitPageModule,
    ModalCommandesPageModule,
    ModalListeContactsPageModule,
    ModalContactPageModule
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Network,
    Dialogs,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ProduitsService,
    ClientsService,
    ConnexionService,
    CommandesService,
    CoordonneesService,
    AngularFirestore,
    GardeConnexionService,
    CallNumber,
    SMS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


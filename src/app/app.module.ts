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
import { ListeProduitsService } from './services/liste-produits.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { recupererProduitService } from './services/recuperer-produit.service';
import { ConnexionService } from './services/connexion.service';
import { FormBuilder } from '@angular/forms';


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
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ListeProduitsService,
    recupererProduitService,
    ConnexionService,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
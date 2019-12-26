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

export const firebaseConfig = {
  apiKey: "AIzaSyAw8dxx8u8foZJ8wlqyyIM3zFTrfd7k5Yg",
  authDomain: "camos-80386.firebaseapp.com",
  databaseURL: "https://camos-80386.firebaseio.com",
  projectId: "camos-80386",
  storageBucket: "camos-80386.appspot.com",
  messagingSenderId: "558532490747",
  appId: "1:558532490747:web:bc4955d536dc514155875e",
  measurementId: "G-NMRR2YNV3T"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
//import { ProduitModele } from '../modeles/produit.modele';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {
  
  ngOnInit() {
  }
}
import { Component, OnInit } from '@angular/core';
import { ListeProduitsService } from '../services/liste-produits.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Action } from 'rxjs/internal/scheduler/Action';


@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  produits = [];
  liste

  constructor(
    public listeProduits: ListeProduitsService

  ) { 
    this.recupProduit()
  }


  recupProduit() {
        this.listeProduits.bd.list('Produits/').snapshotChanges(['child_added']).subscribe(actions =>{
      this.produits = [];
      actions.forEach(action =>{
        console.log('nom:' + action.payload.exportVal().nom)
        this.produits.push({
          nom: action.payload.exportVal().nom
        })
      });
    })
  }

  ngOnInit() {
  }

}

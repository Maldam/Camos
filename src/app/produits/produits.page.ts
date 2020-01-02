import { Component, OnInit } from '@angular/core';
import { ListeProduitsService } from '../services/liste-produits.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';
import * as firebase from 'firebase';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  produits = [];
  
  someTextUrl ="";

  imageVide ='https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  image = this.imageVide;
  nom = "";


  constructor(
    public listeProduits: ListeProduitsService,
    
  ) { 
    this.recupProduit();
  }

  recupProduit() {

      this.listeProduits.bd.list('Produits/').snapshotChanges(['child_added']).subscribe(actions =>{
      this.produits = [];
      actions.forEach(action =>{
        this.produits.push({
          nom: action.payload.exportVal().nom,
          image: 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F'+ action.payload.exportVal().nom +'.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          })
          
      });
      

    })
  }  
  ngOnInit() {
  }
}

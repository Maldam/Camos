import { Component, OnInit } from '@angular/core';
import { ListeProduitsService } from '../services/liste-produits.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';
import * as firebase from 'firebase';
import { Target } from '@angular/compiler';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  produits = [];
  
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
          image: this.AfficherImage(action.payload.exportVal().nom)
          })
      });
    })
  }
  imageDefaut(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
}
  
  AfficherImage(nom : String){
    
    var test = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F'+ nom +'.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5';
    var test1 = 'https://farm6.staticflickr.com/5569/14749174189_169427d3b9_b.jpg'+'' 
    return test
  
  }
  

  
  ngOnInit() {
  }
}

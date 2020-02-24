import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AfficherProduitPage } from '../afficher-produit/afficher-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import * as firebase from 'firebase/app';
import { Subject, Observable } from 'rxjs';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()
export class ProduitsService {
  private referencesProduit: any;
  produits = [];
  produit: any;

  constructor(
    public bd: AngularFireDatabase,
    public afSG: AngularFireStorage,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,

  ) { }
  obtenirListeProduits() {
    this.referencesProduit = this.bd.list('Produits/')
    return this.referencesProduit
  }
  ajoutProduit(produit: AjouterProduitPage) {
    this.referencesProduit = this.bd.list('Produits/')
    return this.referencesProduit.push(produit)
  }

  createTask(value: any) {
    return new Promise<any>((resolve, reject) => {
      this.bd.list('Produits/').push(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
    // return this.referencesProduit = this.bd.list('Produits/').push(value)

  }

  getTasks() {
    return this.referencesProduit = this.bd.list('Produits/').snapshotChanges(['child_added', 'child_removed'])
  }
  updateTask(taskKey: any, value: any) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  deleteTask(taskKey: any, nom: any) {
    this.bd.list('Produits').remove(taskKey)
    
    firebase.storage().ref().child('Produits/' + nom + '.jpg').delete().then(() => {
    })
    .catch(error => console.log("pas d'image"));
}   
  
  recupProduit(produit: any) {
    this.produit = produit
    //this.nom = produit.nom;
  }
  renvoyerProduit() {
    return this.produit
  }
}

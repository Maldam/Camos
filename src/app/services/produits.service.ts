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
    private referencesProduit;
    private snapshotChangesSubscription: any
    private test;
    private test2;
    produits = [];
    produit;
    nom;


    constructor(
        public bd: AngularFireDatabase,
        public afSG: AngularFireStorage,
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        
        ) {}
    obtenirListeProduits() {
    this.referencesProduit = this.bd.list('Produits/')
    return this.referencesProduit
    }
    ajoutProduit(produit: AjouterProduitPage) {
      this.referencesProduit = this.bd.list('Produits/')
        return this.referencesProduit.push(produit)
    }

createTask(value){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('Produits').add(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
    // return this.referencesProduit = this.bd.list('Produits/').push(value)
        
  }

  getTasks(){
   return this.referencesProduit = this.bd.list('Produits/').snapshotChanges(['child_added'])
}
updateTask(taskKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  deleteTask(taskKey){
    this.bd.list('Produits').remove(taskKey);
  } 
  recupProduit(produit){
    this.produit = produit
    console.log(produit.key, produit.nom)
    console.log(produit.quantite, produit.prix)
    //this.nom = produit.nom;
  }
  renvoyerProduit(){
    console.log(this.produit)
    return this.produit
  }
}

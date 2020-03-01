import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProduitModele } from '../modeles/produit.modele';
import { Observable } from 'rxjs';

@Injectable()
export class ProduitsService {
  constructor(
    public bd: AngularFireDatabase,
    public afSG: AngularFireStorage,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,

  ) { }
  public createProduit(value: any) {
    return new Promise<any>((resolve, reject) => {
      this.bd.list('Produits/').push(value)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getProduits(): Observable<SnapshotAction<unknown>[]> {
    return this.bd.list('Produits/').snapshotChanges(['child_added', 'child_removed', 'child_changed'])
  }
  public updateProduit(produit: ProduitModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.bd.list('Produits').update(produit.key, { nom: produit.nom, quantite: produit.quantite, prix: produit.prix }).then(
        res => resolve(res),
        err => reject(err)
      )
      firebase.storage().ref().child('Produits/' + produit.nom + '.jpg')
    })
  }
  public deleteProduit(produit: ProduitModele): void {
    this.bd.list('Produits').remove(produit.key)
    firebase.storage().ref().child('Produits/' + produit.nom + '.jpg').delete().then(() => {
    })
      .catch(error => console.log("Pas d'image"));
  }
}

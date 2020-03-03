import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProduitModele } from '../modeles/produit.modele';
import { Observable } from 'rxjs';

@Injectable()
export class ProduitsService {
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
  ) { }
  public createProduit(produit: ProduitModele) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Produits/').push(produit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getProduits(): Observable<Array<ProduitModele>> {
    return new Observable<Array<ProduitModele>>(observer => {
      this.angularFireDatabase.list('Produits/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(produitsRecus => {
        let produits: Array<ProduitModele> = new Array<ProduitModele>();
        produitsRecus.forEach(produitRecus => {
          let produit: ProduitModele = new ProduitModele();
          produit.key = produitRecus.key,
            produit.nom = produitRecus.payload.exportVal().nom,
            produit.quantite = produitRecus.payload.exportVal().quantite,
            produit.prix = produitRecus.payload.exportVal().prix,
            produit.imageURL = produitRecus.payload.exportVal().imageURL
          produits.push(produit);
          observer.next(produits);
        })
      });
    });
  }
  public updateProduit(produit: ProduitModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Produits/').update(produit.key, { nom: produit.nom, quantite: produit.quantite, prix: produit.prix }).then(
        res => resolve(res),
        err => reject(err)
      )
      //firebase.storage().ref().child('Produits/' + produit.nom + '.jpg')
    })
  }
  public deleteProduit(produit: ProduitModele): void {
    this.angularFireDatabase.list('Produits/').remove(produit.key).then(() => {
      if (produit.imageURL == undefined) {
      } else {
        this.angularFireStorage.storage.refFromURL(produit.imageURL).delete();
      }
    }).catch(error => console.log(error));
  }
}



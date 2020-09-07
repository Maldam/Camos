import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProduitModele } from '../modeles/produit.modele';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable()
export class ProduitsService {
  public produit: ProduitModele = new ProduitModele();
  public imageVide: string = this.produit.imageURL;
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public produits2: Array<ProduitModele>;
  public image: string;
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    private camera: Camera,
  ) {
    this.getProduits().subscribe(produits => {
      this.produits2 = produits;
    });
  }
  public createProduit(produit: ProduitModele) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Produits/').push(produit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public ajouterImage(nomImage: string, image: string) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireStorage.ref(nomImage).putString(image, 'data_url')
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getProduits(): Observable<Array<ProduitModele>> {
    return new Observable<Array<ProduitModele>>(observer => {
      this.angularFireDatabase.list('Produits/').snapshotChanges(['child_added', 'child_removed', 'child_changed', 'child_moved']).subscribe(produitsRecus => {
        let produits: Array<ProduitModele> = new Array<ProduitModele>();
        produitsRecus.forEach(produitRecus => {
          let produit: ProduitModele = new ProduitModele();
          produit.key = produitRecus.key,
          produit.codeProduit = produitRecus.payload.exportVal().codeProduit,
            produit.nom = produitRecus.payload.exportVal().nom,
            produit.quantite = produitRecus.payload.exportVal().quantite,
            produit.prix = produitRecus.payload.exportVal().prix,
            produit.imageURL = produitRecus.payload.exportVal().imageURL
            produit.categorie = produitRecus.payload.exportVal().categorie
            produit.type = produitRecus.payload.exportVal().type
            produit.TVA = produitRecus.payload.exportVal().TVA
          produits.push(produit);
          observer.next(produits);
        })
      });
    });
  }
  public updateProduit(produit: ProduitModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Produits/').update(produit.key, { 
        codeProduit: produit.codeProduit,
        nom: produit.nom, 
        quantite: produit.quantite, 
        prix: produit.prix, 
        imageURL: produit.imageURL,
        categorie: produit.categorie,
        type: produit.type,
        TVA: produit.TVA
      }).then(
        res => resolve(res),
        err => reject(err),
      )
      //firebase.storage().ref().child('Produits/' + produit.nom + '.jpg')
    })
  }
  public deleteProduit(produit: ProduitModele): void {
    this.angularFireDatabase.list('Produits/').remove(produit.key).then(() => {
      if (produit.imageURL == "") {
      } else {
        if (produit.imageURL == this.imageVide) {
        } else {
          this.deleteImage(produit)
        }
      }
    }).catch(error => console.log(error));
  }
  public numeroIndex(nomProduit: any) {
    try {
      return this.produits2.findIndex(x => x.nom === nomProduit)
    } catch (error) {
      return -1
    }
  }
  public deleteImage(produit: ProduitModele): void {
    this.angularFireStorage.storage.refFromURL(produit.imageURL).delete();
    //this.angularFireStorage.ref("Produits/test.jpg").delete();
  }
  public async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  public async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }
  public createCategorieProduit(CategorieProduit: ProduitModele) {
    console.log("ici")
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('CategoriesProduits/'+CategorieProduit.type).push(CategorieProduit.categorie)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getCategoriesProduits(typeProduit): Observable<Array<any>> {
    return new Observable<Array<ProduitModele>>(observer => {
    this.angularFireDatabase.list('CategoriesProduits/'+typeProduit).snapshotChanges(['child_added', 'child_removed', 'child_changed', 'child_moved']).subscribe(produitsRecus => {
      let categoriesProduits: Array<any> = new Array<any>();
      produitsRecus.forEach(produitRecus => {
        let categorieProduit: any = null;
        categorieProduit = produitRecus.payload.val()
        categoriesProduits.push(categorieProduit);
      })
      observer.next(categoriesProduits);
    });
  });
  }
}
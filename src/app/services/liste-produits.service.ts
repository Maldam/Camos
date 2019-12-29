import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';


@Injectable()
export class ListeProduitsService {

    private listeProduitRef = this.bd.list<AjouterProduitPage>('Produits/')

    constructor(public bd: AngularFireDatabase) {

    }
    getListeProduits() {
        return this.listeProduitRef
    }
    ajoutProduit(produit: AjouterProduitPage) {
        return this.listeProduitRef.push(produit)
    }
}
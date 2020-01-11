import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';
import { AngularFireStorage } from '@angular/fire/storage';
import { AfficherProduitPage } from '../afficher-produit/afficher-produit.page';

@Injectable()
export class ProduitsService {
    listeProduits: AfficherProduitPage[] = [];
    private listeProduitRef = this.bd.list<AjouterProduitPage>('Produits/')

    constructor(
        public bd: AngularFireDatabase,
        public afSG: AngularFireStorage,
        ) {}
    getListeProduits() {
        return this.listeProduitRef
    }
    ajoutProduit(produit: AjouterProduitPage) {
        return this.listeProduitRef.push(produit)
    }
}
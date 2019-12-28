import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AjouterProduitPage } from '../ajouter-produit/ajouter-produit.page';

@Injectable()
export class ListeProduitService{

    private listeProduitRef = this.bd.list<AjouterProduitPage>('liste-produits')
    
    constructor(public bd: AngularFireDatabase){

    }
    getListeProduits(){
        return this.listeProduitRef
    }
    ajoutProduit(produit: AjouterProduitPage){
        return this.listeProduitRef.push(produit)


    }
}
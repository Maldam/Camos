import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProduitsPage } from '../produits/produits.page';

@Injectable()
export class ListeProduitService{

    private listeProduitRef = this.bd.list<ProduitsPage>('liste-produits')
    
    constructor(public bd: AngularFireDatabase){

    }
    getListeProduits(){
        return this.listeProduitRef
    }
    ajoutProduit(produit: ProduitsPage){
        return this.listeProduitRef.push(produit)


    }
}
import { Injectable } from '@angular/core';
import { ListeProduitsService } from './liste-produits.service';


@Injectable()
export class recupererProduitService {
    // produits = [];
    // constructor(
    //     public listeProduits: ListeProduitsService,
    //     ) {}

    // recupererProduit() {
    //     this.listeProduits.bd.list('Produits/').snapshotChanges(['child_added']).subscribe(actions =>{
    //         this.produits = [];
    //         actions.forEach(action =>{
    //             this.produits.push({
    //                 nom: action.payload.exportVal().nom,         
    //                 image: this.afficherImage(action.payload.exportVal().nom)
    //         })
    //     });
    //   })
    // }

    // afficherImage(nom : String){
    //     var test = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F'+ nom +'.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5';
    //     var test1 = 'https://farm6.staticflickr.com/5569/14749174189_169427d3b9_b.jpg'+'' 
    //     return test
    // }
}
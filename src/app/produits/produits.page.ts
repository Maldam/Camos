import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  produits = [];
  
  constructor(
    public listeProduits: ProduitsService,
  ) { 
    this.recupererProduit();
  }

  recupererProduit() {
      this.listeProduits.bd.list('Produits/').snapshotChanges(['child_added']).subscribe(actions =>{
      this.produits = [];
      actions.forEach(action =>{
        this.produits.push({
          nom: action.payload.exportVal().nom,          
          image: this.afficherImage(action.payload.exportVal().nom)
          })
      });
    })
  }
  
  imageDefaut(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
}
  afficherImage(nom : String){
    var image = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F'+ nom +'.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5';
    //var test1 = 'https://farm6.staticflickr.com/5569/14749174189_169427d3b9_b.jpg'+'' 
    return image
  }
 
  ngOnInit() {
  }
}
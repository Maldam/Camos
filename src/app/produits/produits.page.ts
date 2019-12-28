import { Component, OnInit } from '@angular/core';
import { ListeProduitService } from '../services/liste-produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
    
  produit = {
    nom:"",
    quantite: undefined,
    prix: undefined,
  }

  
  constructor(private listeProduit: ListeProduitService ) {
  
  }

  ajoutProduit(produit: ProduitsPage){
    this.listeProduit.ajoutProduit(produit).then(ref => {})

  }

  ngOnInit() {
  }

}

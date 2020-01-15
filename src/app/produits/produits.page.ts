import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  produits: any;
  key: any;
  nom: string;
  prix: number;
  quantite: number;
  
  constructor(
    public produitsService: ProduitsService,
    public route: Router
  ) { 
  }
  getProduits(){
  this.produitsService.getTasks()
  }
  
  imageDefaut(event) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
}
  afficherImage(nom : String){
    var image = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F'+ nom +'.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5';    return image
  }
  versVueProduit(produit){
    this.route.navigate(['/afficher-produit', produit.nom]);
    this.produitsService.recupProduit(produit)
  }
   
  ngOnInit() {
    this.produitsService.getTasks().subscribe(actions =>{
      this.produits = [];
      actions.forEach(action =>{
        this.produits.push({
          //id: action.payload.exportVal().id,
          key: action.key,
          nom: action.payload.exportVal().nom,
          quantite: action.payload.exportVal().quantite,  
          prix: action.payload.exportVal().prix,           
          image: this.afficherImage(action.payload.exportVal().nom)
          })
          //console.log(action.key)
      });
    })
}
}
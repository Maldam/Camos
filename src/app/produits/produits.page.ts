import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Router } from '@angular/router';
import { ProduitModele } from '../modeles/produit.modele';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  constructor(
    public produitsService: ProduitsService,
    public route: Router
  ) {
  }
  getProduits() {
    this.produitsService.getProduits()
  }
  imageDefaut(event: any) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  }
  afficherImage(nom: String) {
    var image = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'; 
    return image
  
        // return this.produitsService.afs.collection('Produit', ref => ref.where('Nom', '>=', nom)
        // .where('Nom', '<=', nom + '\uf8ff'))
        // .snapshotChanges()
    
  
  
  }
  versVueProduit(produit: ProduitModele) {
    this.route.navigate(["afficher-produit"], { state: { data: produit}});
  }
  ngOnInit() {
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = new Array
      produits.forEach(produitRecus => {
        let produit: ProduitModele =  new ProduitModele();
        produit.key = produitRecus.key,
        produit.nom = produitRecus.payload.exportVal().nom,
        produit.quantite = produitRecus.payload.exportVal().quantite,
        produit.prix = produitRecus.payload.exportVal().prix,
        produit.image = this.afficherImage(produitRecus.payload.exportVal().nom)
        this.produits.push(produit);
        })
      });
  }
}
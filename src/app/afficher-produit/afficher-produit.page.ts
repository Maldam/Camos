import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ProduitModele } from '../modeles/produit.modele';

@Component({
  selector: 'app-afficher-produit',
  templateUrl: './afficher-produit.page.html',
  styleUrls: ['./afficher-produit.page.scss'],
})
export class AfficherProduitPage implements OnInit {

  produit = {
    nom: "",
    quantite: undefined,
    prix: undefined,

  }
  constructor(public produitsService: ProduitsService) {
this.produit.nom = this.produitsService.obtenirListeProduits()
//console.log(this.produit.nom)

   }
              
  ngOnInit() {
    this.produit = this.produitsService.renvoyerProduit()
    console.log(this.produit.nom)
    console.log(this.produit.quantite)
    console.log(this.produit.prix)
  }
}


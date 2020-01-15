import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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
  constructor(public produitsService: ProduitsService,
    public navCtrl: NavController) {
    this.produit.nom = this.produitsService.obtenirListeProduits()
    //console.log(this.produit.nom)

  }
  async RemoveRecord(produit: any) {
    this.produitsService.deleteTask(produit.key);
    this.navCtrl.back()
  }

  ngOnInit() {
    this.produit = this.produitsService.renvoyerProduit()
  }
}


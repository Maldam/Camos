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
  imageVide = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg"
  constructor(public produitsService: ProduitsService,
    public navCtrl: NavController) {
    this.produit.nom = this.produitsService.obtenirListeProduits()
    //console.log(this.produit.nom)

  }
  async RemoveRecord(produit: any) {
    this.produitsService.deleteTask(produit.key, produit.nom);
    this.navCtrl.back()
  }
  async UpdateRecord(produit: any){
    this.produitsService.updateTask(produit);
  }

  ngOnInit() {
    this.produit = this.produitsService.renvoyerProduit()
  }
}
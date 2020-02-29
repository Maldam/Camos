import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


//import {ConfirmationService } from 'primeng/primeng';
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
  nom: any;
  quantite: any;
  prix: any;

  
  imageVide = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg"
  constructor(public produitsService: ProduitsService,
    //private confirmationService: ConfirmationService,
    public navCtrl: NavController
    ) {
   // this.produit.nom = this.produitsService.obtenirListeProduits()
    //console.log(this.produit.nom)

  }

  async RemoveRecord(produit: any) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + produit.nom + " ?")) {
      this.produitsService.deleteTask(produit.key, produit.nom);
      this.navCtrl.back()
    }
  }
  async UpdateRecord(produit: any) {
    if (confirm("Êtes-vous sûr de vouloir modiffier " + this.nom + " ?")) {
    this.produitsService.updateTask(produit);
    } else {
      this.ancienneDonnee()
        }
  }
  ancienneDonnee(){
    this.produit.nom = this.nom;
    this.produit.quantite = this.quantite;
    this.produit.prix = this.prix;
  }

  ngOnInit() {
    this.produit = this.produitsService.renvoyerProduit()
    this.nom = this.produit.nom;
    this.quantite = this.produit.quantite;
    this.prix = this.produit.prix;
  }
}
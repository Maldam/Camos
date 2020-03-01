import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController, Platform } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-afficher-produit',
  templateUrl: './afficher-produit.page.html',
  styleUrls: ['./afficher-produit.page.scss'],
})
export class AfficherProduitPage implements OnInit {

  public estChange: boolean = false;

  public produit: ProduitModele = new ProduitModele();
  constructor(private produitsService: ProduitsService,
    private navCtrl: NavController,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.produit = this.router.getCurrentNavigation().extras.state.data;
      }
    })
  }
  async RemoveProduit(produit: ProduitModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + produit.nom + "?")) {
      this.produitsService.deleteProduit(produit);
      this.navCtrl.back()
    }
  }
  async UpdateProduit(produit: ProduitModele, errorMessage: string) {
    if (this.estChange) {
     
        if (confirm(errorMessage))
       {
         this.produitsService.updateProduit(produit)
         this.estChange=false
          // TODO: Voir si il manque pas un truc ici
        } else {
          //this.platform.backButton.isStopped
        }
    }
  }


  ngOnInit() {
  }
}
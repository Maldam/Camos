import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../../services/produits.service';
import { Router } from '@angular/router';
import { ProduitModele } from '../../modeles/produit.modele';

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
  // public imageDefaut(event: any) {
  //   event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  // }
  public versVueProduit(produit: ProduitModele) {
    this.route.navigate(["afficher-produit"], { state: { data: produit } });
  }
  public ngOnInit() {
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = produits;
    });
  }
}
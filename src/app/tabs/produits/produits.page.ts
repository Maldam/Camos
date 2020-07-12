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
  public listeProduits: Array<ProduitModele> = new Array<ProduitModele>();
  
  constructor(
    public produitsService: ProduitsService,
    public route: Router
  ) {
  }
  // public imageDefaut(event: any) {
  //   event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  // }
  
  public rechercheProduit(ev: any){    
    this.produits = this.listeProduits
    
    const val = ev.target.value;
    console.log(val);
    console.log(this.produits)
    if (val && val.trim() !== ''){
      this.produits = this.produits.filter((item: any) => {
        return (item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      
      console.log(this.produits)
    }
  }

  public versVueProduit(produit: ProduitModele) {
    this.route.navigate(["afficher-produit"], { state: { data: produit } });
  }
  public ngOnInit() {
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = produits;
      this.listeProduits = this.produits;
    });
  }
}
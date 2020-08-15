import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../../services/produits.service';
import { Router } from '@angular/router';
import { ProduitModele } from '../../modeles/produit.modele';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
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
    public route: Router,
    public network: Network,
    public dialogs: Dialogs,
  ) {
    this.network.onDisconnect().subscribe(()=>
    {
      this.dialogs.alert("pas de connexion à internet")
    });
    this.network.onConnect().subscribe(()=>
    {
      setTimeout(()=>{
      },2000);
    });  
  }
  // public imageDefaut(event: any) {
  //   event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  // }
  public rechercheProduit(ev: any){    
    this.produits = this.listeProduits
    const val = ev.target.value;
    if (val && val.trim() !== ''){
      this.produits = this.produits.filter((produit: any) => {
        return (produit.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
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
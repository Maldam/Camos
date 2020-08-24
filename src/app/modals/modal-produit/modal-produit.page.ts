import { Component, OnInit } from '@angular/core';
import { ProduitModele } from 'src/app/modeles/produit.modele';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { ProduitsService } from 'src/app/services/produits.service';
import { CommandesService } from 'src/app/services/commandes.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-produit',
  templateUrl: './modal-produit.page.html',
  styleUrls: ['./modal-produit.page.scss'],
})
export class ModalProduitPage implements OnInit {
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public listeProduits: Array<ProduitModele> = new Array<ProduitModele>();
  public produit: ProduitModele = new ProduitModele();
  public commande: CommandeModele = new CommandeModele();
  constructor(public produitsService: ProduitsService,
    public commandesService: CommandesService,
    public route: Router,
    private modalController: ModalController,) { }
  public rechercheProduit(ev: any) {
    this.produits = this.listeProduits
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.produits = this.produits.filter((produit: any) => {
        return (produit.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  public async versVueProduit(produit: ProduitModele) {
    await this.modalController.dismiss(produit)
  }
  async closeModal() {
    await this.modalController.dismiss(this.produit);
  }
  public ngOnInit() {
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = produits;
      this.listeProduits = this.produits;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../../services/produits.service';
import { Router } from '@angular/router';
import { ProduitModele } from '../../modeles/produit.modele';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ConnexionService } from '../../services/connexion.service';
import { ClientModele } from 'src/app/modeles/client.modele';
import { ClientsService } from 'src/app/services/clients.service';
import { CommandesService } from 'src/app/services/commandes.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit {
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public listeProduits: Array<ProduitModele> = new Array<ProduitModele>();
  public categoriesProduits: Array<any> = new Array<any>()
  private fournisseurs: Array<ClientModele> = new Array<ClientModele>()
  public typeProduitStatus: boolean = false
  public listeProduitsType: Array<ProduitModele> = new Array<ProduitModele>();
  public listeProduitsCategorie: Array<ProduitModele> = new Array<ProduitModele>(); 
  //public listeProduitsRechcerche: Array<ProduitModele> = new Array<ProduitModele>();
  public categorieProduitStatus: boolean = false
  public fournisseur: boolean = false
  public categorieProduit: any;
  constructor(
    public produitsService: ProduitsService,
    public clientsService: ClientsService,
    public route: Router,
    public network: Network,
    public dialogs: Dialogs,
    public connexionService: ConnexionService,
    public commandesService: CommandesService,
  ) {
  }
  // public imageDefaut(event: any) {
  //   event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  // }
   public versVueProduit(produit: ProduitModele) {
    this.route.navigate(["afficher-produit"], { state: { data: produit } });
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public rechercheProduit(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.produits = this.produits.filter((produit: any) => {
        return (produit.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      if(this.listeProduitsType.length>0){
        this.produits=this.listeProduitsType
      }else{
        this.produits=this.listeProduits
      }
    }
  }
  public typeProduit(typeProduit) {
    this.produits=this.listeProduits
    if (typeProduit !== "") {
      this.categorieProduitStatus = true
        this.listeProduitsType = this.produits.filter((produit: any) => {
        return (produit.type.toLowerCase().indexOf(typeProduit.toLowerCase()) ===0);
      })
      this.produits=this.listeProduitsType
      this.produitsService.getCategoriesProduits(typeProduit).subscribe(categoriesProduits => {
        this.categoriesProduits = categoriesProduits;
      });
      this.clientsService.getClients("Fournisseurs").subscribe(fournisseurs => {
        this.fournisseurs = fournisseurs;
      });
    }
    else{      
      this.typeProduitStatus=false
      this.categorieProduitStatus = false

      this.categoriesProduits= new Array<any>()
    }
    this.typeProduitStatus=false
  }
  public triCategorie(ev){
    this.produits=this.listeProduitsType
    const val = ev.target.value
    if(val !== "toutes"){
      this.fournisseur = true;
      this.listeProduitsCategorie = this.produits.filter((produit: any) => {
        return (produit.categorie.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }) 
      this.produits = this.listeProduitsCategorie
    } 
  }
  public triFournisseur(ev){
    this.produits = this.listeProduitsCategorie
    const val = ev.target.value
    if(val !== "tous"){
      var fournisseur = this.fournisseurs.find(fournisseur => fournisseur.nom = val)
      this.produits = this.produits.filter((produit: any) => {
        return (produit.keyFournisseur.toLowerCase().indexOf(fournisseur.key.toLowerCase()) > -1);
      }) 
    }
  }
  public ngOnInit() {
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = produits;
      this.listeProduits = produits;
    });
  }
}
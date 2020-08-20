import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { CommandesService } from '../services/commandes.service';
import { LoadingController, AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';

@Component({
  selector: 'app-ajouter-commande',
  templateUrl: './ajouter-commande.page.html',
  styleUrls: ['./ajouter-commande.page.scss'],
})
export class AjouterCommandePage implements OnInit {
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public client: ClientModele = new ClientModele();
  public commandeProduit: CommandeProduitModele = new CommandeProduitModele();
  public commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public listeCommandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public produit: ProduitModele = new ProduitModele();
  public groups: Array<{
		type: string;
		elements: Array<ClientModele>;
  }> = new Array();
  private groupTypes: Array<string> = new Array();


  constructor(
    private commandesService: CommandesService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private modalController: ModalController,
    //public ajoutClient: ModalClientPage,
  ) {
  }
  public async ajoutCommande(commande: AjouterCommandePage) {
    const loading = await this.loadingController.create({
    });
    const alert = await this.alertController.create({
      header: 'Félicitation',
      message: 'La commande a bien été ajouté',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un numéro de facture',
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cette commande existe déjà',
      buttons: ['OK']
    });
    var index = this.commandesService.numeroIndex(this.commande.numeroFacture);
    if (index === -1) {
      if (this.commande.numeroFacture == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        this.commande.nomClient = this.client.nom,
        this.commande.prenomClient = this.client.prenom,
        this.commande.paysClient = this.client.pays,
        this.commande.provinceClient = this.client.province,
        this.commande.codePostalClient = this.client.codePostal,
        this.commande.localiteClient = this.client.localite,
        this.commande.rueClient = this.client.rue,
        this.commande.numeroClient = this.client.numero,
        this.commande.boiteClient = this.client.boite,
        this.commande.numeroTVAClient = this.client.numeroTVA,
        this.commande.numeroTelephoneClient = this.client.numeroTelephone,
        this.commande.numeroGSMClient = this.client.numeroGSM,
        this.commande.numeroFaxClient = this.client.numeroFax,
        this.commande.emailClient = this.client.email,
        this.commandeProduit.nom = this.produit.nom,

        this.commandesProduits.forEach(commandeProduit => {
          this.commandesService.createCommandeProduit(commandeProduit).then(x=>console.log(commandeProduit))
        });

        
        this.commandesService.createCommande(this.commande).then(ref => { this.commande = new CommandeModele
        this.client = new ClientModele, this.produit = new ProduitModele });
        
        await loading.dismiss();
          await alert.present();
        } 
        
    } else {
      await articleExiste.present();
    }
  }

  public async choixClientModal() {
    const modal = await this.modalController.create({
      component: ModalClientPage,
      componentProps: {
       
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.client = dataReturned.data;
 
    })
     return await modal.present().then(_ => {
     });
  }
  public async choixProduitModal() {
    const modal = await this.modalController.create({
      component: ModalProduitPage,
      componentProps: {
       
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.produit = dataReturned.data;
      this.commandeProduit.nom = this.produit.nom,
      this.commandeProduit.numeroFacture = this.commande.numeroFacture,
      console.log(this.commandeProduit)
      //var commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
      this.commandesProduits.push(this.commandeProduit)

      //commandesProduits.forEach(commandeProduit => {
      //  console.log(commandeProduit)
    //  });
      
      //console.log(this.commandeProduit)
      //console.log(this.commandesProduits)
 
    })
     return await modal.present().then(_ => {
     });
  }

  public ngOnInit() {
    //this.commandesService.getCommandesProduits().subscribe(commandesProduits => {
      //this.commandesProduits = commandesProduits;
      //this.listeCommandesProduits = this.commandesProduits;
    //});

  }
}
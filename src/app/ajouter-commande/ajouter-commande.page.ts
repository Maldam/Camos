import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { CommandesService } from '../services/commandes.service';
import { LoadingController, AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';

@Component({
  selector: 'app-ajouter-commande',
  templateUrl: './ajouter-commande.page.html',
  styleUrls: ['./ajouter-commande.page.scss'],
})
export class AjouterCommandePage implements OnInit {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public client: ClientModele = new ClientModele();
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
          
        } 
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
        this.commandesService.createCommande(this.commande).then(ref => { this.commande = new CommandeModele
        this.client = new ClientModele });
        await loading.dismiss();
          await alert.present();
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

  public ngOnInit() {
    
  }
}
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
    var index = this.commandesService.numeroIndex(this.commande.numero);
    if (index === -1) {
      if (this.commande.numero == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
          await loading.dismiss();
          await alert.present();
        } 
        this.commandesService.createCommande(this.commande).then(ref => { this.commande = new CommandeModele });
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

//public dinner: CommandeModele = new CommandeModele();


  // public async choixClientModal(client: ClientModele) {
	// 	const modal = await this.modalController.create({
	// 		component: ModalClientPage,
	// 		componentProps: {
	// 			person: client ? client : new ClientModele(),
	// 			update: client ? true : false
	// 		}
	// 	});

	// 	modal.onWillDismiss().then(dataReturned => {
	// 		client
	// 			? dataReturned.data.removePerson
	// 				? (this.clients = this.clients.filter(
	// 						pers => pers !== dataReturned.data.person
	// 				  ))
	// 				: false
	// 			: dataReturned.data.person
	// 			? this.clients.push(dataReturned.data.person)
	// 			: false;
	// 		this.prepareGroups();
	// 	});

	// 	return await modal.present();
	// }
  // private prepareGroups(): void {
	// 	this.groups = new Array();
	// 	this.groupTypes.forEach(type => {
	// 		this.groups.push({
	// 			type: type,
	// 			elements: this.clients.filter(
	// 				client => client.nom === type && client.numero
	// 			)
	// 		});
	// 	});
	// }






  public ngOnInit() {
    
  }
}
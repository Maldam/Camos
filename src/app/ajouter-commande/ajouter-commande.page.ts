import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { CommandesService } from '../services/commandes.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ajouter-commande',
  templateUrl: './ajouter-commande.page.html',
  styleUrls: ['./ajouter-commande.page.scss'],
})
export class AjouterCommandePage implements OnInit {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();

  constructor(
    private commandesService: CommandesService,
    public loadingController: LoadingController,
    public alertController: AlertController,
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
  public ngOnInit() {
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { CommandesService } from 'src/app/services/commandes.service';

@Component({
  selector: 'app-modal-commandes',
  templateUrl: './modal-commandes.page.html',
  styleUrls: ['./modal-commandes.page.scss'],
})
export class ModalCommandesPage implements OnInit {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();


  constructor(public commandesService: CommandesService,
    public route: Router,
    private modalController: ModalController
    ) { }
    public async versVueCommande(commande: CommandeModele) {
      await this.modalController.dismiss(commande)
    }
    async closeModal() {
      await this.modalController.dismiss(this.commande);
    }

  ngOnInit() {
    this.commandesService.getCommandesSeparee(this.commande.pseudoClient).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a,b) => b.numeroCommande - a.numeroCommande);
    });
  }

}
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
  public keyClient: string;
  public pseudoClient: string;


  constructor(public commandesService: CommandesService,
    public router: Router,
    private modalController: ModalController
    ) { }
    public async versVueCommande(commande: CommandeModele) {
      await this.modalController.dismiss(commande)
    this.router.navigate(["afficher-commande"], { state: { data: commande} });

    }
    public async closeModal() {
      await this.modalController.dismiss();
    }

  ngOnInit() {
    this.commandesService.getCommandesSeparee(this.keyClient).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a,b) => b.dateCommande - a.dateCommande);
    });
  }

}
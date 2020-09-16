import { Component, OnInit } from '@angular/core';
import { ClientModele } from 'src/app/modeles/client.modele';
import { ClientsService } from 'src/app/services/clients.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { CommandesService } from 'src/app/services/commandes.service';
@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.page.html',
  styleUrls: ['./modal-client.page.scss'],
})
export class ModalClientPage implements OnInit {
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public listeClients: Array<ClientModele> = new Array<ClientModele>();
  public client: ClientModele = new ClientModele();
  public commande: CommandeModele = new CommandeModele();
  constructor(public clientsService: ClientsService,
    public commandesService: CommandesService,
    public route: Router,
    private modalController: ModalController,
    ) { }
  public rechercheClient(ev: any) {
    this.clients = this.listeClients
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.clients = this.clients.filter((client: any) => {
        return (client.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  public async versVueClient(client: ClientModele) {
    await this.modalController.dismiss(client)
  }
  public async closeModal() {
    await this.modalController.dismiss();
  }
  public ngOnInit() {
    this.clientsService.getClients().subscribe(clients => {
      this.clients = clients;
      this.listeClients = this.clients;
    });
  }
}
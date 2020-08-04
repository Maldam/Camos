import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { ClientModele } from '../../modeles/client.modele';
@Component({
  selector: 'app-clients',
  templateUrl: 'clients.page.html',
  styleUrls: ['clients.page.scss']
})
export class ClientsPage implements OnInit {
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public listeClients: Array<ClientModele> = new Array<ClientModele>();
  constructor(
    public clientsService: ClientsService,
    public route: Router,
  
  ) {
  }

  public rechercheClient(ev: any){    
    this.clients = this.listeClients
    const val = ev.target.value;
    if (val && val.trim() !== ''){
      this.clients = this.clients.filter((client: any) => {
        return (client.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  public versVueClient(client: ClientModele) {
    this.route.navigate(["afficher-client"], { state: { data: client } });
  }
  public ngOnInit() {
    this.clientsService.getClients().subscribe(clients => {
      this.clients = clients;
      this.listeClients = this.clients;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
import { ClientModele } from '../../modeles/client.modele';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ConnexionService } from 'src/app/services/connexion.service';
import { CoordonneesService } from 'src/app/services/coordonnees.service';
@Component({
  selector: 'app-clients',
  templateUrl: 'clients.page.html',
  styleUrls: ['clients.page.scss']
})
export class ClientsPage implements OnInit {
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public listeClients: Array<ClientModele> = new Array<ClientModele>();
  public entreprises: string = "Clients"
  public dossier: string
  public fournisseurs: boolean = false
  constructor(
    public clientsService: ClientsService,
    public router: Router,
    public network: Network,
    public dialogs: Dialogs,
    public connexionService: ConnexionService,
    private coordonneesService: CoordonneesService,
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
    this.router.navigate(["afficher-client"], { state: { 
      data: client,
      entreprises: this.entreprises
    } })
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public changeEntreprises(){
    this.fournisseurs=!this.fournisseurs
    if(this.fournisseurs){
      this.entreprises = "Fournisseurs"
      this.recupererlisteClients()  
    } else {
      this.entreprises = "Clients"
      this.recupererlisteClients()  
    }
  }
  public recupererlisteClients(){
    this.clientsService.getClients(this.entreprises).subscribe(clients => {
      this.clients = clients;
      this.listeClients = this.clients;
    });
  }
  public ajouterEntreprise(){
    this.router.navigate(["ajouter-client"], { state: { data: this.fournisseurs} })
  }
  public ngOnInit() {
    this.recupererlisteClients()
  }
}
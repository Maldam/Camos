import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../services/clients.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-client',
  templateUrl: './ajouter-client.page.html',
  styleUrls: ['./ajouter-client.page.scss'],
})
export class AjouterClientPage implements OnInit {
  public imageVide: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png';
  public image: string;
  public nomImage: string;
  public client: ClientModele = new ClientModele();
  public coordonnees: CoordonneesModele = new CoordonneesModele();
  public fournisseurs: boolean = false;
  public entreprise: string;
  public dossier: string;
  constructor(
    private clientsService: ClientsService,
    //private camera: Camera,
    private router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      this.fournisseurs = this.router.getCurrentNavigation().extras.state.data
      if(!this.fournisseurs){
this.entreprise = "client"
this.dossier = "/Clients"
      } else{
        this.entreprise = "fournisseur"
        this.dossier = "/Fournisseurs"
      }
    });
  }
  public async ajoutClient(client: AjouterClientPage) {
    const loading = await this.loadingController.create({
    });
    const alert = await this.alertController.create({
      header: 'Félicitation',
      message: 'Le '+ this.entreprise +' a bien été ajouté',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de '+ this.entreprise,
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Ce '+this.entreprise+' existe déjà',
      buttons: ['OK']
    });
    var index = this.clientsService.numeroIndex(this.client.nom);
    if (index === -1) {
      if (this.client.nom == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        if (this.image == undefined) {
          await loading.dismiss();
          await alert.present();
        } else {
          this.nomImage = this.dossier + this.client.nom + '.jpg';
          this.clientsService.ajouterImage(this.nomImage, this.image).then(ref => { this.image = this.imageVide; loading.dismiss(); alert.present(); })
          this.client.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Clients%2F' + this.client.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          //this.clientsService.angularFireStorage.ref('').getDownloadURL().subscribe(imageURL => { console.log(imageURL) })
        }
        this.coordonnees.type = "client"
        this.coordonnees.fonction = "siège"
        this.clientsService.createClient(this.client, this.coordonnees, this.dossier);
        this.client = new ClientModele
        this.coordonnees = new CoordonneesModele
        //console.log(this.client.pseudo)
         //console.log(this.clientsService.getClientKey(this.client.pseudo));
      }
    } else {
      await articleExiste.present();
    }
  }
  public async ajouterPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.clientsService.openLibrary();
      this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.clientsService.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
    return this.image
  }
  ChoixPseudo(){
    this.client.pseudo = this.client.nom
  }
  public ngOnInit() {
    //this.imageVide = this.client.imageURL;
    //this.image = this.imageVide;
  }
}
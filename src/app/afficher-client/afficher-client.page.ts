import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../services/clients.service';
import { NavController, AlertController } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-afficher-client',
  templateUrl: './afficher-client.page.html',
  styleUrls: ['./afficher-client.page.scss'],
})
export class AfficherClientPage implements OnInit {

  public estChange: boolean = false;
  public imageChange: boolean = false;
  public imageClient: string;
  public form: FormGroup;
  public client: ClientModele = new ClientModele();
  public image: string;
  public imageOrigine: string;
  constructor(private clientsService: ClientsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController,

  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.client = this.router.getCurrentNavigation().extras.state.data;
      }
    });
      this.imageOrigine = this.client.imageURL
      this.imageClient = this.imageOrigine
  }
  public async RemoveClient(client: ClientModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + client.nom + "?")) {
      this.clientsService.deleteClient(client);
      this.navCtrl.back()
    }
  }
  
  public async UpdateClient(client: ClientModele, errorMessage: string) {

    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });   

    if (this.estChange || this.imageChange) {
      if (this.clientsService.numeroIndex(this.form.value.nomForm) === -1){
        if (confirm(errorMessage)) {
          this.client.nom = this.form.value.nomForm;
          this.client.province = this.form.value.provinceForm;
          this.client.pays = this.form.value.paysForm;
          this.clientsService.updateClient(client);
          this.estChange = false;
          this.navCtrl.back();
          if (this.imageChange) {
            this.clientsService.deleteImage(this.imageOrigine)
            var nomImage = 'Clients/' + this.client.nom + '.jpg'
            this.clientsService.ajouterImage(nomImage, this.client.imageURL)
            this.imageChange = false;
            this.navCtrl.back();
          }
        }
      } else {
        await articleExiste.present();
      }
    }
  }

  public async changerPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.clientsService.openLibrary();
      this.client.imageURL = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.clientsService.openCamera();
      this.client.imageURL = 'data:image/jpg;base64,' + cameraImage;
    }
 }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      nomForm: [this.client.nom],
      provinceForm: [this.client.province],
      paysForm: [this.client.pays]
    });
  }
}
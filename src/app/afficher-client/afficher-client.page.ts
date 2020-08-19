import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../services/clients.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
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
  public nomChange: boolean = false;
  public form: FormGroup;
  public client: ClientModele = new ClientModele();
  public image: string;
  public imageOrigine: string;
  public clients: Array<ClientModele> = new Array<ClientModele>();
  constructor(private clientsService: ClientsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.client = this.router.getCurrentNavigation().extras.state.data;
      }
    });
    //this.image = this.client.imageURL
  }
  public async RemoveClient(client: ClientModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + client.nom + "?")) {
      this.clientsService.deleteClient(client);
      this.navCtrl.back()
    }
  }
  public async UpdateClient(client: ClientModele, errorMessage: string) {
    const loading = await this.loadingController.create({
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de client',
      buttons: ['OK']
    });
    var changementNomOK = false;
    if (this.estChange) {
      if (this.form.value.nomForm === "") {
        await alertNom.present();
      } else {
        if (this.nomChange) {
          if (this.clientsService.numeroIndex(this.form.value.nomForm) === -1) {
            changementNomOK = true
          }
        } else { 
          changementNomOK = true }
        if (changementNomOK) {
          if (confirm(errorMessage)) {
            await loading.present();
            client.nom = this.form.value.nomForm;
            client.prenom = this.form.value.prenomForm;
            client.pays = this.form.value.paysForm;
            client.province = this.form.value.provinceForm;
            client.codePostal = this.form.value.codePostalForm;
            client.localite = this.form.value.localiteForm;
            client.rue = this.form.value.rueForm;
            client.numero = this.form.value.numeroForm;
            client.boite = this.form.value.boiteForm;
            client.numeroTVA = this.form.value.numeroTVAForm;
            client.numeroTelephone = this.form.value.numeroTelephoneForm;
            client.numeroGSM = this.form.value.numeroGSMForm;
            client.numeroFax = this.form.value.numeroFax;
            client.email = this.form.value.emailForm;
            client.notes= this.form.value.notesForm;
            if (this.imageChange) { 
              var nouveauNomImage = client.nom + Date.now()
              await this.nouvelleImage(client,nouveauNomImage) 
              client.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Clients%2F' + nouveauNomImage + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
            }
            await this.clientsService.updateClient(client).then(ref => {
              loading.dismiss();
            });
            this.estChange = false;
            this.nomChange = false;
            this.imageChange = false;
          }
        } else {
          await articleExiste.present();
        }
      }
    }
  }
  public async nouvelleImage(client: ClientModele,nouveauNomImage: string) {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    try {
      this.clientsService.deleteImage(client)
    } catch (error) {
      console.log("Pas d'image présente")
    }
    var nomImage = 'Clients/' + nouveauNomImage + '.jpg'
    await this.clientsService.ajouterImage(nomImage, this.image).then(ref => { loading.dismiss() })
    //this.image ='https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Clients%2F' + client.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
    this.imageChange = false;
  }
  public async changerPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.clientsService.openLibrary();
      this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.clientsService.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
  }
  public ngOnInit() {
    this.image = this.client.imageURL
    this.imageOrigine = this.client.imageURL

    this.form = this.formBuilder.group({
      nomForm: [this.client.nom],
      prenomForm: [this.client.prenom],
      paysForm: [this.client.pays],
      provinceForm:[this.client.province],
      codePostalForm:[this.client.codePostal],
      localiteForm:[this.client.localite],
      rueForm:[this.client.rue],
      numeroForm:[this.client.numero],
      boiteForm:[this.client.boite],
      numeroTVAForm: [this.client.numeroTVA],
      numeroTelephoneForm: [this.client.numeroTelephone],
      numeroGSMForm: [this.client.numeroGSM],
      numeroFaxForm: [this.client.numeroFax],
      emailForm: [this.client.email],
      notesForm: [this.client.notes]

    });
  }
}
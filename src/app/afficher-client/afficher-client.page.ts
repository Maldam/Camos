import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../services/clients.service';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ModalCommandesPage } from '../modals/modal-commandes/modal-commandes.page';
import { CommandeModele } from '../modeles/commande.modele';
import { CoordonneesService } from '../services/coordonnees.service';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { ModalListeContactsPage } from '../modals/modal-liste-contacts/modal-liste-contacts.page';
import { ContactsService } from '../services/contacts.service';
import { ContactModele } from '../modeles/contact.modele';
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
  private coordonnees: CoordonneesModele = new CoordonneesModele();
  private contacts: Array<ContactModele> = new Array<ContactModele>();
  private entreprises: string;
  constructor(private clientsService: ClientsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private callNumber: CallNumber,
    private sms: SMS,
    private modalController: ModalController,
    private coordonneesService: CoordonneesService,
    private contactsService: ContactsService,
  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.client = this.router.getCurrentNavigation().extras.state.data;
        this.entreprises = this.router.getCurrentNavigation().extras.state.entreprises;
      }
    });
  }
  public async RemoveClient(client: ClientModele) {

    await this.alertController.create({
      header: "Attention",
      message: "Êtes-vous sûr de vouloir supprimer " + client.nom + "?",
      buttons: [
        {
          text: 'Non',
        },
        {
          text: 'Oui',
          handler: () => {
            this.clientsService.deleteClient(client, this.coordonnees, this.contacts, this.entreprises);
            this.navCtrl.back()
          }
        }
      ]
    }).then(
      res => {
        res.present();
      });
  }
  public async UpdateClient(client: ClientModele) {
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
          changementNomOK = true
        }
        if (changementNomOK) {
          this.alertController.create({
            header: "Attention",
            message: "Êtes-vous sûr de vouloir valider les modifications?",
            buttons: [
              {
                text: 'Non',
              },
              {
                text: 'Oui',
                handler: () => {
                  loading.present();
                  client.nom = this.form.value.nomForm;
                  client.pseudo = this.form.value.pseudoForm;
                  client.numeroTVA = this.form.value.numeroTVAForm;
                  client.siteWeb = this.form.value.siteWebForm;
                  client.notes = this.form.value.notesForm;
                  this.coordonneesService.updateCoordonnees(this.coordonnees)
                  if (this.imageChange) {
                    var nouveauNomImage = client.nom + Date.now()
                    this.nouvelleImage(client, nouveauNomImage)
                    client.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Clients%2F' + nouveauNomImage + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
                  }
                  this.clientsService.updateClient(client, this.entreprises).then(ref => {
                    loading.dismiss();
                  });
                  this.estChange = false;
                  this.nomChange = false;
                  this.imageChange = false;
                }
              }
            ]
          }).then(
            res => {
              res.present();
            });
        } else {
          await articleExiste.present();
        }
      }
    }
  }
  public async nouvelleImage(client: ClientModele, nouveauNomImage: string) {
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
  public openBrowser(url: string) {
    window.open(url)
  }
  public appeler(numero: number) {
    this.callNumber.callNumber(String(numero), true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  public envoyerSMS(numero: number) {
    var options = { android: { intent: 'INTENT' } }
    this.sms.send(String(numero), '', options);
  }
  public async choixCommandesModal(keyClient: string, pseudoClient: string) {
    const modal = await this.modalController.create({
      component: ModalCommandesPage,
      componentProps: { pseudoClient, keyClient }
    });
    modal.onWillDismiss().then(dataReturned => {
      var commande: CommandeModele;
      commande = dataReturned.data;
    })
    return await modal.present()
  }
  public async choixContactModal(keyEntreprise: string) {
    const modal = await this.modalController.create({
      component: ModalListeContactsPage,
      componentProps: { keyEntreprise }
    });
    modal.onWillDismiss()
    return await modal.present()
  }
  public ngOnInit() {
    this.image = this.client.imageURL
    this.imageOrigine = this.client.imageURL
    this.form = this.formBuilder.group({
      nomForm: [this.client.nom],
      pseudoForm: [this.client.pseudo],
      numeroTVAForm: [this.client.numeroTVA],
      notesForm: [this.client.notes],
      siteWebForm: [this.client.siteWeb]
    });
    this.coordonneesService.getCoordonnees(this.client.key).subscribe(coordonneess =>
      coordonneess.forEach(element => {
        this.coordonnees = element
      }))
    this.contactsService.getContactsClient(this.client.key).subscribe(contacts =>
      this.contacts = contacts)
  }
}
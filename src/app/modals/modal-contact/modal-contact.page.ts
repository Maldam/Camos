import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ContactModele } from 'src/app/modeles/contact.modele';
import { CoordonneesModele } from 'src/app/modeles/coordonnees.modele';
import { ContactsService } from 'src/app/services/contacts.service';
import { CoordonneesService } from 'src/app/services/coordonnees.service';
@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.page.html',
  styleUrls: ['./modal-contact.page.scss'],
})
export class ModalContactPage implements OnInit {
  public keyEntreprise: string;
  public estChange: boolean = false;
  public contact: ContactModele = new ContactModele()
  public coordonnees: CoordonneesModele = new CoordonneesModele()
  public coordonneess: Array<CoordonneesModele> = new Array<CoordonneesModele>()
  public vide: boolean
  public nomChange: boolean = false

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private contactsService: ContactsService,
    private coordonneesService: CoordonneesService,
    private callNumber: CallNumber,
    private sms: SMS,
    private navCtrl: NavController,
    private modalController: ModalController,

  ) { }
  public async ajoutContact(contact: ModalContactPage) {
    const loading = await this.loadingController.create({
    });
    const alert = await this.alertController.create({
      header: 'Félicitation',
      message: 'Le contact a bien été ajouté',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de contact',
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Ce contact existe déjà',
      buttons: ['OK']
    });
    var index = this.contactsService.numeroIndex(this.contact.nom);
    if (index === -1) {
      if (this.contact.nom == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        await alert.present();
        this.coordonnees.type = "contact"
        //this.coordonnees.fonction = "siège"
        this.contact.keyEntreprise = this.keyEntreprise
        this.contactsService.createContact(this.contact, this.coordonnees);
        this.contact = new ContactModele
        this.coordonnees = new CoordonneesModele
        await loading.dismiss();
      }
    } else {
      await articleExiste.present();
    }
    this.closeModal()
  }
  public async closeModal() {
    await this.modalController.dismiss();
  }
  public async RemoveContact(contact: ContactModele) {
    this.alertController.create({
      header: "Attention",
      message: "Êtes-vous sûr de vouloir supprimer " + contact.nom + "?",
      buttons: [
        {
          text: 'Non',
        },
        {
          text: 'Oui',
          handler: () => {
            this.contactsService.deleteContact(contact, this.coordonnees);
            this.modalController.dismiss();
            // this.navCtrl.back()
          }
        }
      ]
    }).then(
      res => {
        res.present();
      });
  }
  public async UpdateClient(contact: ContactModele, errorMessage: string) {
    const loading = await this.loadingController.create({
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Ce contact existe déjà',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de contact',
      buttons: ['OK']
    });
    var changementNomOK = false;
    if (this.estChange) {
      if (this.contact.nom === "") {
        await alertNom.present();
      } else {
        if (this.nomChange) {
          if (this.contactsService.numeroIndex(this.contact.nom) === -1) {
            changementNomOK = true
          }
        } else {
          changementNomOK = true
        }
        if (changementNomOK) {
          

            this.alertController.create({
              header: "Attention",
              message: "Êtes-vous sûr de vouloir modifier le contact?",
              buttons: [
                {
                  text: 'Non',
                },
                {
                  text: 'Oui',
                  handler: () => {
            loading.present();
            this.contactsService.updateContacts(this.contact)
            this.coordonneesService.updateCoordonnees(this.coordonnees).then(ref => {
              loading.dismiss();
            });
            this.estChange = false;
            this.nomChange = false;
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
  ngOnInit() {
    if (this.vide === false) {
      this.coordonneesService.getCoordonnees(this.contact.key).subscribe(coordonneess =>
        coordonneess.forEach(element => {
          this.coordonnees = element
        }))
    }
  }
}
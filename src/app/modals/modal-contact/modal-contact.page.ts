import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
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
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private contactsService: ContactsService,
    private coordonneesService: CoordonneesService,
    private callNumber: CallNumber,
    private sms: SMS,
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
  }





  // public async RemoveClient(client: ClientModele) {
  //   if (confirm("Êtes-vous sûr de vouloir supprimer " + client.nom + "?")) {
  //     this.clientsService.deleteClient(client);
  //     this.navCtrl.back()
  //   }
  // }
  // public async UpdateClient(client: ClientModele, errorMessage: string) {
  //   const loading = await this.loadingController.create({
  //   });
  //   const articleExiste = await this.alertController.create({
  //     header: 'Attention',
  //     message: 'Cet article existe déjà',
  //     buttons: ['OK']
  //   });
  //   const alertNom = await this.alertController.create({
  //     header: 'Attention',
  //     message: 'Nous avons besoin d\'un nom de client',
  //     buttons: ['OK']
  //   });
  //   var changementNomOK = false;
  //   if (this.estChange) {
  //     if (this.form.value.nomForm === "") {
  //       await alertNom.present();
  //     } else {
  //       if (this.nomChange) {
  //         if (this.clientsService.numeroIndex(this.form.value.nomForm) === -1) {
  //           changementNomOK = true
  //         }
  //       } else {
  //         changementNomOK = true
  //       }
  //       if (changementNomOK) {
  //         if (confirm(errorMessage)) {
  //           await loading.present();
  //           client.nom = this.form.value.nomForm;
  //           client.pseudo = this.form.value.pseudoForm;
  //           client.numeroTVA = this.form.value.numeroTVAForm;
  //           client.siteWeb = this.form.value.siteWebForm;
  //           client.notes = this.form.value.notesForm;
  //           this.coordonnees.forEach(element => {
  //             this.coordonneesService.updateCoordonnees(element)
  //           });
  //           if (this.imageChange) {
  //             var nouveauNomImage = client.nom + Date.now()
  //             await this.nouvelleImage(client, nouveauNomImage)
  //             client.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Clients%2F' + nouveauNomImage + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
  //           }
  //           await this.clientsService.updateClient(client).then(ref => {
  //             loading.dismiss();
  //           });
  //           this.estChange = false;
  //           this.nomChange = false;
  //           this.imageChange = false;
  //         }
  //       } else {
  //         await articleExiste.present();
  //       }
  //     }
  //   }
  // }










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
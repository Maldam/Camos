import { Component, OnInit } from '@angular/core';
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

  
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private contactsService: ContactsService,
    private coordonneesService: CoordonneesService,



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

  ngOnInit() {
    this.coordonneesService.getCoordonnees(this.contact.key).subscribe(coordonneess =>
      coordonneess.forEach(element => {
        this.coordonnees = element
      }))
      
  }

}

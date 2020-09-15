import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContactModele } from 'src/app/modeles/contact.modele';
import { ContactsService } from 'src/app/services/contacts.service';
import { ModalContactPage } from '../modal-contact/modal-contact.page';
@Component({
  selector: 'app-modal-liste-contacts',
  templateUrl: './modal-liste-contacts.page.html',
  styleUrls: ['./modal-liste-contacts.page.scss'],
})
export class ModalListeContactsPage implements OnInit {
  public keyEntreprise: string;
  public contacts: Array<ContactModele> = new Array<ContactModele>()
  constructor(
    private modalController: ModalController,
    private contactsService: ContactsService,
  ) { }
  public async contactModal(keyEntreprise: string) {
    const modal = await this.modalController.create({
      component: ModalContactPage,
      componentProps: { keyEntreprise }
    });
    modal.onWillDismiss()
    //.then(dataReturned => {
    //  this.client = dataReturned.data;
    //})
    return await modal.present()
  }
  public async versVueContact(contact: ContactModele) {
    const modal = await this.modalController.create({
      component: ModalContactPage,
      componentProps: { contact }
    });
    modal.onWillDismiss()
    //.then(dataReturned => {
    //  this.client = dataReturned.data;
    //})
    return await modal.present()
  }
  async closeModal() {
    await this.modalController.dismiss();
  }
  ngOnInit() {
    this.contactsService.getContactsClient(this.keyEntreprise).subscribe(contacts => {
      this.contacts = contacts;
      ///console.log(this.contacts)
      //this.contacts.sort((a,b) => b.nom - a.nom);
    })
  }
}

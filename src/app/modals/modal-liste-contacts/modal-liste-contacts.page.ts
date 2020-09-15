import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalContactPage } from '../modal-contact/modal-contact.page';

@Component({
  selector: 'app-modal-liste-contacts',
  templateUrl: './modal-liste-contacts.page.html',
  styleUrls: ['./modal-liste-contacts.page.scss'],
})
export class ModalListeContactsPage implements OnInit {
  public keyEntreprise: string;

  constructor(private modalController: ModalController) { }
    public async contactModal(keyEntreprise: string){
    const modal = await this.modalController.create({
      component: ModalContactPage,
      componentProps:{keyEntreprise}
    });
    modal.onWillDismiss()
    //.then(dataReturned => {
    //  this.client = dataReturned.data;
    //})
    return await modal.present()
  }
  ngOnInit() {
    
  }

}

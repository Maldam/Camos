import { Component, OnInit } from '@angular/core';
import { ContactModele } from 'src/app/modeles/contact.modele';

@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.page.html',
  styleUrls: ['./modal-contact.page.scss'],
})
export class ModalContactPage implements OnInit {
  public keyEntreprise: string;
  public estChange: boolean = false;
  public contact: ContactModele = new ContactModele()
  constructor() { }

  ngOnInit() {
  }

}

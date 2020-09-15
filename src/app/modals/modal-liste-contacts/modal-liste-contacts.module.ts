import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalListeContactsPageRoutingModule } from './modal-liste-contacts-routing.module';

import { ModalListeContactsPage } from './modal-liste-contacts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalListeContactsPageRoutingModule
  ],
  declarations: [ModalListeContactsPage]
})
export class ModalListeContactsPageModule {}

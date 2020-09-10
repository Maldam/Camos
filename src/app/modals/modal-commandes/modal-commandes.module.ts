import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCommandesPageRoutingModule } from './modal-commandes-routing.module';

import { ModalCommandesPage } from './modal-commandes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCommandesPageRoutingModule
  ],
  declarations: [ModalCommandesPage]
})
export class ModalCommandesPageModule {}

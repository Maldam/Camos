import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterCommandePageRoutingModule } from './ajouter-commande-routing.module';

import { AjouterCommandePage } from './ajouter-commande.page';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //TextAvatarModule,
		ReactiveFormsModule,
    //ModalClientPageModule,
    AjouterCommandePageRoutingModule,
  ],
  declarations: [AjouterCommandePage, ModalClientPage],
  entryComponents: [ModalClientPage]
})
export class AjouterCommandePageModule {}

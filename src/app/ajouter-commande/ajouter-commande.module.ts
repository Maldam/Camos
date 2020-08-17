import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterCommandePageRoutingModule } from './ajouter-commande-routing.module';

import { AjouterCommandePage } from './ajouter-commande.page';
import { ModalClientPageModule } from '../modals/modal-client/modal-client.module';
import { AjouterClientPage } from '../ajouter-client/ajouter-client.page';

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
  exports: [
    ModalClientPageModule,
    
  ],
  declarations: [AjouterCommandePage],
  //entryComponents: [ModalClientPageModule]
})
export class AjouterCommandePageModule {}

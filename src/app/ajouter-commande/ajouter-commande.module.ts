import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterCommandePageRoutingModule } from './ajouter-commande-routing.module';

import { AjouterCommandePage } from './ajouter-commande.page';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
		ReactiveFormsModule,
    AjouterCommandePageRoutingModule,
  ],
  declarations: [AjouterCommandePage]
})
export class AjouterCommandePageModule {}

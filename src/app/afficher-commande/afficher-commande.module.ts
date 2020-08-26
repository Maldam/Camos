import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AfficherCommandePageRoutingModule } from './afficher-commande-routing.module';
import { AfficherCommandePage } from './afficher-commande.page';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfficherCommandePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AfficherCommandePage]
})
export class AfficherCommandePageModule {}

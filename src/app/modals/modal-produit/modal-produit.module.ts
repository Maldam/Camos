import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProduitPageRoutingModule } from './modal-produit-routing.module';

import { ModalProduitPage } from './modal-produit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalProduitPageRoutingModule
  ],
  declarations: [ModalProduitPage]
})
export class ModalProduitPageModule {}

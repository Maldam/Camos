import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfficherProduitPageRoutingModule } from './afficher-produit-routing.module';

import { AfficherProduitPage } from './afficher-produit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfficherProduitPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AfficherProduitPage]
})
export class AfficherProduitPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfficherCommandePageRoutingModule } from './afficher-commande-routing.module';

import { AfficherCommandePage } from './afficher-commande.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfficherCommandePageRoutingModule
  ],
  declarations: [AfficherCommandePage]
})
export class AfficherCommandePageModule {}

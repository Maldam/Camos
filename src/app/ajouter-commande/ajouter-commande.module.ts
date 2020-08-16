import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterCommandePageRoutingModule } from './ajouter-commande-routing.module';

import { AjouterCommandePage } from './ajouter-commande.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjouterCommandePageRoutingModule
  ],
  declarations: [AjouterCommandePage]
})
export class AjouterCommandePageModule {}

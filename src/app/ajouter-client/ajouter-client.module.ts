import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjouterClientPageRoutingModule } from './ajouter-client-routing.module';

import { AjouterClientPage } from './ajouter-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjouterClientPageRoutingModule
  ],
  declarations: [AjouterClientPage]
})
export class AjouterClientPageModule {}

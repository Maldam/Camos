import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfficherClientPageRoutingModule } from './afficher-client-routing.module';

import { AfficherClientPage } from './afficher-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfficherClientPageRoutingModule
  ],
  declarations: [AfficherClientPage]
})
export class AfficherClientPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalClientPageRoutingModule } from './modal-client-routing.module';
import { ModalClientPage } from './modal-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalClientPageRoutingModule,
  ],
  declarations: [ModalClientPage],
})
export class ModalClientPageModule {}
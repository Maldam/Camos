import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalClientPage } from './modal-client.page';
import { AjouterClientPage } from 'src/app/ajouter-client/ajouter-client.page';

const routes: Routes = [
  {
    path: '',
    component: ModalClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],
})
export class ModalClientPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCommandesPage } from './modal-commandes.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCommandesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCommandesPageRoutingModule {}

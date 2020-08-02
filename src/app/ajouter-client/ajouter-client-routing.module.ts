import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjouterClientPage } from './ajouter-client.page';

const routes: Routes = [
  {
    path: '',
    component: AjouterClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjouterClientPageRoutingModule {}

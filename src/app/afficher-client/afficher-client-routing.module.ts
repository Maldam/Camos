import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfficherClientPage } from './afficher-client.page';

const routes: Routes = [
  {
    path: '',
    component: AfficherClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfficherClientPageRoutingModule {}

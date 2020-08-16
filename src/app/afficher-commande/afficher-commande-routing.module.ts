import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfficherCommandePage } from './afficher-commande.page';

const routes: Routes = [
  {
    path: '',
    component: AfficherCommandePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfficherCommandePageRoutingModule {}

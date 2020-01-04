import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfficherProduitPage } from './afficher-produit.page';

const routes: Routes = [
  {
    path: '',
    component: AfficherProduitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfficherProduitPageRoutingModule {}

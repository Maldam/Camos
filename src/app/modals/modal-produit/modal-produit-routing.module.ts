import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalProduitPage } from './modal-produit.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProduitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalProduitPageRoutingModule {}

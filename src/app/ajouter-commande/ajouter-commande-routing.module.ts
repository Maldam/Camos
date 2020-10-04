import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterCommandePage } from './ajouter-commande.page';
const routes: Routes = [
  {
    path: '',
    component: AjouterCommandePage
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjouterCommandePageRoutingModule { }
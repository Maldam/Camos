import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'produits',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./produits/produits.module').then(m => m.ProduitsPageModule)
          }
        ]
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./clients/clients.module').then(m => m.ClientsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/produits',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/produits',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'commandes',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./commandes/commandes.module').then(m => m.CommandesPageModule)
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
        redirectTo: '/tabs/commandes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/commandes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GardeConnexionService } from './services/garde-connexion.service';

const routes: Routes = [
  {
    path: 'connexion', 
    loadChildren: () => import('./connexion/connexion.module').then( m => m.ConnexionPageModule)
  },
  {
    path: '',canActivate: [GardeConnexionService],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'ajouter-produit', canActivate: [GardeConnexionService],
    loadChildren: () => import('./ajouter-produit/ajouter-produit.module').then( m => m.AjouterProduitPageModule)
  },
  {
    path: 'afficher-produit', canActivate: [GardeConnexionService],
    loadChildren: () => import('./afficher-produit/afficher-produit.module').then( m => m.AfficherProduitPageModule)
  },  {
    path: 'afficher-client',
    loadChildren: () => import('./afficher-client/afficher-client.module').then( m => m.AfficherClientPageModule)
  },
  {
    path: 'ajouter-client',
    loadChildren: () => import('./ajouter-client/ajouter-client.module').then( m => m.AjouterClientPageModule)
  },
  {
    path: 'ajouter-commande',
    loadChildren: () => import('./ajouter-commande/ajouter-commande.module').then( m => m.AjouterCommandePageModule)
  },
  {
    path: 'afficher-commande',
    loadChildren: () => import('./afficher-commande/afficher-commande.module').then( m => m.AfficherCommandePageModule)
  },
  {
    path: 'modal-client',
    loadChildren: () => import('./modals/modal-client/modal-client.module').then( m => m.ModalClientPageModule)
  },
  {
    path: 'modal-client',
    loadChildren: () => import('./modals/modal-client/modal-client.module').then( m => m.ModalClientPageModule)
  },
  {
    path: 'modal-produit',
    loadChildren: () => import('./modals/modal-produit/modal-produit.module').then( m => m.ModalProduitPageModule)
  },
  {
    path: 'modal-commandes',
    loadChildren: () => import('./modals/modal-commandes/modal-commandes.module').then( m => m.ModalCommandesPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
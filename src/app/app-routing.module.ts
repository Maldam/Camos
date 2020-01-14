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
    path: 'afficher-produit/:nom', canActivate: [GardeConnexionService],
    loadChildren: () => import('./afficher-produit/afficher-produit.module').then( m => m.AfficherProduitPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
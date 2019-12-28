import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

import { ProduitsPageRoutingModule } from './ajouter-produit-routing.module';

import { ProduitsPage } from './ajouter-produit.page';

@NgModule({

  imports: [

    IonicModule,

    CommonModule,

    FormsModule,

    RouterModule.forChild([{ path: '', component: ProduitsPage }])

  ],

  declarations: [ProduitsPage]

})

export class ProduitsPageModule {}
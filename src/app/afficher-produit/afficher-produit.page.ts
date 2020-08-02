import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController, AlertController } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-afficher-produit',
  templateUrl: './afficher-produit.page.html',
  styleUrls: ['./afficher-produit.page.scss'],
})
export class AfficherProduitPage implements OnInit {
  public estChange: boolean = false;
  public imageChange: boolean = false;
  public imageProduit: string;
  public form: FormGroup;
  public produit: ProduitModele = new ProduitModele();
  public image: string;
  public imageOrigine: string;
  constructor(private produitsService: ProduitsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController,

  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.produit = this.router.getCurrentNavigation().extras.state.data;
      }
    });
      this.imageOrigine = this.produit.imageURL
      this.imageProduit = this.imageOrigine
  }
  public async RemoveProduit(produit: ProduitModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + produit.nom + "?")) {
      this.produitsService.deleteProduit(produit);
      this.navCtrl.back()
    }
  }
  
  public async UpdateProduit(produit: ProduitModele, errorMessage: string) {

    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });   

    if (this.estChange || this.imageChange) {
      if (this.produitsService.numeroIndex(this.form.value.nomForm) === -1){
        if (confirm(errorMessage)) {
          this.produit.nom = this.form.value.nomForm;
          this.produit.quantite = this.form.value.quantiteForm;
          this.produit.prix = this.form.value.prixForm;
          this.produitsService.updateProduit(produit);
          this.estChange = false;
          this.navCtrl.back();
          if (this.imageChange) {
            this.produitsService.deleteImage(this.imageOrigine)
            var nomImage = 'Produits/' + this.produit.nom + '.jpg'
            this.produitsService.ajouterImage(nomImage, this.produit.imageURL)
            this.imageChange = false;
            this.navCtrl.back();
          }
        }
      } else {
        await articleExiste.present();
      }
    }
  }

  public async changerPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.produitsService.openLibrary();
      this.produit.imageURL = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.produitsService.openCamera();
      this.produit.imageURL = 'data:image/jpg;base64,' + cameraImage;
    }
 }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      nomForm: [this.produit.nom],
      quantiteForm: [this.produit.quantite],
      prixForm: [this.produit.prix]
    });
  }
}
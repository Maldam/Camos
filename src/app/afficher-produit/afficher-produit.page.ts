import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
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
  public nomChange: boolean = false;
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
    public loadingController: LoadingController,
    public alertController: AlertController,

  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.produit = this.router.getCurrentNavigation().extras.state.data;
      }
    });
    this.image = this.produit.imageURL
    //this.imageOrigine = this.produit.imageURL
    //this.imageProduit = this.imageOrigine
    console.log("3")
    console.log(this.imageOrigine)
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
    var changementNomOK = false;
    if (this.estChange) {
      if (this.nomChange) {
        if (this.produitsService.numeroIndex(this.form.value.nomForm) === -1) {
          changementNomOK = true
        }
      } else { changementNomOK = true }
      if (changementNomOK) {
        if (confirm(errorMessage)) {
          this.produit.nom = this.form.value.nomForm;
          this.produit.quantite = this.form.value.quantiteForm;
          this.produit.prix = this.form.value.prixForm;
          this.produit.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          this.nouvelleImage();
          this.produitsService.updateProduit(produit).then(ref => { this.navCtrl.back() });
          this.estChange = false;
          this.nomChange = false;
          this.imageChange = false;
          //this.navCtrl.back();
        } 
      } else {
        this.imageChange = false;
        await articleExiste.present();
      }
    }
    if (this.imageChange) {
      if (confirm(errorMessage)) {
        this.nouvelleImage();
        this.produitsService.updateProduit(produit).then(ref => { this.navCtrl.back() });
      }
    }
  }

  public async nouvelleImage() {
    const loading = await this.loadingController.create({
    });
    if (this.imageChange) {
      await loading.present();
      console.log("1")
      console.log(this.imageOrigine)
      this.produitsService.deleteImage(this.imageOrigine)
      var nomImage = 'Produits/' + this.produit.nom + '.jpg'
      this.produitsService.ajouterImage(nomImage, this.image).then(ref => {
        loading.dismiss();
      })
      this.image = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
      //this.produitsService.produit.imageURL = this.produit.imageURL
      this.imageChange = false;
    }
  }

  public async changerPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.produitsService.openLibrary();
      this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.produitsService.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
  }

  public ngOnInit() {
    console.log("2")
    console.log(this.imageOrigine)
    this.imageOrigine = this.produit.imageURL
    this.form = this.formBuilder.group({
      nomForm: [this.produit.nom],
      quantiteForm: [this.produit.quantite],
      prixForm: [this.produit.prix]
    });
  }
}
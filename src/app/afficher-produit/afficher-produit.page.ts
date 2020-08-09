import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-afficher-produit',
  templateUrl: './afficher-produit.page.html',
  styleUrls: ['./afficher-produit.page.scss'],
})
export class AfficherProduitPage implements OnInit {
  public estChange: boolean = false;
  public imageChange: boolean = false;
  public nomChange: boolean = false;
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
    //this.image = this.produit.imageURL
  }
  public async RemoveProduit(produit: ProduitModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + produit.nom + "?")) {
      this.produitsService.deleteProduit(produit);
      this.navCtrl.back()
    }
  }
  public async UpdateProduit(produit: ProduitModele, errorMessage: string) {
    const loading = await this.loadingController.create({
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de produit',
      buttons: ['OK']
    });


    var changementNomOK = false;
    if (this.estChange) {
      if (this.form.value.nomForm === "") {
        await alertNom.present();
      } else {
      if (this.nomChange) {
          if (this.produitsService.numeroIndex(this.form.value.nomForm) === -1) {
            changementNomOK = true
          }
      } else { changementNomOK = true }
      if (changementNomOK) {
        if (confirm(errorMessage)) {
          await loading.present();
         
         
          this.produit.nom = this.form.value.nomForm;
          this.produit.quantite = this.form.value.quantiteForm;
          this.produit.prix = this.form.value.prixForm;
        
          if (this.imageChange) {
           await this.nouvelleImage()
            this.produit.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          }
         await this.produitsService.updateProduit(produit).then(ref => { loading.dismiss()});
          this.estChange = false;
          this.nomChange = false;
          this.imageChange = false;
        }
      } else {
        await articleExiste.present();
      }
    }
  }
  }
  public async nouvelleImage() {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    try {
      this.produitsService.deleteImage(this.imageOrigine)
    } catch (error) {
      console.log("Pas d'image présente")
    }
    var nomImage = 'Produits/' + this.produit.nom + '.jpg'
    await this.produitsService.ajouterImage(nomImage, this.image).then(ref => { loading.dismiss() })
    this.image ='https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
    this.imageChange = false;
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
    this.image = this.produit.imageURL
    this.imageOrigine = this.produit.imageURL
   
    this.form = this.formBuilder.group({
      nomForm: [this.produit.nom],
      quantiteForm: [this.produit.quantite],
      prixForm: [this.produit.prix]
      
    });
  }
}
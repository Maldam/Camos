import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';

@Component({
  selector: 'app-produits',
  templateUrl: './ajouter-produit.page.html',
  styleUrls: ['./ajouter-produit.page.scss'],
})
export class AjouterProduitPage implements OnInit {
  public imageVide: string ='https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
  public image: string;
  public nomImage: string;
  public produit: ProduitModele = new ProduitModele();
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public categoriesProduits: Array<any> = new Array<any>()
  public typeProduitStatus: boolean = false
  public categorieProduitStatus: boolean = false
  public nouvelleCategorie: string  ="";

  constructor(
    private produitsService: ProduitsService,
    private camera: Camera,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) {
  }
  public async ajoutProduit(produit: AjouterProduitPage) {
    const loading = await this.loadingController.create({
    });
    const alert = await this.alertController.create({
      header: 'Félicitation',
      message: 'L\'article a bien été ajouté',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de produit',
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });
    var index = this.produitsService.numeroIndex(this.produit.nom);
    if (index === -1) {
      if (this.produit.nom == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        if (this.image == undefined) {
          //this.image = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
          await loading.dismiss();
          await alert.present();
        } else {
          this.nomImage = 'Produits/' + this.produit.nom + '.jpg';
          this.produitsService.ajouterImage(this.nomImage, this.image).then(ref => { this.image = this.imageVide; loading.dismiss(); alert.present(); })
          this.produit.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          //this.produitsService.angularFireStorage.ref('').getDownloadURL().subscribe(imageURL => { console.log(imageURL) })
        }
        if(this.categorieProduitStatus){
          this.produit.categorie = this.nouvelleCategorie
          this.produitsService.createCategorieProduit(this.produit)
          this.categorieProduitStatus=false
        }
        this.produitsService.createProduit(this.produit).then(ref => { this.produit = new ProduitModele });
      }
    } else {
      await articleExiste.present();
    }
  }
  public async ajouterPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.produitsService.openLibrary();
      this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.produitsService.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
    return this.image
  }
  public typeProduit(typeProduit){
    this.typeProduitStatus = true
    this.categorieProduitStatus = false
    this.produit.type = typeProduit
    this.produitsService.getCategoriesProduits(typeProduit).subscribe(categoriesProduits => {
      this.categoriesProduits = categoriesProduits;
    });
  }
  ajouterNouvelleCategorie(value){
  if(value === "Nouvelle catégorie"){
    //this.produit.categorie=""
    this.categorieProduitStatus = true
    } else {
      this.categorieProduitStatus=false
    }
  }
  public ngOnInit() {
  }
}
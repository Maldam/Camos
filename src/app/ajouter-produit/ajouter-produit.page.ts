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
  public imageVide: string;
  public image: string;
  public nomImage: string;
  public upload: any;
  public produit: ProduitModele = new ProduitModele();
  public produits: Array<ProduitModele> = new Array<ProduitModele>();

  constructor(
    private produitsService: ProduitsService,
    private camera: Camera,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) {
  }
  public async ajoutProduit(produit: AjouterProduitPage) {
    const loading = await this.loadingController.create({
      //  duration: 2000
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
    //var index = this.produits.findIndex(x => x.nom === this.produit.nom)
    //var index2 = this.produitsService.rechercheIndex()
    var test = this.produitsService.numeroIndex(this.produit.nom);  
    if ( test === -1) {
      if (this.produit.nom == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        if (this.image == this.imageVide) {
          this.upload = '';
          await loading.dismiss();
          await alert.present();
        } else {
          this.nomImage = 'Produits/' + this.produit.nom + '.jpg';
          this.upload = this.produitsService.angularFireStorage.ref(this.nomImage).putString(this.image, 'data_url')
            .then(ref => { this.image = this.imageVide; loading.dismiss(); alert.present(); })
          this.produit.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + this.produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
          //this.produitsService.angularFireStorage.ref('').getDownloadURL().subscribe(imageURL => { console.log(imageURL) })
        } 
        this.produitsService.createProduit(this.produit).then(ref => {
          this.produit = new ProduitModele;
        });
      }   
    } else {
      await articleExiste.present();
    }
  }
  public async ajouterPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.openLibrary();
      this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }
  }
  public async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  public async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }
  public ngOnInit() {
    this.imageVide = this.produit.imageURL;
    this.image = this.imageVide;
  }
}
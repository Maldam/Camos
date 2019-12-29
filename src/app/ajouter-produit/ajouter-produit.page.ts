import { Component, OnInit } from '@angular/core';
import { ListeProduitsService } from '../services/liste-produits.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-produits',
  templateUrl: './ajouter-produit.page.html',
  styleUrls: ['./ajouter-produit.page.scss'],
})

export class AjouterProduitPage implements OnInit {

  image = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg'
  imagePath: string;
  upload: any;

  produit = {
    nom:"",
    quantite: undefined,
    prix: undefined,

  }

  constructor(
    private listeProduits: ListeProduitsService,
    private camera: Camera,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public afSG: AngularFireStorage,
    ) {

  }

  async ajoutProduit(produit: AjouterProduitPage){


    const loading = await this.loadingController.create();
    await loading.present(); 
    this.imagePath = 'Produits/' + new Date().getTime() + '.jpg';
    this.upload = this.listeProduits.ajoutProduit(produit).then(ref => {});
    this.afSG.ref(this.imagePath).putString(this.image, 'data_url');
    this.upload.then(async () => { 
      this.produit = {
        nom: '',
        quantite: undefined,
        prix: undefined,
        }
      this.image = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg'
  
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Félicitation',
        message: 'L\'envoi de la photo dans Firebase est terminé!',
        buttons: ['OK']
      });
      await alert.present();
    });
  
  }

  async ajouterPhoto(source: string) {
    if (source == 'galerie') {
      const galerieImage = await this.openLibrary();
    this.image = 'data:image/jpg;base64,' + galerieImage;
    } else {
      const cameraImage = await this.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraImage;
    }

  }
  async openLibrary() {
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
  async openCamera() {
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


  


  ngOnInit() {

  }
}


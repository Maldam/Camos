import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ClientModele } from '../modeles/client.modele';
import { ClientsService } from '../services/clients.service';
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
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public categoriesProduits: Array<any> = new Array<any>();
  public typeProduitStatus: boolean = false;
  public categorieProduitStatus: boolean = false;
  public nouvelleCategorie: string  ="";
  private fournisseur: ClientModele = new ClientModele();


  constructor(private produitsService: ProduitsService,
    private clientsService: ClientsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
  private modalController: ModalController,

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
        } else { 
          changementNomOK = true }
        if (changementNomOK) {
          if (confirm(errorMessage)) {
            await loading.present();
            produit.nom = this.form.value.nomForm;
            produit.quantite = this.form.value.quantiteForm;
            produit.prix = this.form.value.prixForm;
            produit.codeProduit = this.form.value.codeProduitForm;
            produit.TVA = this.form.value.TVAForm;
            produit.codeProduitFournisseur = this.form.value.codeProduitFournisseurForm
            if (this.imageChange) { 
              var nouveauNomImage = produit.nom + Date.now()
              await this.nouvelleImage(produit,nouveauNomImage) 
              produit.imageURL = 'https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + nouveauNomImage + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
            }
            if(this.categorieProduitStatus){
              this.produit.categorie = this.nouvelleCategorie
              this.produitsService.createCategorieProduit(this.produit)
              this.categorieProduitStatus=false
            }
            await this.produitsService.updateProduit(produit).then(ref => {
              loading.dismiss();
            });
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
  public async nouvelleImage(produit: ProduitModele,nouveauNomImage: string) {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    try {
      this.produitsService.deleteImage(produit)
    } catch (error) {
      console.log("Pas d'image présente")
    }
    var nomImage = 'Produits/' + nouveauNomImage + '.jpg'
    await this.produitsService.ajouterImage(nomImage, this.image).then(ref => { loading.dismiss() })
    //this.image ='https://firebasestorage.googleapis.com/v0/b/camos-266e6.appspot.com/o/Produits%2F' + produit.nom + '.jpg?alt=media&token=03dbf0d3-b9d6-40ae-99c7-2af2486a69e5'
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
  public typeProduit(typeProduit){
    //this.estChange = true;
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
      }
    }
    public async choixFournisseurModal() {
      var entreprise: string ="Fournisseurs"
      const modal = await this.modalController.create({
        component: ModalClientPage,
        componentProps: { entreprise }
      });
      modal.onWillDismiss().then(dataReturned => {
        if(dataReturned.data){
          this.estChange=true
          this.fournisseur = dataReturned.data;
          this.produit.keyFournisseur = this.fournisseur.key
        }    
      })
      return await modal.present()
    }
  public ngOnInit() {
    this.image = this.produit.imageURL
    this.imageOrigine = this.produit.imageURL

    this.form = this.formBuilder.group({
      nomForm: [this.produit.nom],
      quantiteForm: [this.produit.quantite],
      prixForm: [this.produit.prix],
      codeProduitForm: [this.produit.codeProduit],
      TVAForm: [this.produit.TVA],
      codeProduitFournisseurForm:[this.produit.codeProduitFournisseur]
    });
    console.log(this.produit.keyFournisseur)
    this.clientsService.getClientSepare(this.produit.keyFournisseur).subscribe(fournisseurs => {
      fournisseurs.forEach(fournisseur=>{
        this.fournisseur = fournisseur;
      }) 
    });
    this.produitsService.getCategoriesProduits(this.produit.type).subscribe(categoriesProduits => {
      this.categoriesProduits = categoriesProduits;
    });
  }
}
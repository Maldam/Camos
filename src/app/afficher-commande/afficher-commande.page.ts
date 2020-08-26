import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommandesService } from '../services/commandes.service';
import { NavController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ClientModele } from '../modeles/client.modele';

@Component({
  selector: 'app-afficher-commande',
  templateUrl: './afficher-commande.page.html',
  styleUrls: ['./afficher-commande.page.scss'],
})
export class AfficherCommandePage implements OnInit {

  public estChange: boolean = false;
  public numeroChange: boolean = false;
  public form: FormGroup;
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public commandeProduit: CommandeProduitModele = new CommandeProduitModele();
  public listeCommandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public produit: ProduitModele;
  public nouveauxArticlesAjoutes: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public client: ClientModele;
  public total: number = null;
  public produitASupprimer: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();


  constructor(private commandesService: CommandesService,
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
        this.commande = this.router.getCurrentNavigation().extras.state.data;
      }
    });
  }
  public async RemoveCommande(commande: CommandeModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + commande.nomClient + "?")) {
      this.commandesService.deleteCommande(commande);
      this.commandesService.deleteCommandeProduit(this.commandesProduits)
      this.navCtrl.back()
    }
  }
  public async UpdateCommande(commande: CommandeModele, errorMessage: string) {
    const loading = await this.loadingController.create({
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cet article existe déjà',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un nom de commande',
      buttons: ['OK']
    });
    var changementNomOK = false;
    if (this.estChange) {
      if (this.form.value.nomForm === "") {
        await alertNom.present();
      } else {
        if (this.numeroChange) {
          if (this.commandesService.numeroIndex(this.form.value.nomForm) === -1) {
            changementNomOK = true
          }
        } else {
          changementNomOK = true
        }
        if (changementNomOK) {
          if (confirm(errorMessage)) {
            await loading.present();
            commande.numeroFacture = this.form.value.numeroFactureForm;
            commande.nomClient = this.form.value.nomClientForm;
            commande.prenomClient = this.form.value.prenomClientForm,
              commande.paysClient = this.form.value.paysClientForm,
              commande.provinceClient = this.form.value.provinceClientForm,
              commande.codePostalClient = this.form.value.codePostalClientForm,
              commande.localiteClient = this.form.value.localiteClientForm,
              commande.rueClient = this.form.value.rueClientForm,
              commande.numeroClient = this.form.value.numeroClientForm,
              commande.boiteClient = this.form.value.boiteClientForm,
              commande.numeroTVAClient = this.form.value.numeroTVAClientForm,
              commande.numeroTelephoneClient = this.form.value.numeroTelephoneClientForm,
              commande.numeroGSMClient = this.form.value.numeroGSMClientForm,
              commande.numeroFaxClient = this.form.value.numeroFaxClientForm,
              commande.emailClient = this.form.value.emailClientForm,
              commande.notes = this.form.value.notesForm,
              //commande.nomProduit = this.form.value.nomProduitForm,
              await this.commandesService.updateCommande(commande).then(ref => {
                loading.dismiss();
              });
            this.estChange = false;
            this.numeroChange = false;
          }
        } else {
          await articleExiste.present();
        }
      }
    }
    if (this.nouveauxArticlesAjoutes.length > 0) {
      this.nouveauxArticlesAjoutes.forEach(nouvelArticleAjoute => {
        this.commandesService.createCommandeProduit(nouvelArticleAjoute).then(x => { this.nouveauxArticlesAjoutes = new Array<CommandeProduitModele>() })
      });
    }
  }
  public async choixClientModal() {
    const modal = await this.modalController.create({
      component: ModalClientPage

    });
    modal.onWillDismiss().then(dataReturned => {
      this.client = dataReturned.data;
      this.form = this.formBuilder.group({
        numeroFactureForm: [this.commande.numeroFacture],
        nomClientForm: [this.client.nom],
        prenomClientForm: [this.client.prenom],
        paysClientForm: [this.client.pays],
        provinceClientForm: [this.client.province],
        codePostalClientForm: [this.client.codePostal],
        localiteClientForm: [this.client.localite],
        rueClientForm: [this.client.rue],
        numeroClientForm: [this.client.numero],
        boiteClientForm: [this.client.boite],
        numeroTVAClientForm: [this.client.numero],
        numeroTelephoneClientForm: [this.client.numero],
        numeroGSMClientForm: [this.client.numero],
        numeroFaxClientForm: [this.client.numero],
        emailClientForm: [this.client.email],
        notesForm: [this.commande.notes],
      });
      this.estChange = true
    })
    return await modal.present()
  }

  deleteProduit(produits: Array<CommandeProduitModele>,produit: CommandeProduitModele , i: number) {

    const index = produits.indexOf(produit, 0);
    if (i = 1) {
      if (index > -1) {
        this.nouveauxArticlesAjoutes.splice(index, 1);
      }
    }
    if (i=2){
      if (index > -1) {
        this.produitASupprimer.push(produit)
        this.commandesProduits.splice(index, 1);
        console.log(this.produitASupprimer)
      }

    }


    //this.calculPrix(produit)

  }

  public calculPrix(action) {
    console.log(action)
    action.array.forEach(element => {
      console.log(element)
    });
    if (action === "somme") {
      this.total = null;


      console.log(this.commandesProduits.forEach(element => { console.log("1") }))

      // this.commandesProduits.forEach(element => { console.log(element)
      // this.total += element.quantite * element.prix })
      //this.nouveauxArticlesAjoutes.forEach(element => { this.total += element.quantite * element.prix });
    }
    if (action === "ajouter") {
      //this.total = null;
      //this.commandesProduits.forEach(element => { this.total += element.quantite * element.prix });
    } else {
      //this.total = this.total-action.prix*action.quantite
    }
  }


  public rechercheCommande(commandesProduits) {
    //console.log(this.commande.numeroFacture)
    //console.log(commandesProduits)

    this.commandesProduits = commandesProduits.filter((commandeProduit: CommandeProduitModele) => {
      console.log(commandeProduit.numeroFacture)

      return (String(commandeProduit.numeroFacture).toLowerCase().indexOf(String(this.commande.numeroFacture).toLowerCase()) > -1);
    })
  }
  public async choixProduitModal() {
    const modal = await this.modalController.create({
      component: ModalProduitPage,

    });
    modal.onWillDismiss().then(dataReturned => {
      this.produit = dataReturned.data;
      if (this.produit.nom !== null) {
        let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
        commandeProduit.produitNom = this.produit.nom,
          commandeProduit.numeroFacture = this.commande.numeroFacture,
          commandeProduit.prix = this.produit.prix,
          commandeProduit.produitKey = this.produit.key,
          //this.commandesProduits.push(commandeProduit)
          this.nouveauxArticlesAjoutes.push(commandeProduit)
      }
    })
    return await modal.present()
  }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      numeroFactureForm: [this.commande.numeroFacture],
      nomClientForm: [this.commande.nomClient],
      prenomClientForm: [this.commande.prenomClient],
      paysClientForm: [this.commande.paysClient],
      provinceClientForm: [this.commande.provinceClient],
      codePostalClientForm: [this.commande.codePostalClient],
      localiteClientForm: [this.commande.localiteClient],
      rueClientForm: [this.commande.rueClient],
      numeroClientForm: [this.commande.numeroClient],
      boiteClientForm: [this.commande.boiteClient],
      numeroTVAClientForm: [this.commande.numeroTVAClient],
      numeroTelephoneClientForm: [this.commande.numeroTelephoneClient],
      numeroGSMClientForm: [this.commande.numeroGSMClient],
      numeroFaxClientForm: [this.commande.numeroFaxClient],
      emailClientForm: [this.commande.emailClient],
      notesForm: [this.commande.notes],
    });

    //console.log(this.commande.numeroFacture)
    this.commandesService.getCommandesProduits(this.commande.numeroFacture).subscribe(commandesProduits => {
      this.commandesProduits = commandesProduits;

    });

  }

}
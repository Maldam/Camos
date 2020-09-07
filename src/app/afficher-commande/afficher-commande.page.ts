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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DonneesEntrepriseModele } from '../modeles/donnees-entreprise.modele';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  public articlesModifies: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public client: ClientModele;
  public total: number = 0;
  public produitASupprimer: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public donneesEntreprise: DonneesEntrepriseModele = new DonneesEntrepriseModele();
  public totalTVA: number= 0;

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
    //if (confirm(errorMessage)) {
    await loading.present();
    if (this.estChange) {
      if (confirm(errorMessage)) {
        if (this.form.value.nomForm === "") {
          loading.dismiss();
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
            //if (confirm(errorMessage)) {
            commande.numeroCommande = this.form.value.numeroCommandeForm;
            commande.nomClient = this.form.value.nomClientForm;
            commande.pseudoClient = this.form.value.pseudoClientForm,
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
                //loading.dismiss();
              });
            this.estChange = false;
            this.numeroChange = false;
            //}
          } else {
            await articleExiste.present();
          }
        }
        //}
        if (this.nouveauxArticlesAjoutes.length > 0) {
          this.nouveauxArticlesAjoutes.forEach(nouvelArticleAjoute => {
            this.commandesService.createCommandeProduit(nouvelArticleAjoute).then(x => { this.nouveauxArticlesAjoutes = new Array<CommandeProduitModele>(), this.calculPrix() }
            )
          });
        }
        if (this.articlesModifies.length > 0) {
          this.articlesModifies.forEach(element => {
            this.commandesService.updateListeProduit(element).then(x => { this.articlesModifies = new Array<CommandeProduitModele>() })
          });
        }
        if (this.produitASupprimer.length > 0) {
          this.commandesService.deleteCommandeProduit(this.produitASupprimer)
          this.produitASupprimer = new Array<CommandeProduitModele>()
        }
      }
    }
    loading.dismiss();
    // }
  }
  public async choixClientModal() {
    const modal = await this.modalController.create({
      component: ModalClientPage
    });
    modal.onWillDismiss().then(dataReturned => {
      var client: ClientModele;
      client = dataReturned.data;
      if (client.nom !== null) {
        this.form = this.formBuilder.group({
          numeroCommandeForm: [this.commande.numeroCommande],
          nomClientForm: [client.nom],
          pseudoClientForm: [client.pseudo],
          paysClientForm: [client.pays],
          provinceClientForm: [client.province],
          codePostalClientForm: [client.codePostal],
          localiteClientForm: [client.localite],
          rueClientForm: [client.rue],
          numeroClientForm: [client.numero],
          boiteClientForm: [client.boite],
          numeroTVAClientForm: [client.numeroTVA],
          numeroTelephoneClientForm: [client.numeroTelephone],
          numeroGSMClientForm: [client.numeroGSM],
          numeroFaxClientForm: [client.numeroFax],
          emailClientForm: [client.email],
          notesForm: [this.commande.notes],
        });
        this.estChange = true
      }
    })
    return await modal.present()
  }
  deleteProduit(produits: Array<CommandeProduitModele>, produit: CommandeProduitModele, i: number) {
    const index = produits.indexOf(produit, 0);
    if (i === 1) {
      if (index > -1) {
        this.nouveauxArticlesAjoutes.splice(index, 1);
        this.calculPrix()
      }
    }
    if (i === 2) {
      if (index > -1) {
      this.estChange = true
        this.produitASupprimer.push(produit)
        this.commandesProduits.splice(index, 1);
        this.calculPrix()
      }
    }
  }
  public quantitePrixEstChange(commandeProduit: CommandeProduitModele, i: number) {
    //this.commandeProduit.prix = commandeProduit.prix
    if (i === 2) {
      this.articlesModifies.push(commandeProduit)
    }
    this.calculPrix()
  }
  public calculPrix() {
    this.total = null
    this.totalTVA = null
    this.commandesProduits.forEach(element => { this.total += ((element.prix*element.quantite-((element.prix*element.quantite)*element.pourcentageProduit/100))-((element.prix*element.quantite-(((element.prix*element.quantite)*element.pourcentageProduit/100)))*this.commande.pourcentageTotal/100)) });
    this.nouveauxArticlesAjoutes.forEach(element => { this.total += ((element.prix*element.quantite-((element.prix*element.quantite)*element.pourcentageProduit/100))-((element.prix*element.quantite-(((element.prix*element.quantite)*element.pourcentageProduit/100)))*this.commande.pourcentageTotal/100)) });
    this.commandesProduits.forEach(element => { this.totalTVA += ((((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100)- ((((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100))*this.commande.pourcentageTotal/100)});
    this.nouveauxArticlesAjoutes.forEach(element => { this.totalTVA += ((((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100)- ((((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100))*this.commande.pourcentageTotal/100)});

    //this.commandesProduits.forEach(element => { this.total += element.prix*element.quantite-((element.prix*element.quantite)*element.pourcentageProduit/100)});
    //this.nouveauxArticlesAjoutes.forEach(element => { this.total += element.prix*element.quantite-((element.prix*element.quantite)*element.pourcentageProduit/100)});
    //this.commandesProduits.forEach(element => { this.totalTVA += ((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100});
    //this.nouveauxArticlesAjoutes.forEach(element => { this.totalTVA += ((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))-((element.prix*element.quantite)+(element.prix*element.quantite)*(element.TVAProduit/100))*element.pourcentageProduit/100});
    ////this.nouveauxArticlesAjoutes.forEach(element => { this.total += element.quantite * element.prix });
    ////this.commandesProduits.forEach(element => { this.total += element.quantite * element.prix });
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
          commandeProduit.numeroCommande = this.commande.numeroCommande,
          commandeProduit.prix = this.produit.prix,
          commandeProduit.keyProduit = this.produit.key,
          commandeProduit.TVAProduit = this.produit.TVA
          commandeProduit.codeProduit = this.produit.codeProduit
          this.nouveauxArticlesAjoutes.push(commandeProduit)
      }
    })
    return await modal.present()
  }
  public genererPDF(){
    const documentDefinition = { content: [
      {
        text: this.donneesEntreprise.nom,
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      }, 
      {
        columns: [
          [{
            text: this.donneesEntreprise.nom,
            style: 'name'
          },
          {
            text: this.donneesEntreprise.rue + " " + this.donneesEntreprise.numero
          },
          {
            text: this.donneesEntreprise.codePostal + " " + this.donneesEntreprise.localite
          },
          {
            text: this.donneesEntreprise.province + " " + this.donneesEntreprise.pays
          },
          {
            text: "N° de TVA : "+ this.donneesEntreprise.numeroTVA
          },
          {
            text: "N° de compte : "+ this.donneesEntreprise.compteBancaire + "/ Bic : " + this.donneesEntreprise.numeroBic
          },
          {
            text: 'Email : ' + this.donneesEntreprise.email,
          },
          {
            text: 'GSM : ' + this.donneesEntreprise.numeroGSM,
          },
          {
            text: 'web : ' + this.donneesEntreprise.siteWeb,
            link: this.donneesEntreprise.siteWeb,
            color: 'blue',
          },
          {
            text: ' '
          }
          ],
        ]
      },
      {
        text: 'Récapitulatif de la commande numéro : ' + this.commande.numeroCommande,
        style: 'header',
        bold: true,
      },
      {
        text: ' '
      },
      this.getListeProduits(this.commandesProduits),
      {
        text: ' '
      },
      {
        text: ' '
      },
      {
        text: 'Total de la commande HTVA : ' + this.total + " €",
        style: 'header',
        bold: true,
      },
      {
        text: 'Montant total de la TVA : ' + this.totalTVA+ " €",
        style: 'header',
        bold: true,
      },
      {
        text: 'Total de la commande TVAC : ' + this.total + " €",
        style: 'header',
        bold: true,
      },
      {
        text: ' '
      },
      {
        text: ' '
      },
      {
        text: 'livraison prévue le : ' + this.commande.dateLivraison
      },
    ],
    info: {
      title: "Commande_"+this.commande.numeroCommande,
      author: this.donneesEntreprise.nom,
      subject: 'commande',
      keywords: 'commande',
    },}

    pdfMake.createPdf(documentDefinition).open();
  }
  getListeProduits(listeProduits: Array<CommandeProduitModele>) {
    return {
      table: {
        widths: ['*', '*', '*', '*','*', '*'],
        body: [
          [{
            text: 'Dénominations',
            style: 'tableHeader',
            bold: true,
          },
          {
            text: 'Quantitées',
            style: 'tableHeader',
            bold: true,
          },
          {
            text: 'Prix unitaire',
            style: 'tableHeader',
            bold: true,
          },
          {
            text: 'Réduction',
            style: 'tableHeader',
            bold: true,
          },
          {
            text: 'Montant HTVA',
            style: 'tableHeader',
            bold: true,
          },
          {
            text: 'TVA',
            style: 'tableHeader',
            bold: true,
          }
          ],
          ...listeProduits.map(ed => {
            return [ed.produitNom, ed.quantite, ed.prix +" €", ed.pourcentageProduit+" %", ed.prix*ed.quantite +" €", ed.TVAProduit+" €"];
          })
        ]
      }
    };
  }
  public ngOnInit() {
    this.form = this.formBuilder.group({
      numeroCommandeForm: [this.commande.numeroCommande],
      nomClientForm: [this.commande.nomClient],
      pseudoClientForm: [this.commande.pseudoClient],
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
    this.commandesService.getCommandesProduits(this.commande.numeroCommande).subscribe(commandesProduits => {
      this.commandesProduits = commandesProduits;
      this.calculPrix()
    });
  }
}
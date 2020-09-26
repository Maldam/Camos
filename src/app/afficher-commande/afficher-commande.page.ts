import { Component, OnInit, ɵConsole } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommandesService } from '../services/commandes.service';
import { NavController, LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ClientModele } from '../modeles/client.modele';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DonneesEntrepriseModele } from '../modeles/donnees-entreprise.modele';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { CoordonneesService } from '../services/coordonnees.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

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
  public totalTVA: number = 0;
  private coordonnees: Array<CoordonneesModele>;
  private pdfObj= null;
  constructor(private commandesService: CommandesService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private modalController: ModalController,
    private coordonneesService: CoordonneesService,
    private plt: Platform,
    private file: File, 
    private fileOpener: FileOpener,
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
              commande.numeroTVAClient = this.form.value.numeroTVAClientForm,
              commande.notes = this.form.value.notesForm,
              await this.commandesService.updateCommande(commande).then(ref => {
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
    var entreprise: string ="Clients"
    const modal = await this.modalController.create({
      component: ModalClientPage,
      componentProps: { entreprise }

    });
    modal.onWillDismiss().then(dataReturned => {
      if (dataReturned.data) {
      var client: ClientModele;
      client = dataReturned.data;
        this.form = this.formBuilder.group({
          numeroCommandeForm: [this.commande.numeroCommande],
          nomClientForm: [client.nom],
          pseudoClientForm: [client.pseudo],
          numeroTVAClientForm: [client.numeroTVA],
          notesForm: [this.commande.notes],
        });
        this.commande.keyClient = client.key
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
    this.total = 0
    this.totalTVA = 0
    this.commandesProduits.forEach(element => { this.total += ((element.prix * element.quantite - ((element.prix * element.quantite) * element.pourcentageProduit / 100)) - ((element.prix * element.quantite - (((element.prix * element.quantite) * element.pourcentageProduit / 100))) * this.commande.pourcentageTotal / 100)) });
    this.nouveauxArticlesAjoutes.forEach(element => { this.total += ((element.prix * element.quantite - ((element.prix * element.quantite) * element.pourcentageProduit / 100)) - ((element.prix * element.quantite - (((element.prix * element.quantite) * element.pourcentageProduit / 100))) * this.commande.pourcentageTotal / 100)) });
    this.commandesProduits.forEach(element => { this.totalTVA += ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100) - ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100)) * this.commande.pourcentageTotal / 100) });
    this.nouveauxArticlesAjoutes.forEach(element => { this.totalTVA += ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100) - ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100)) * this.commande.pourcentageTotal / 100) });
  }
  public async choixProduitModal() {
    const modal = await this.modalController.create({
      component: ModalProduitPage,
    });
    modal.onWillDismiss().then(dataReturned => {
      if (dataReturned.data) {
      this.produit = dataReturned.data;
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
  public genererPDF() {
  //  this.coordonnees.forEach(element=> console.log(element))

    const documentDefinition = {
      content: [
        this.getProfilePicObject(),
        {
          columns: [
            [{
              text: this.donneesEntreprise.nom,
              bold: true,
              style: 'name',
              fontSize: 20,
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
              text: "N° de TVA : " + this.donneesEntreprise.numeroTVA
            },
            {
              text: "N° de compte : " + this.donneesEntreprise.compteBancaire + "/ Bic : " + this.donneesEntreprise.numeroBic
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
          text: 'Réduction sur le total : ' + this.commande.pourcentageTotal + " €",
          style: 'header',
          bold: true,
        },
        {
          text: 'Total de la commande HTVA : ' + (this.total.toFixed(2)).replace('.', ',') + " €",
          style: 'header',
          bold: true,
        },
        {
          text: 'Montant total de la TVA : ' + ((this.totalTVA - this.total).toFixed(2)).replace('.', ',') + " €",
          style: 'header',
          bold: true,
        },
        {
          text: 'Total de la commande TVAC : ' + (this.totalTVA.toFixed(2)).replace('.', ',') + " €",
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
        title: "Commande_" + this.commande.numeroCommande,
        author: this.donneesEntreprise.nom,
        subject: 'commande',
        keywords: 'commande',
      },
    }
    this.pdfObj = pdfMake.createPdf(documentDefinition).open();
    // this.downloadPdf();
  }
  // public downloadPdf() {
  //   console.log ('0')

  //  // console.log(this.plt.is()
  //   if (this.plt.is('desktop')) {
  //     console.log ('1')

  //     this.pdfObj.getBuffer((buffer) => {
  //     console.log ('2')

  //       var blob = new Blob([buffer], { type: 'application/pdf' });
  //     console.log ('3')

 
  //       // Save the PDF to the data Directory of our App
  //       this.file.writeFile(this.file.dataDirectory, 'Commande.pdf', blob, { replace: true }).then(fileEntry => {
  //         // Open the PDf with the correct OS tools
  //     console.log ('4')
          
  //         this.fileOpener.open(this.file.dataDirectory + 'Commande.pdf', 'application/pdf');
  //       })
  //     });
  //   } else {
  //     // On a browser simply use download!
  //     this.pdfObj.download();
  //     console.log ('là')

  //   }
  // }
  public getListeProduits(listeProduits: Array<CommandeProduitModele>) {
    return {
      table: {
        widths: ['*', '*', '*', '*', '*', '*'],
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
            return [ed.produitNom, ed.quantite, ed.prix + " €", ed.pourcentageProduit + " %", ed.prix * ed.quantite + " €", ed.TVAProduit + " €"];
          })
        ]
      }
    };
  }
  getProfilePicObject() {
    if (this.donneesEntreprise.imageURL) {
      return {
        image: this.donneesEntreprise.imageURL,
        width: 150,
        alignment: 'center',
      };
    }
    return null;
  }
  public ngOnInit() {
    this.form = this.formBuilder.group({
      numeroCommandeForm: [this.commande.numeroCommande],
      nomClientForm: [this.commande.nomClient],
      pseudoClientForm: [this.commande.pseudoClient],
      numeroTVAClientForm: [this.commande.numeroTVAClient],
      notesForm: [this.commande.notes],
    });
    this.commandesService.getCommandesProduits(this.commande.numeroCommande).subscribe(commandesProduits => {
      this.commandesProduits = commandesProduits;
      this.calculPrix()
    });
    this.coordonneesService.getCoordonnees(this.commande.keyClient).subscribe(coordonneess => 
      this.coordonnees = coordonneess
      )
      //console.log(this.coordonnees[0])
  }
}
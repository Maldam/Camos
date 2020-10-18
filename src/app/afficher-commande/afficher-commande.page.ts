import { Component, OnInit, ɵConsole } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
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
//import { FileOpener } from '@ionic-native/file-opener/ngx';
//import { File } from '@ionic-native/file/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-afficher-commande',
  templateUrl: './afficher-commande.page.html',
  styleUrls: ['./afficher-commande.page.scss'],
})
export class AfficherCommandePage implements OnInit {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public commandeProduit: CommandeProduitModele = new CommandeProduitModele();
  public listeCommandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public produit: ProduitModele;
  private numeroLivraison: number = Date.now()
  private keyLivraison: string
  // public nouveauxArticlesAjoutes: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  //public articlesModifies: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public client: ClientModele;
  public total: number = 0;
  //public produitASupprimer: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public donneesEntreprise: DonneesEntrepriseModele = new DonneesEntrepriseModele();
  public totalTVA: number = 0;
  public typeCommandes: string;
  private commandeOuFacture: string = "Récapitulatif de la commande numéro : "
  private livraisons: boolean = false;
  private keyCommande: string;
  private pdf: boolean = true;
  private coordonnees: Array<CoordonneesModele>;
  private pdfObj = null;
  public dossierProduits: string = "CommandesProduits"
  private livraisonCree: boolean = false
  constructor(private commandesService: CommandesService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private modalController: ModalController,
    private coordonneesService: CoordonneesService,
    private plt: Platform,
    //private file: File,
    //private fileOpener: FileOpener,
  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.commande = this.router.getCurrentNavigation().extras.state.data;
        this.typeCommandes = this.router.getCurrentNavigation().extras.state.typeCommandes;
        this.livraisons = this.router.getCurrentNavigation().extras.state.livraisons;
        if (this.livraisons) {
          this.dossierProduits = "LivraisonsProduits"
          //this.keyCommande = this.commande.keyCommande
        } else {
          this.keyCommande = this.commande.key
        };

        if (this.livraisons && this.typeCommandes === "Clients") {
          this.commandeOuFacture = "Facture n° : "
        }
        if (this.typeCommandes !== "Clients") {
          this.pdf = false
        }
      }
    });
  }
  public async removeCommande(commande: CommandeModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + commande.nomClient + "?")) {
      this.commandesService.deleteCommande(commande, 'Commandes' + this.typeCommandes);
      this.commandesProduits.forEach(produit => {
        this.commandesService.deleteCommandeProduit(produit, this.typeCommandes)
      })
      this.navCtrl.back()
    }
  }
  public async updateCommande() {
    const loading = await this.loadingController.create({});
    loading.present();
    this.commandesService.updateCommande(this.commande, this.typeCommandes)
    loading.dismiss();
  }
  public async choixClientModal() {
    var entreprise: string = this.typeCommandes
    const modal = await this.modalController.create({
      component: ModalClientPage,
      componentProps: { entreprise }
    });
    modal.onWillDismiss().then(dataReturned => {
      if (dataReturned.data) {
        var client: ClientModele;
        client = dataReturned.data;
        this.commande.keyClient = client.key
        this.commande.nomClient = client.nom,
          this.commande.pseudoClient = client.pseudo,
          this.commande.numeroTVAClient = client.numeroTVA
        this.commande.keyClient = client.key
      }
    })
    return await modal.present()
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
          // commandeProduit.keyCommande = this.commande.key,
          commandeProduit.prix = this.produit.prixVente,
          commandeProduit.keyProduit = this.produit.key,
          commandeProduit.TVAProduit = this.produit.TVA
        commandeProduit.codeProduit = this.produit.codeProduit
        commandeProduit.keyCommande = this.commande.key
        this.commandesService.createCommandeProduit(commandeProduit, this.typeCommandes, 'CommandesProduits')
      }
    })
    return await modal.present()
  }
  deleteProduit(produit: CommandeProduitModele) {
    this.commandesService.deleteCommandeProduit(produit, this.typeCommandes)
    this.calculPrix()
  }
  public produitModifie(commandeProduit: CommandeProduitModele) {
    this.commandesService.updateCommandeProduit(commandeProduit, this.typeCommandes)
    this.calculPrix()
  }
  public calculPrix() {
    this.total = 0
    this.totalTVA = 0
    this.commandesProduits.forEach(element => { this.total += ((element.prix * element.quantite - ((element.prix * element.quantite) * element.pourcentageProduit / 100)) - ((element.prix * element.quantite - (((element.prix * element.quantite) * element.pourcentageProduit / 100))) * this.commande.pourcentageTotal / 100)) });
    //this.nouveauxArticlesAjoutes.forEach(element => { this.total += ((element.prix * element.quantite - ((element.prix * element.quantite) * element.pourcentageProduit / 100)) - ((element.prix * element.quantite - (((element.prix * element.quantite) * element.pourcentageProduit / 100))) * this.commande.pourcentageTotal / 100)) });
    this.commandesProduits.forEach(element => { this.totalTVA += ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100) - ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100)) * this.commande.pourcentageTotal / 100) });
    //this.nouveauxArticlesAjoutes.forEach(element => { this.totalTVA += ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100) - ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100)) * this.commande.pourcentageTotal / 100) });
  }
  public livrerProduit(commandeProduit: CommandeProduitModele) {
    if (!this.livraisonCree) {
      var livraison = { ...this.commande };
      livraison.commandeLivree = 1;
      if (this.typeCommandes === "Clients") {
        livraison.commandeFacturee = 'warning'
      }
      livraison.numeroCommande = this.numeroLivraison
      this.keyLivraison = this.commandesService.createCommande(livraison, 'Livraisons'+this.typeCommandes);
      this.livraisonCree = !this.livraisonCree;
    }
    commandeProduit.livree = 1;
    this.commandesService.updateCommandeProduit(commandeProduit, this.typeCommandes);
    commandeProduit.keyCommandeProduit = commandeProduit.key;
    commandeProduit.keyCommande = this.keyLivraison;
    this.commandesService.createCommandeProduit(commandeProduit, this.typeCommandes, 'LivraisonsProduits');
    var verificationCommandeLivree: boolean = true
    this.commandesProduits.forEach(produit => {
      if (produit.livree === 0) {
        verificationCommandeLivree = false
      }
    })
    if (verificationCommandeLivree) {
      this.commande.commandeLivree = 1
    } else {
      this.commande.commandeLivree = 0
      if (this.typeCommandes === "Clients") {
        this.commande.commandeFacturee = "medium"
      }
    }
    this.commandesService.updateCommande(this.commande, 'Commandes' + this.typeCommandes)
  }
  public genererPDF() {
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
          text: this.commandeOuFacture + this.commande.numeroCommande,
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
    if (this.commande.commandeFacturee !== "") {
      if (confirm('Si vous confirmez la génération du PDF, la commande sera considérée comme facturée.')) {
        this.pdfObj = pdfMake.createPdf(documentDefinition).open();
        this.commande.commandeFacturee = ""
        this.commandesService.updateCommande(this.commande, 'Livraisons' + this.typeCommandes)
      }
    } else {
      this.pdfObj = pdfMake.createPdf(documentDefinition).open();
    }
  }
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
    this.commandesService.getCommandesProduits(this.commande.key, this.typeCommandes, this.dossierProduits).subscribe(commandesProduits => {
      this.commandesProduits = commandesProduits;
      this.calculPrix()
    });
    this.coordonneesService.getCoordonnees(this.commande.keyClient).subscribe(coordonneess =>
      this.coordonnees = coordonneess
    )
  }
}
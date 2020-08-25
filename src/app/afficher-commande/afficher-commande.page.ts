import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommandesService } from '../services/commandes.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';

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

  constructor(private commandesService: CommandesService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public alertController: AlertController,
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
          changementNomOK = true }
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
  }
  public rechercheCommande(ev: any){    
      this.commandesProduits = this.commandesProduits.filter((commandesProduits: any) => {
        console.log(this.commandesProduits)
        return (commandesProduits.numeroFacture.toLowerCase().indexOf(ev.toLowerCase()) > -1);
        
      })
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
      //nomProduitForm: [this.commande.nomProduit],
    });
    this.commandesService.getCommandesProduits().subscribe(commandesProduits => {
      this.commandesProduits = commandesProduits;
      this.listeCommandesProduits = this.commandesProduits;
      this.rechercheCommande(this.commande.numeroFacture)  
    });
  }
}
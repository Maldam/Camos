import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { NavController } from '@ionic/angular';
import { ProduitModele } from '../modeles/produit.modele';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";


@Component({
  selector: 'app-afficher-produit',
  templateUrl: './afficher-produit.page.html',
  styleUrls: ['./afficher-produit.page.scss'],
})
export class AfficherProduitPage implements OnInit {

  public estChange: boolean = false;
  public form: FormGroup;

  public produit: ProduitModele = new ProduitModele();
  public produit2: ProduitModele = new ProduitModele();
  constructor(private produitsService: ProduitsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.produit = this.router.getCurrentNavigation().extras.state.data;
      }
    })

  }

  async RemoveProduit(produit: ProduitModele) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + produit.nom + "?")) {
      this.produitsService.deleteProduit(produit);
      this.navCtrl.back()
    }
  }
  async UpdateProduit(produit: ProduitModele, errorMessage: string) {


    if (confirm(errorMessage)) {

      this.produit.nom = this.form.value.nomForm;
      this.produit.quantite = this.form.value.quantiteForm;
      this.produit.prix = this.form.value.prixForm;
      this.produitsService.updateProduit(produit)

      //this.estChange = false
      this.navCtrl.back();
    } else {
      //this.produit = this.produit2;
    }

  }
  bouttonRetour() {

    this.produit = this.produit2;

  }
  sauvegardeDonnee() {
    this.produit2.nom = this.produit.nom
    this.produit2.quantite = this.produit.quantite
    this.produit2.prix = this.produit.prix
    this.produit2.imageURL = this.produit.imageURL
  }
  ngOnInit() {
    //this.sauvegardeDonnee();
    this.form = this.formBuilder.group({
      nomForm: [this.produit.nom],
      quantiteForm: [this.produit.quantite],
      prixForm: [this.produit.prix]
    });

  }
}
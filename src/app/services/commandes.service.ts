import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommandeModele } from '../modeles/commande.modele';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { ProduitModele } from '../modeles/produit.modele';
import { ProduitsService } from './produits.service';
import { ProduitsPage } from '../tabs/produits/produits.page';
@Injectable()
export class CommandesService {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public commandes2: Array<CommandeModele>;
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public listeProduits: Array<ProduitModele> = new Array<ProduitModele>();
  constructor(
    public produitsService: ProduitsService,
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    private camera: Camera,

  ) {
    this.getCommandes().subscribe(commandes => {
      this.commandes2 = commandes;
    });
  }
  public createCommande(commande: CommandeModele) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes/').push(commande)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getCommandes(): Observable<Array<CommandeModele>> {
    return new Observable<Array<CommandeModele>>(observer => {
      this.angularFireDatabase.list('Commandes/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(commandesRecus => {
        let commandes: Array<CommandeModele> = new Array<CommandeModele>();
        commandesRecus.forEach(commandeRecus => {
          let commande: CommandeModele = new CommandeModele();
          commande.key = commandeRecus.key,
            commande.numeroFacture = commandeRecus.payload.exportVal().numeroFacture,
            commande.nomClient = commandeRecus.payload.exportVal().nomClient,
            commande.prenomClient = commandeRecus.payload.exportVal().prenomClient,
            commande.paysClient = commandeRecus.payload.exportVal().paysClient,
            commande.provinceClient = commandeRecus.payload.exportVal().provinceClient,
            commande.codePostalClient = commandeRecus.payload.exportVal().codePostalClient,
            commande.localiteClient = commandeRecus.payload.exportVal().localiteClient,
            commande.rueClient = commandeRecus.payload.exportVal().rueClient,
            commande.numeroClient = commandeRecus.payload.exportVal().numeroClient,
            commande.boiteClient = commandeRecus.payload.exportVal().boiteClient,
            commande.numeroTVAClient = commandeRecus.payload.exportVal().numeroTVAClient,
            commande.numeroTelephoneClient = commandeRecus.payload.exportVal().numeroTelephoneClient,
            commande.numeroGSMClient = commandeRecus.payload.exportVal().numeroGSMClient,
            commande.numeroFaxClient = commandeRecus.payload.exportVal().numeroFaxClient,
            commande.emailClient = commandeRecus.payload.exportVal().emailClient,
            commande.notes = commandeRecus.payload.exportVal().notes,
            commande.nomProduit = commandeRecus.payload.exportVal().nomProduit,
            commande.pourcentageTotal = commandeRecus.payload.exportVal().pourcentageTotal,
            commande.montantFacture = commandeRecus.payload.exportVal().montantFacture,
          commandes.push(commande);
          observer.next(commandes);
        })
      });
    });
  }
  public updateCommande(commande: CommandeModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes/').update(commande.key, {
        numeroFacture: commande.numeroFacture,
        nomClient: commande.nomClient,
        prenomClient: commande.prenomClient,
        paysClient: commande.paysClient,
        provinceClient: commande.provinceClient,
        codePostalClient: commande.codePostalClient,
        localiteClient: commande.localiteClient,
        rueClient: commande.rueClient,
        numeroClient: commande.numeroClient,
        boiteClient: commande.boiteClient,
        numeroTVAClient: commande.numeroTVAClient,
        numeroTelephoneClient: commande.numeroTelephoneClient,
        numeroGSMClient: commande.numeroGSMClient,
        numeroFaxClient: commande.numeroFaxClient,
        emailClient: commande.emailClient,
        notes: commande.notes,
        nomProduit: commande.nomProduit,
        pourcentageTotal: commande.pourcentageTotal,
        montantFacture: commande.montantFacture,
    
    }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteCommande(commande: CommandeModele): void {
    this.angularFireDatabase.list('Commandes/').remove(commande.key).catch(error => console.log(error));
  }
  public numeroIndex(numeroCommande: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroFacture === numeroCommande)
    } catch (error) {
      return -1
    }
  }
  public createCommandeProduit(commandeProduit: CommandeProduitModele) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('CommandesProduits/').push(commandeProduit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public deleteCommandeProduit(commandesProduits: any): void {
    commandesProduits.forEach(commandeProduit => {
      this.angularFireDatabase.list('CommandesProduits/').remove(commandeProduit.key).catch(error => console.log(error));
    });
    
  }
  public getCommandesProduits(): Observable<Array<CommandeProduitModele>> {
    return new Observable<Array<CommandeProduitModele>>(observer => {
      this.angularFireDatabase.list('CommandesProduits/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(commandesProduitsRecus => {
        let commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
        commandesProduitsRecus.forEach(commandesProduitsRecus => {
          let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
          commandeProduit.key = commandesProduitsRecus.key,
          commandeProduit.produitNom = commandesProduitsRecus.payload.exportVal().nom,
          commandeProduit.prix = commandesProduitsRecus.payload.exportVal().prix,
          commandeProduit.quantite = commandesProduitsRecus.payload.exportVal().quantite,
          commandeProduit.imageURL = commandesProduitsRecus.payload.exportVal().imageURL,
          commandeProduit.numeroFacture = commandesProduitsRecus.payload.exportVal().numeroFacture,
          commandeProduit.produitKey = commandesProduitsRecus.payload.exportVal().produitKey,
          commandeProduit.pourcentageProduit = commandesProduitsRecus.payload.exportVal().pourcentageProduit, 
          commandesProduits.push(commandeProduit);
          observer.next(commandesProduits);
        })
      });
    });
  }
  public updateProduit(produit: ProduitModele): Promise<void> {
    
    //let produits: Array<ProduitModele> = new Array<ProduitModele>();
    
    this.produitsService.getProduits().subscribe(produits => {
      this.produits = produits;
      this.listeProduits = this.produits;
    });

    this.produits.find(e => e.key === produit.key)
  
    return new Promise<any>((resolve, reject) => {
     


      this.angularFireDatabase.list('Produits/').update(produit.key, { quantite: produit.quantite}).then(
        res => resolve(res),
        err => reject(err),
      )
      //firebase.storage().ref().child('Produits/' + produit.nom + '.jpg')
    })
  }
  public numeroIndexCommandeProduit(numeroFacture: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroFacture === numeroFacture)
    } catch (error) {
      return -1
    }
  }
}
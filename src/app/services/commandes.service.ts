import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommandeModele } from '../modeles/commande.modele';
import { Observable } from 'rxjs';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { ProduitModele } from '../modeles/produit.modele';
import { ProduitsService } from './produits.service';
import * as firebase from 'firebase/app';
@Injectable()
export class CommandesService {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public commandes2: Array<CommandeModele>;
  constructor(
    public produitsService: ProduitsService,
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
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
            commande.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
            commande.nomClient = commandeRecus.payload.exportVal().nomClient,
            commande.pseudoClient = commandeRecus.payload.exportVal().pseudoClient,
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
            commande.dateCommande = commandeRecus.payload.exportVal().dateCommande,
            commande.dateLivraison = commandeRecus.payload.exportVal().dateLivraison,
            commandes.push(commande);
          observer.next(commandes);
        })
      });
    });
  }
  public updateListeProduit(commandeProduit: CommandeProduitModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('CommandesProduits/').update(commandeProduit.key, {
        produitNom: commandeProduit.produitNom,
        prix: commandeProduit.prix,
        quantite: commandeProduit.quantite,
        imageURL: commandeProduit.imageURL,
        keyProduit: commandeProduit.keyProduit,
        pourcentageProduit: commandeProduit.pourcentageProduit,
        numeroCommande: commandeProduit.numeroCommande,
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public updateCommande(commande: CommandeModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes/').update(commande.key, {
        numeroCommande: commande.numeroCommande,
        nomClient: commande.nomClient,
        pseudoClient: commande.pseudoClient,
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
        dateLivraison: commande.dateLivraison,
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
      return this.commandes2.findIndex(x => x.numeroCommande === numeroCommande)
    } catch (error) {
      return -1
    }
  }
  public createCommandeProduit(commandeProduit: CommandeProduitModele) {
    return new Promise<any>((resolve, reject) => {
      console.log(commandeProduit.numeroCommande)
      
      this.angularFireDatabase.list('CommandesProduits/').push(commandeProduit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public deleteCommandeProduit(commandesProduits: any): void {
    commandesProduits.forEach(commandeProduit => {
      var total: number;
      var ref = firebase.database().ref('Produits/');
      ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
        total = snapshot.exportVal().quantite
      })
      var resultat: number = Number(total) + Number(commandeProduit.quantite)
      this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, { quantite: resultat })
      this.angularFireDatabase.list('CommandesProduits/').remove(commandeProduit.key).catch(error => console.log(error));
    });
  }
  public getCommandesProduits(numeroCommande: number): Observable<Array<CommandeProduitModele>> {
    return new Observable<Array<CommandeProduitModele>>(observer => {
      this.angularFireDatabase.list('CommandesProduits/', ref => ref.orderByChild('numeroCommande').equalTo(numeroCommande)).snapshotChanges().subscribe(
        commandesRecus => {
          let commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
          commandesRecus.forEach(commandeRecus => {
            let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
            commandeProduit.key = commandeRecus.key,
              commandeProduit.produitNom = commandeRecus.payload.exportVal().produitNom,
              commandeProduit.prix = commandeRecus.payload.exportVal().prix,
              commandeProduit.quantite = commandeRecus.payload.exportVal().quantite,
              commandeProduit.imageURL = commandeRecus.payload.exportVal().imageURL,
              commandeProduit.keyProduit = commandeRecus.payload.exportVal().keyProduit,
              commandeProduit.pourcentageProduit = commandeRecus.payload.exportVal().pourcentageProduit,
              commandeProduit.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
              commandesProduits.push(commandeProduit);
          })
          observer.next(commandesProduits);
        });
    });
  }
  public updateProduit(produit: ProduitModele) {
    var total: number;
    var ref = firebase.database().ref('Produits/');
    ref.child(produit.key).on("value", function (snapshot) {
      total = snapshot.exportVal().quantite
    })
    var resultat: number = total - produit.quantite
    this.angularFireDatabase.list('Produits/').update(produit.key, { quantite: resultat })
  }
  public numeroIndexCommandeProduit(numeroCommande: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroCommande === numeroCommande)
    } catch (error) {
      return -1
    }
  }
}
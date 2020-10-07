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
    // this.getCommandes().subscribe(commandes => {
    //   this.commandes2 = commandes;
    // });
  }
  public createCommande(commande: CommandeModele, dossierCommandes: string) {
    return this.angularFireDatabase.list(dossierCommandes).push(commande).key
  }
  public getCommandes(dossierCommandes: string, commandeLivree: number): Observable<Array<CommandeModele>> {
    return new Observable<Array<CommandeModele>>(observer => {
      this.angularFireDatabase.list(dossierCommandes, ref => ref.orderByChild('commandeLivree').equalTo(commandeLivree)).snapshotChanges([]).subscribe(commandesRecus => {
          let commandes: Array<CommandeModele> = new Array<CommandeModele>();
          commandesRecus.forEach(commandeRecus => {
            let commande: CommandeModele = new CommandeModele();
            commande.key = commandeRecus.key,
              commande.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
              commande.nomClient = commandeRecus.payload.exportVal().nomClient,
              commande.pseudoClient = commandeRecus.payload.exportVal().pseudoClient,
              commande.numeroTVAClient = commandeRecus.payload.exportVal().numeroTVAClient,
              commande.notes = commandeRecus.payload.exportVal().notes,
              //  commande.nomProduit = commandeRecus.payload.exportVal().nomProduit,
              commande.pourcentageTotal = commandeRecus.payload.exportVal().pourcentageTotal,
              // commande.montantFacture = commandeRecus.payload.exportVal().montantFacture,
              commande.dateCommande = commandeRecus.payload.exportVal().dateCommande,
              commande.dateLivraison = commandeRecus.payload.exportVal().dateLivraison,
              commande.keyClient = commandeRecus.payload.exportVal().keyClient,
              commande.commandeLivree = commandeRecus.payload.exportVal().commandeLivree,
              commande.commandeFacturee = commandeRecus.payload.exportVal().commandeFacturee,
              commande.keyCommande = commandeRecus.payload.exportVal().keyCommande,
              commandes.push(commande);
          observer.next(commandes);
          })
        });
    });
  }

  public getLivraisons(dossierCommandes: string, commandeLivree: number): Observable<Array<CommandeModele>> {
    return new Observable<Array<CommandeModele>>(observer => {
      this.angularFireDatabase.list(dossierCommandes, ref => ref.orderByChild('commandeLivree').equalTo(commandeLivree)).snapshotChanges(['child_changed','child_added','child_removed']).subscribe(commandesRecus => {
          let commandes: Array<CommandeModele> = new Array<CommandeModele>();
          commandesRecus.forEach(commandeRecus => {
            let commande: CommandeModele = new CommandeModele();
            commande.key = commandeRecus.key,
              commande.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
              commande.nomClient = commandeRecus.payload.exportVal().nomClient,
              commande.pseudoClient = commandeRecus.payload.exportVal().pseudoClient,
              commande.numeroTVAClient = commandeRecus.payload.exportVal().numeroTVAClient,
              commande.notes = commandeRecus.payload.exportVal().notes,
              //  commande.nomProduit = commandeRecus.payload.exportVal().nomProduit,
              commande.pourcentageTotal = commandeRecus.payload.exportVal().pourcentageTotal,
              // commande.montantFacture = commandeRecus.payload.exportVal().montantFacture,
              commande.dateCommande = commandeRecus.payload.exportVal().dateCommande,
              commande.dateLivraison = commandeRecus.payload.exportVal().dateLivraison,
              commande.keyClient = commandeRecus.payload.exportVal().keyClient,
              commande.commandeLivree = commandeRecus.payload.exportVal().commandeLivree,
              commande.commandeFacturee = commandeRecus.payload.exportVal().commandeFacturee,
              commande.keyCommande = commandeRecus.payload.exportVal().keyCommande,
              commandes.push(commande);
          observer.next(commandes);
          })
        });
    });
  }

  public updateCommandeProduit(commandeProduit: CommandeProduitModele, typeCommandes: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('CommandesProduits' + typeCommandes + '/').update(commandeProduit.key, {
        produitNom: commandeProduit.produitNom,
        prix: commandeProduit.prix,
        quantite: commandeProduit.quantite,
        //imageURL: commandeProduit.imageURL,
        keyProduit: commandeProduit.keyProduit,
        pourcentageProduit: commandeProduit.pourcentageProduit,
        keyCommande: commandeProduit.keyCommande,
        livree: commandeProduit.livree,
        keyCommandeProduit: commandeProduit.keyCommandeProduit
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public updateCommandeLivree(commande: CommandeModele, typeCommande: string) {
    this.angularFireDatabase.list('Commandes' + typeCommande + '/').update(commande.key, {
      commandeLivree: commande.commandeLivree,
      commandeFacturee: commande.commandeFacturee
    })
  }
  public updateCommande(commande: CommandeModele, dossierCommandes: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list(dossierCommandes).update(commande.key, {
        numeroCommande: commande.numeroCommande,
        nomClient: commande.nomClient,
        pseudoClient: commande.pseudoClient,
        numeroTVAClient: commande.numeroTVAClient,
        notes: commande.notes,
        //  nomProduit: commande.nomProduit,
        pourcentageTotal: commande.pourcentageTotal,
        // montantFacture: commande.montantFacture,
        dateLivraison: commande.dateLivraison,
        keyClient: commande.keyClient,
        commandeLivree: commande.commandeLivree,
        commandeFacturee: commande.commandeFacturee,
        keyCommande: commande.keyCommande,
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteCommande(commande: CommandeModele, dossierCommandes: string): void {
    this.angularFireDatabase.list(dossierCommandes).remove(commande.key).catch(error => console.log(error));
  }
  public numeroIndex(numeroCommande: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroCommande === numeroCommande)
    } catch (error) {
      return -1
    }
  }
  public createCommandeProduit(commandeProduit: CommandeProduitModele, typeCommande: string, dossier: string) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list(dossier + typeCommande).push(commandeProduit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public deleteCommandeProduit(commandeProduit: CommandeProduitModele, typeCommandes: string): void {
    var total: number;
    var ref = firebase.database().ref('Produits/');
    if (typeCommandes === 'Clients') {
      ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
        total = snapshot.exportVal().quantite
      })
      var resultat: number = Number(total) + Number(commandeProduit.quantite)
      this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, { quantite: resultat })
    } else {
      ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
        total = snapshot.exportVal().quantiteCommandee
        var resultat: number = Number(total) - Number(commandeProduit.quantite)
      this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, { quantiteCommandee: resultat })
      })
    }
    this.angularFireDatabase.list('CommandesProduits' + typeCommandes + '/').remove(commandeProduit.key).catch(error => console.log(error));
  }
  public getCommandesProduits(keyCommande: string, typeCommandes: string, dossier: string): Observable<Array<CommandeProduitModele>> {
    return new Observable<Array<CommandeProduitModele>>(observer => {
      this.angularFireDatabase.list(dossier + typeCommandes , ref => ref.orderByChild('keyCommande').equalTo(keyCommande)).snapshotChanges().subscribe(
        commandesRecus => {
          let commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
          commandesRecus.forEach(commandeRecus => {
            let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
            commandeProduit.key = commandeRecus.key,
              commandeProduit.produitNom = commandeRecus.payload.exportVal().produitNom,
              commandeProduit.prix = commandeRecus.payload.exportVal().prix,
              commandeProduit.quantite = commandeRecus.payload.exportVal().quantite,
              //commandeProduit.imageURL = commandeRecus.payload.exportVal().imageURL,
              commandeProduit.keyProduit = commandeRecus.payload.exportVal().keyProduit,
              commandeProduit.pourcentageProduit = commandeRecus.payload.exportVal().pourcentageProduit,
              commandeProduit.keyCommande = commandeRecus.payload.exportVal().keyCommande,
              commandeProduit.TVAProduit = commandeRecus.payload.exportVal().TVAProduit,
              commandeProduit.codeProduit = commandeRecus.payload.exportVal().codeProduit,
              commandeProduit.livree = commandeRecus.payload.exportVal().livree,
              commandeProduit.keyCommandeProduit = commandeRecus.payload.exportVal().keyCommandeProduit,

              commandesProduits.push(commandeProduit);
          })
          observer.next(commandesProduits);
        });
    });
  }
  public getCommandesSeparee(keyClient: string): Observable<Array<CommandeModele>> {
    return new Observable<Array<CommandeModele>>(observer => {
      this.angularFireDatabase.list('CommandesClients/', ref => ref.orderByChild('keyClient').equalTo(keyClient)).snapshotChanges().subscribe(
        commandesRecus => {
          let commandes: Array<CommandeModele> = new Array<CommandeModele>();
          commandesRecus.forEach(commandeRecus => {
            let commande: CommandeModele = new CommandeModele();
            commande.key = commandeRecus.key,
              commande.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
              commande.nomClient = commandeRecus.payload.exportVal().nomClient,
              commande.pseudoClient = commandeRecus.payload.exportVal().pseudoClient,
              commande.numeroTVAClient = commandeRecus.payload.exportVal().numeroTVAClient,
              commande.notes = commandeRecus.payload.exportVal().notes,
              //commande.nomProduit = commandeRecus.payload.exportVal().nomProduit,
              commande.pourcentageTotal = commandeRecus.payload.exportVal().pourcentageTotal,
              //  commande.montantFacture = commandeRecus.payload.exportVal().montantFacture,
              commande.dateCommande = commandeRecus.payload.exportVal().dateCommande,
              commande.dateLivraison = commandeRecus.payload.exportVal().dateLivraison,
              commande.keyClient = commandeRecus.payload.exportVal().keyClient,
              commandes.push(commande);
          })
          observer.next(commandes);
        });
    });
  }
  public updateProduitsLivres(commandeProduit: CommandeProduitModele, dejaArchive: number) {
    var total: number;
    var totalCommande: number;
    var ref = firebase.database().ref('Produits/');
    if (dejaArchive === 0) {
      ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
        total = snapshot.exportVal().quantite
        totalCommande = snapshot.exportVal().quantiteCommandee
      })
      var quantite: number = Number(total) + Number(commandeProduit.quantite)
      var quantiteCommandee: number = Number(totalCommande) - Number(commandeProduit.quantite)
      this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, {
        quantiteCommandee: quantiteCommandee,
        quantite: quantite
      })
    } else {
      ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
        total = snapshot.exportVal().quantite
        totalCommande = snapshot.exportVal().quantiteCommandee
      })
      var quantite: number = Number(total) - Number(commandeProduit.quantite)
      var quantiteCommandee: number = Number(totalCommande) + Number(commandeProduit.quantite)
      this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, {
        quantiteCommandee: quantiteCommandee,
        quantite: quantite
      })
    }
  }
  public updateProduit(produit: ProduitModele) {
    var total: number;
    var ref = firebase.database().ref('Produits/');
    if (produit.quantiteCommandee === 0) {
      ref.child(produit.key).on("value", function (snapshot) {
        total = snapshot.exportVal().quantite
      })
      var resultat: number = total - produit.quantite
      this.angularFireDatabase.list('Produits/').update(produit.key, { quantite: resultat })
    } else {
      ref.child(produit.key).on("value", function (snapshot) {
        total = snapshot.exportVal().quantiteCommandee
      })
      var resultat: number = Number(total) + Number(produit.quantiteCommandee)
      this.angularFireDatabase.list('Produits/').update(produit.key, { quantiteCommandee: resultat })
    }
  }
  public numeroIndexCommandeProduit(numeroCommande: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroCommande === numeroCommande)
    } catch (error) {
      return -1
    }
  }
}
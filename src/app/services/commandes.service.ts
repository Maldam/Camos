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
  public createCommande(commande: CommandeModele, typeCommandes: string) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes'+typeCommandes+'/').push(commande)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getCommandes(typeCommande:string): Observable<Array<CommandeModele>> {
    return new Observable<Array<CommandeModele>>(observer => {
      this.angularFireDatabase.list('Commandes'+typeCommande+'/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(commandesRecus => {
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
            commande.keyClient = commandeRecus.payload.exportVal().keyClient       
            commandes.push(commande);
          observer.next(commandes);
        })
      });
    });
  }
  public updateListeProduit(commandeProduit: CommandeProduitModele, typeCommandes: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('CommandesProduits'+typeCommandes+'/').update(commandeProduit.key, {
        produitNom: commandeProduit.produitNom,
        prix: commandeProduit.prix,
        quantite: commandeProduit.quantite,
        //imageURL: commandeProduit.imageURL,
        keyProduit: commandeProduit.keyProduit,
        pourcentageProduit: commandeProduit.pourcentageProduit,
        numeroCommande: commandeProduit.numeroCommande,
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public updateCommande(commande: CommandeModele, typeCommandes: string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes'+typeCommandes+'/').update(commande.key, {
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
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteCommande(commande: CommandeModele, typeCommandes: string): void {
    this.angularFireDatabase.list('Commandes'+typeCommandes+'/').remove(commande.key).catch(error => console.log(error));
  }
  public numeroIndex(numeroCommande: any) {
    try {
      return this.commandes2.findIndex(x => x.numeroCommande === numeroCommande)
    } catch (error) {
      return -1
    }
  }
  public createCommandeProduit(commandeProduit: CommandeProduitModele, typeCommande: string ) {
    return new Promise<any>((resolve, reject) => {      
      this.angularFireDatabase.list('CommandesProduits'+typeCommande+'/').push(commandeProduit)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public deleteCommandeProduit(commandesProduits: any, typeCommandes: string): void {
    commandesProduits.forEach(commandeProduit => {
      var total: number;
      var ref = firebase.database().ref('Produits/');
      if(typeCommandes === 'Clients'){
        ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
          total = snapshot.exportVal().quantite
        })
        var resultat: number = Number(total) + Number(commandeProduit.quantite)
        this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, { quantite: resultat })
      } else {
        console.log("ici1")
        ref.child(commandeProduit.keyProduit).on("value", function (snapshot) {
          total = snapshot.exportVal().quantiteCommandee
          console.log(total)
          console.log(commandeProduit.quantiteCommandee)

        })
        var resultat: number = Number(total) - Number(commandeProduit.quantite)
        console.log(resultat)
        this.angularFireDatabase.list('Produits/').update(commandeProduit.keyProduit, { quantiteCommandee: resultat })
        console.log("là")
      }
      
      


      this.angularFireDatabase.list('CommandesProduits'+typeCommandes+'/').remove(commandeProduit.key).catch(error => console.log(error));
    });
  }
  public getCommandesProduits(numeroCommande: number, typeCommandes: string): Observable<Array<CommandeProduitModele>> {
    return new Observable<Array<CommandeProduitModele>>(observer => {
      this.angularFireDatabase.list('CommandesProduits'+typeCommandes+'/', ref => ref.orderByChild('numeroCommande').equalTo(numeroCommande)).snapshotChanges().subscribe(
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
              commandeProduit.numeroCommande = commandeRecus.payload.exportVal().numeroCommande,
              commandeProduit.TVAProduit = commandeRecus.payload.exportVal().TVAProduit,
              commandeProduit.codeProduit = commandeRecus.payload.exportVal().codeProduit,
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

  public updateProduit(produit: ProduitModele) {
    var total: number;
    var ref = firebase.database().ref('Produits/');

    if(produit.quantiteCommandee === 0){
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
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommandeModele } from '../modeles/commande.modele';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable()
export class CommandesService {
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public commandes2: Array<CommandeModele>;
  constructor(
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
}
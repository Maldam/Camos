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
            commande.numero = commandeRecus.payload.exportVal().numero,
            //commande.prenom = commandeRecus.payload.exportVal().prenom,
            //commande.pays = commandeRecus.payload.exportVal().pays,
            //commande.province = commandeRecus.payload.exportVal().province,
            //commande.codePostal = commandeRecus.payload.exportVal().codePostal,
            //commande.localite = commandeRecus.payload.exportVal().localite,
            //commande.rue = commandeRecus.payload.exportVal().rue,
            //commande.numero = commandeRecus.payload.exportVal().numero,
            //commande.boite = commandeRecus.payload.exportVal().boite,
            //commande.imageURL = commandeRecus.payload.exportVal().imageURL
          commandes.push(commande);
          observer.next(commandes);
        })
      });
    });
  }
  public updateCommande(commande: CommandeModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Commandes/').update(commande.key, { nom: commande.numero,
        //prenom: commande.prenom,
        //pays: commande.pays,
        //province: commande.province,
        //codePostal: commande.codePostal,
        //localite: commande.localite,
        //rue: commande.rue,
        //numero: commande.numero,
        //boite: commande.boite, 
        //imageURL: commande.imageURL
    
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
      return this.commandes2.findIndex(x => x.numero === numeroCommande)
    } catch (error) {
      return -1
    }
  }
}
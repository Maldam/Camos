import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { Observable } from 'rxjs';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable()
export class CoordonneesService {
  public Coordonnees: CoordonneesModele = new CoordonneesModele();
  public coordonneess: Array<CoordonneesModele> = new Array<CoordonneesModele>();
  public coordonneess2: Array<CoordonneesModele>;
  public image: string;
  public test: string
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    private camera: Camera,
  ) {
  }
  public createCoordonnees(coordonnees: CoordonneesModele) {
  this.angularFireDatabase.list('Coordonnees/').push(coordonnees).key  
    
    // return new Promise<any>((resolve, reject) => {
    // var test =  this.angularFireDatabase.list('Coordonneess/').push(coordonnees)
    //     .then(
    //       res => resolve(res),
    //       err => reject(err)
    //     )

    // })
  }
  public getCoordonnees(keyContact: string): Observable<Array<CoordonneesModele>> {
    //  console.log(keyClient)
    return new Observable<Array<CoordonneesModele>>(observer => {
      this.angularFireDatabase.list('Coordonnees/', ref => ref.orderByChild('keyContact').equalTo(keyContact)).snapshotChanges().subscribe(coordonneessRecus => {
        let coordonneess: Array<CoordonneesModele> = new Array<CoordonneesModele>();
        coordonneessRecus.forEach(coordonneesRecus => {
          let coordonnees: CoordonneesModele = new CoordonneesModele();
          coordonnees.key = coordonneesRecus.key,
            coordonnees.type = coordonneesRecus.payload.exportVal().type,
            coordonnees.fonction = coordonneesRecus.payload.exportVal().fonction,
            coordonnees.pays = coordonneesRecus.payload.exportVal().pays,
            coordonnees.province = coordonneesRecus.payload.exportVal().province,
            coordonnees.codePostal = coordonneesRecus.payload.exportVal().codePostal,
            coordonnees.localite = coordonneesRecus.payload.exportVal().localite,
            coordonnees.rue = coordonneesRecus.payload.exportVal().rue,
            coordonnees.numero = coordonneesRecus.payload.exportVal().numero,
            coordonnees.boite = coordonneesRecus.payload.exportVal().boite,
            coordonnees.keyContact = coordonneesRecus.payload.exportVal().keyContact,
            coordonnees.numeroTelephone = coordonneesRecus.payload.exportVal().numeroTelephone,
            coordonnees.numeroGSM = coordonneesRecus.payload.exportVal().numeroGSM,
            coordonnees.numeroFax = coordonneesRecus.payload.exportVal().numeroFax,
            coordonnees.email = coordonneesRecus.payload.exportVal().email,
          coordonneess.push(coordonnees);
          
        })
        observer.next(coordonneess);
      });
    });
  }

  public updateCoordonnees(coordonnees: CoordonneesModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Coordonnees/').update(coordonnees.key, { 
        fonction: coordonnees.fonction, 
        type: coordonnees.type,
        pays: coordonnees.pays,
        province: coordonnees.province,
        codePostal: coordonnees.codePostal,
        localite: coordonnees.localite,
        rue: coordonnees.rue,
        numero: coordonnees.numero,
        boite: coordonnees.boite,
        keyContact: coordonnees.keyContact,
        numeroTelephone: coordonnees.numeroTelephone,
        numeroGSM: coordonnees.numeroGSM,
        numeroFax: coordonnees.numeroFax,
        email: coordonnees.email,
        }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteCoordonnees(coordonnees: CoordonneesModele): void {
    this.angularFireDatabase.list('Coordonnees/').remove(coordonnees.key).then(() => {
    }).catch(error => console.log(error));
  }

//   public recuperationKey(coordonnees:CoordonneesModele): Observable<Array<CoordonneesModele>> {
//     return new Observable<Array<CoordonneesModele>>(observer => {
//       this.angularFireDatabase.list('Coordonnees/', ref => ref.orderByChild('keyContact').equalTo(coordonnees.keyContact)).snapshotChanges().subscribe(
//         coordonneessRecus => {
//           let coordonneess: Array<CoordonneesModele> = new Array<CoordonneesModele>();
//           coordonneessRecus.forEach(coordonneesRecus => {
//             let coordonnees: CoordonneesModele = new CoordonneesModele();
//             coordonnees.key = coordonneesRecus.key,      
//             coordonneess.push(coordonnees);
//           })
//           observer.next(coordonneess);
//         });
//     });
//   }
 }

// this.coordonneessService.rechercheAdresse(this.coordonnees).subscribe(commandesProduits => {
//   //this.test = commandesProduits;
//   commandesProduits.forEach(rep =>{console.log(rep.key)})
// });
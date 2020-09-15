import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ContactModele } from '../modeles/contact.modele';
@Injectable()
export class ContactsService {
  public coordonneess: Array<ContactModele> = new Array<ContactModele>();
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
  ) {
  }
  public createCoordonnees(coordonnees: ContactModele) {
    this.angularFireDatabase.list('Coordonnees/').push(coordonnees)
  }
  public getCoordonnees(keyContact: string): Observable<Array<ContactModele>> {
    return new Observable<Array<ContactModele>>(observer => {
      this.angularFireDatabase.list('Coordonnees/', ref => ref.orderByChild('keyContact').equalTo(keyContact)).snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(coordonneessRecus => {
        let coordonneess: Array<ContactModele> = new Array<ContactModele>();
        coordonneessRecus.forEach(coordonneesRecus => {
          let coordonnees: ContactModele = new ContactModele();
          coordonnees.key = coordonneesRecus.key,
            coordonnees.keyEntreprise = coordonneesRecus.payload.exportVal().keyContact,
          coordonneess.push(coordonnees);
        })
        observer.next(coordonneess);
      });
    });
  }
  public updateCoordonnees(coordonnees: ContactModele): Promise<void> {
    console.log("ici")
    console.log(coordonnees.key)
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Coordonnees/').update(coordonnees.key, { 
        fonction: coordonnees.fonction, 
        type: coordonnees.type,
        }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteCoordonnees(coordonnees: ContactModele): void {
    this.angularFireDatabase.list('Coordonnees/').remove(coordonnees.key).then(() => {
    }).catch(error => console.log(error));
  }
 }

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ContactModele } from '../modeles/contact.modele';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { CoordonneesService } from './coordonnees.service';
@Injectable()
export class ContactsService {
  public contacts: Array<ContactModele> = new Array<ContactModele>();
  public contacts2: Array<ContactModele> = new Array<ContactModele>();
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public coordonneesService: CoordonneesService,
  ) {
    this.getContacts().subscribe(contacts => {
      this.contacts2 = contacts;
    });
  }
  public createContact(contacts: ContactModele, coordonnees: CoordonneesModele) {
    coordonnees.keyContact = this.angularFireDatabase.list('Contacts/').push(contacts).key
    this.coordonneesService.createCoordonnees(coordonnees)
  }
  public getContacts(): Observable<Array<ContactModele>> {
    return new Observable<Array<ContactModele>>(observer => {
      this.angularFireDatabase.list('Contacts/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(contactsRecus => {
        let contacts: Array<ContactModele> = new Array<ContactModele>();
        contactsRecus.forEach(contactRecus => {
          let contact: ContactModele = new ContactModele();
          contact.key = contactRecus.key,
            contact.nom = contactRecus.payload.exportVal().nom,
            contact.prenom = contactRecus.payload.exportVal().prenom,
            contact.pseudo = contactRecus.payload.exportVal().pseudo,
            contact.fonction = contactRecus.payload.exportVal().fonction,
            contact.keyEntreprise = contactRecus.payload.exportVal().keyEntreprise,
            contact.notes = contactRecus.payload.exportVal().notes,
          contacts.push(contact);
          observer.next(contacts);
        })
      });
    });
  }
  public getContactsClient(keyEntreprise: string): Observable<Array<ContactModele>> {
    console.log('ici '+ keyEntreprise)
    return new Observable<Array<ContactModele>>(observer => {
      this.angularFireDatabase.list('Contacts/', ref => ref.orderByChild('keyEntreprise').equalTo(keyEntreprise)).snapshotChanges().subscribe(contactsRecus => {
        let contacts: Array<ContactModele> = new Array<ContactModele>();
        contactsRecus.forEach(contactRecus => {
          let contact: ContactModele = new ContactModele();
          contact.key = contactRecus.key,
            contact.nom = contactRecus.payload.exportVal().nom,
            contact.prenom = contactRecus.payload.exportVal().prenom,
            contact.pseudo = contactRecus.payload.exportVal().pseudo,
            contact.fonction = contactRecus.payload.exportVal().fonction,
            contact.keyEntreprise = contactRecus.payload.exportVal().keyEntreprise,
            contact.notes = contactRecus.payload.exportVal().notes
            contacts.push(contact);

            console.log('là '+contact.keyEntreprise)
        })
        observer.next(contacts);
      });
    });
  }
  public updateContacts(contact: ContactModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Contacts/').update(contact.key, { 
        fonction: contact.fonction,
        nom: contact.nom,
        prenom: contact.prenom,
        pseudo: contact.pseudo,
        notes: contact.notes,
        keyEntreprise: contact.keyEntreprise
        }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteContacts(contact: ContactModele): void {
    this.angularFireDatabase.list('Contact/').remove(contact.key).then(() => {
    }).catch(error => console.log(error));
  }
  public numeroIndex(nomContact: any) {
    try {
      return this.contacts2.findIndex(x => x.nom === nomContact)
    } catch (error) {
      return -1
    }
  }
 }

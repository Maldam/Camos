import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ClientModele } from '../modeles/client.modele';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CoordonneesModele } from '../modeles/coordonnees.modele';
import { CoordonneesService } from './coordonnees.service';
import { ContactsService } from './contacts.service';
import { ContactModele } from '../modeles/contact.modele';
@Injectable()
export class ClientsService {
  public client: ClientModele = new ClientModele();
  public imageVide: string = this.client.imageURL;
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public clients2: Array<ClientModele>;
  public image: string;
  public test: string
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public coordonneesService: CoordonneesService,
    public contactsService: ContactsService,
    private camera: Camera,
  ) {
    //  this.getClients('Clients').subscribe(clients => {
    //    this.clients2 = clients;
    //  });
  }
  public createClient(client: ClientModele, coordonnees: CoordonneesModele, dossier: string) {
    var keyClient = this.angularFireDatabase.list(dossier).push(client).key
    coordonnees.keyContact = keyClient
    this.coordonneesService.createCoordonnees(coordonnees)
  }
  public ajouterImage(nomImage: string, image: string) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireStorage.ref(nomImage).putString(image, 'data_url')
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }
  public getClients(dossier:string): Observable<Array<ClientModele>> {
    return new Observable<Array<ClientModele>>(observer => {
      this.angularFireDatabase.list('/'+dossier).snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(clientsRecus => {
        let clients: Array<ClientModele> = new Array<ClientModele>();
        clientsRecus.forEach(clientRecus => {
          let client: ClientModele = new ClientModele();
          client.key = clientRecus.key,
            client.nom = clientRecus.payload.exportVal().nom,
            client.pseudo = clientRecus.payload.exportVal().pseudo,
            client.numeroTVA = clientRecus.payload.exportVal().numeroTVA,
            client.notes = clientRecus.payload.exportVal().notes,
            client.siteWeb = clientRecus.payload.exportVal().siteWeb
          client.imageURL = clientRecus.payload.exportVal().imageURL
          clients.push(client);
          observer.next(clients);
        })
      });
    });
  }
  public updateClient(client: ClientModele, dossier:string): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list(dossier+'/').update(client.key, {
        nom: client.nom,
        pseudo: client.pseudo,
        numeroTVA: client.numeroTVA,
        notes: client.notes,
        siteWeb: client.siteWeb,
        imageURL: client.imageURL
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteClient(client: ClientModele, coordonnees: CoordonneesModele, contacts: Array<ContactModele>, dossier:string): void {
    this.angularFireDatabase.list(dossier+'/').remove(client.key).then(() => {
      if (client.imageURL == undefined) {
      } else {
        if (client.imageURL == this.imageVide) {
        } else {
          this.deleteImage(client.imageURL)
        }
      }
    }).catch(error => console.log(error));
    this.coordonneesService.deleteCoordonnees(coordonnees)
    console.log('là')
    contacts.forEach(contact => {
      this.coordonneesService.getCoordonnees(contact.key).subscribe(coordonneess => {
        console.log('coordonnees')
        coordonneess.forEach(coordonnees => {
          this.contactsService.deleteContact(contact, coordonnees)
        })
      })
    })
  }
  public numeroIndex(nomClient: any) {
    try {
      return this.clients2.findIndex(x => x.nom === nomClient)
    } catch (error) {
      return -1
    }
  }
  public deleteImage(imageASupprimer: any) {
    this.angularFireStorage.storage.refFromURL(imageASupprimer).delete();
  }
  public async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  public async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }
  public recuperationKey(client: ClientModele): Observable<Array<ClientModele>> {
    return new Observable<Array<ClientModele>>(observer => {
      this.angularFireDatabase.list('Clients/', ref => ref.orderByChild('pseudo').equalTo(client.pseudo)).snapshotChanges().subscribe(
        clientsRecus => {
          let clients: Array<ClientModele> = new Array<ClientModele>();
          clientsRecus.forEach(clientRecus => {
            let client: ClientModele = new ClientModele();
            client.key = clientRecus.key,
              clients.push(client);
          })
          observer.next(clients);
        });
    });
  }
}
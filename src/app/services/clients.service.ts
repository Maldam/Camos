import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ClientModele } from '../modeles/client.modele';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable()
export class ClientsService {
  public client: ClientModele = new ClientModele();
  public imageVide: string = this.client.imageURL;
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public clients2: Array<ClientModele>;
  public image: string;
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    public angularFireStorage: AngularFireStorage,
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    private camera: Camera,
  ) {
    this.getClients().subscribe(clients => {
      this.clients2 = clients;
    });
  }
  public createClient(client: ClientModele) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Clients/').push(client)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
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
  public getClients(): Observable<Array<ClientModele>> {
    return new Observable<Array<ClientModele>>(observer => {
      this.angularFireDatabase.list('Clients/').snapshotChanges(['child_added', 'child_removed', 'child_changed']).subscribe(clientsRecus => {
        let clients: Array<ClientModele> = new Array<ClientModele>();
        clientsRecus.forEach(clientRecus => {
          let client: ClientModele = new ClientModele();
          client.key = clientRecus.key,
            client.nom = clientRecus.payload.exportVal().nom,
            client.pseudo = clientRecus.payload.exportVal().pseudo,
            client.pays = clientRecus.payload.exportVal().pays,
            client.province = clientRecus.payload.exportVal().province,
            client.codePostal = clientRecus.payload.exportVal().codePostal,
            client.localite = clientRecus.payload.exportVal().localite,
            client.rue = clientRecus.payload.exportVal().rue,
            client.numero = clientRecus.payload.exportVal().numero,
            client.boite = clientRecus.payload.exportVal().boite,
            client.numeroTVA = clientRecus.payload.exportVal().numeroTVA,
            client.numeroTelephone = clientRecus.payload.exportVal().numeroTelephone,
            client.numeroGSM = clientRecus.payload.exportVal().numeroGSM,
            client.numeroFax = clientRecus.payload.exportVal().numeroFax,
            client.email = clientRecus.payload.exportVal().email,
            client.notes = clientRecus.payload.exportVal().notes,
            client.imageURL = clientRecus.payload.exportVal().imageURL
          clients.push(client);
          observer.next(clients);
        })
      });
    });
  }
  public updateClient(client: ClientModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Clients/').update(client.key, { 
        nom: client.nom, 
        pseudo: client.pseudo,
        pays: client.pays,
        province: client.province,
        codePostal: client.codePostal,
        localite: client.localite,
        rue: client.rue,
        numero: client.numero,
        boite: client.boite,
        numeroTVA: client.numeroTVA,
        numeroTelephone: client.numeroTelephone,
        numeroGSM: client.numeroGSM,
        numeroFax: client.numeroFax,
        Email: client.email,
        notes: client.notes, 
        imageURL: client.imageURL }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
  public deleteClient(client: ClientModele): void {
    this.angularFireDatabase.list('Clients/').remove(client.key).then(() => {
      if (client.imageURL == undefined) {
      } else {
        if (client.imageURL == this.imageVide) {
        } else {
          this.deleteImage(client.imageURL)
        }
      }
    }).catch(error => console.log(error));
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
}
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
  public ajouterImage(nomImage: string, image: string){
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
            client.province = clientRecus.payload.exportVal().province,
            client.pays = clientRecus.payload.exportVal().pays,
            client.imageURL = clientRecus.payload.exportVal().imageURL
          clients.push(client);
          observer.next(clients);
        })
      });
    });
  }
  public updateClient(client: ClientModele): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.angularFireDatabase.list('Clients/').update(client.key, { nom: client.nom, quantite: client.province, prix: client.pays }).then(
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
 public numeroIndex(nomClient: any){try {
  return this.clients2.findIndex(x => x.nom === nomClient)
   
 } catch (error) {
   return -1
 }
 }

 public deleteImage(imageASupprimer: any){
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
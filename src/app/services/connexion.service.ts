import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
@Injectable()
export class ConnexionService {
  public creerUtilisateur(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  public connexionUtilisateur(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  public deconnexionUtilisateur() {
    firebase.auth().signOut();
  }
}
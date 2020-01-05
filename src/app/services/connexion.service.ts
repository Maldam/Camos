import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable()
export class ConnexionService{
    creerUtilisateur(email: string, password: string) {
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
    connexionUtilisateur(email: string, password: string) {
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
    deconnexionUtilisateur() {
        firebase.auth().signOut();
    }
}
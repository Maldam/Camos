import { EmailValidator } from '@angular/forms';

export class ClientModele {
    public key: string;
    public nom: string = null;
    public prenom: string = "";
    public pays: string = "";
    public province: string = "";
    public codePostal: number = null;
    public localite: string = "";
    public rue: string = "";
    public numero: number = null;
    public boite: string = "";
    public numeroTVA: string = "";
    public numeroTelephone: string = "";
    public numeroGSM: string = "";
    public numeroFax: string = "";
    public email: string = "";
    public notes: string = "";
    public imageURL: string = "";
    constructor(
    ) { }
}
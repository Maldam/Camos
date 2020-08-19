import { EmailValidator } from '@angular/forms';

export class ClientModele {
    public key: string;
    public nom: string;
    public prenom: string;
    public pays: string;
    public province: string;
    public codePostal: number;
    public localite: string;
    public rue: string;
    public numero: number;
    public boite: string;
    public numeroTVA: string;
    public numeroTelephone: string;
    public numeroGSM: string;
    public numeroFax: string;
    public Email: string;
    public notes: string;
    public imageURL: string = "";
    constructor(
    ) { }
}
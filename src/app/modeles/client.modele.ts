export class ProduitModele {
    public key: string;
    public nom: string;
    public prenom: string;
    public rue: string;
    public numero: number;
    public boite: string;
    public codePostal: number;
    public localite: string;
    public province: string;
    public pays: string;
    public imageURL: string = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Pas_d%27image_disponible.svg';
    constructor(
    ) { }
}
export class CommandeProduitModele {
    public key: string;
    public codeProduit: string = null;
    public produitNom: string = null;
    public prix: number = 0;
    public quantite: number = 0;
    public imageURL: string = "";
    public keyProduit: string;
    public pourcentageProduit: number = 0;
    public date: number = 0;
    public numeroCommande: number = null;
    public TVAProduit: number = null;
    constructor(
    ) { }
  }
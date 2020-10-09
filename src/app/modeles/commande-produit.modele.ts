export class CommandeProduitModele {
    public key: string;
    public codeProduit: string = "";
    public produitNom: string = "";
    public prix: number = 0;
    public quantite: number = 0;
  //  public imageURL: string = "";
    public keyProduit: string;
    public pourcentageProduit: number = 0;
 //   public date: number = 0;
    public keyCommande: string = "";
    public keyCommandelivree: string = "";
    public keyCommandeProduit: string = "";
    public TVAProduit: number = 0;
    public livree: number = 0;
    constructor(
    ) { }
  }
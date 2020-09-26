export class ProduitModele {
  public key: string;
  public nom: string = null;
  public codeProduit: string = "";
  public prix: number = 0;
  public quantite: number = 0;
  public type: string = "";
  public categorie: string ="";
  public localisation: string="";
  public TVA: number = 0;
  public codeProduitFournisseur: string="";
  public imageURL: string = "";
  public keyFournisseur:string="";
  constructor(
  ) { }
}
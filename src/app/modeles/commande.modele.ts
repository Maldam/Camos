export class CommandeModele {
    public key: string;
    public numeroCommande: number = null;
    public nomClient: string = null;
    public pseudoClient: string = "";
    public keyClient: string = "";
    public numeroTVAClient: string = "";
    public notes: string = "";
    public nomProduit: string = "";
    public pourcentageTotal: number = 0;
    public montantFacture: number = 0;
    public dateCommande: number = null;
    public dateLivraison: number = 0;
    constructor(
    ) { }
}
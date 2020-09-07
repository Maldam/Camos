export class CommandeModele {
    public key: string;
    public numeroCommande: number = null;
    public nomClient: string = null;
    public pseudoClient: string = "";
    public paysClient: string = "";
    public provinceClient: string = "";
    public codePostalClient: number = 0;
    public localiteClient: string = "";
    public rueClient: string = "";
    public numeroClient: number = 0;
    public boiteClient: string = "";
    public numeroTVAClient: string = "";
    public numeroTelephoneClient: string = "";
    public numeroGSMClient: string = "";
    public numeroFaxClient: string = "";
    public emailClient: string = "";
    public notes: string = "";
    public nomProduit: string = "";
    public pourcentageTotal: number = 0;
    public montantFacture: number = 0;
    public dateCommande: number = null;
    public dateLivraison: number = 0;
    constructor(
    ) { }
}
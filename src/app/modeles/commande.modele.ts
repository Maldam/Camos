export class CommandeModele {
    public key: string;
    public numeroFacture: number = null;
    public nomClient: string = null;
    public prenomClient: string = "";
    public paysClient: string = "";
    public provinceClient: string = "";
    public codePostalClient: number = null;
    public localiteClient: string = "";
    public rueClient: string = "";
    public numeroClient: number = null;
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
    constructor(
    ) { }
}
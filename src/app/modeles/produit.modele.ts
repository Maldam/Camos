export class ProduitModele {
    photo: string;
    synopsis: string;

    constructor(public nom: string, public quantite: number, public prix: number ) {
    }
}
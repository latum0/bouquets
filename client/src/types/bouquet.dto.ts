export class BouquetT {
  id!: number;
  nom!: string;
  description!: string;
  prix!: number;
  image!: string;
  liked!: boolean;
}

export type Bouquet = {
  id: number;
  nom: string;
  prix: number;
  image: string;
};

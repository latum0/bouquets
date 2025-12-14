export interface BouquetT {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  prix?: number;
  likes?: number;
}
export type Bouquet = {
  id: number;
  nom: string;
  prix: number;
  image: string;
};

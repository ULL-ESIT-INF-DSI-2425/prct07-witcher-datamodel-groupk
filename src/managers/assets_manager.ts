import { Assets } from "../items/asset.js";

export class AssetManager {
  /**
   * Atributo privado lista de bienes
   */
  private assets: Assets[];

  /**
   * Constructor
   * @param assets - Lista de bienes
   */
  constructor(assets: Assets[]) {
    this.assets = assets;
  }

  /**
   * Busca un elemento según su nombre.
   * @param item_name - Nombre del bien a buscar
   * @returns - Array de elementos que coinciden con la búsqueda.
   */
  searchByName(item_name: string): Assets[] {
    return this.assets.filter(asset =>
      asset.name.toLowerCase().includes(item_name.toLowerCase())
    );
  }

  /**
   * Busca un elemento según su descripción.
   * @param item_name - Descripción del bien a buscar
   * @returns - Array de elementos que coinciden con la búsqueda.
   */
  searchByDescription(item_description: string): Assets[] {
    return this.assets.filter(asset =>
      asset.description.toLowerCase().includes(item_description.toLowerCase())
    );
  }

  /**
   * Odrdena los elementos de una lista por su nombre.
   * @param is_ascendance - Booleano. True si quiere orden ascendente, false si lo quiere descendente
   * @returns - Array de elementos ordenados.
   */
  sortByName(is_ascendance: boolean): Assets[] {
    return [...this.assets]
    .filter(asset => asset && asset.name) 
    .sort((a, b) => is_ascendance ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }

  /**
   * Ordena los elementos de una lista por su valor en coronas.
   * @param is_ascendance - Booleano. True si quiere orden ascendente, false si lo quiere descendente
   * @returns - Array de elementos ordenados.
   */
  sortByCrowns(is_ascendance: boolean): Assets[] {
    return [...this.assets].sort((a, b) => 
      is_ascendance ? a.crowns - b.crowns : b.crowns - a.crowns
    );
  }
}
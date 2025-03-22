import { Merchant } from "../characters/merchant.js";
import { Type } from "../enums/types-and-races.js";

/**
 * Clase MerchantManager que contiene métodos de búsqueda para mercaderes.
 */
export class MerchantManager {
  /**
   * Constructor.
   * @param merchants - Lista de mercaderes.
   */
  constructor(private merchants: Merchant[]) {}

  /**
   * Permite buscar un mercader dado un nombre.
   * @param name - Nombre del mercader a buscar
   * @returns - Lista con el mercader o lista vacía.
   */
  searchByName(name: string): Merchant[] {
    return this.merchants.filter(merchant =>
      merchant.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Permite buscar un mercader dada una localización.
   * @param location - Lacalización a buscar.
   * @returns - Lista con el mercader o lista vacía.
   */
  searchByLocation(location: string): Merchant[] {
    return this.merchants.filter(merchant =>
      merchant.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Permite buscar un mercader dado un tipo.
   * @param type - Tipo a buscar.
   * @returns - Lista con el mercader o lista vacía.
   */
  searchByType(type: Type): Merchant[] {
    return this.merchants.filter(merchant => merchant.type === type);
  }
}
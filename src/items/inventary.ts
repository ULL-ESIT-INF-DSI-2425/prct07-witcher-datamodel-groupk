import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";

/**
 * Tipo Stock. Representa una tupla que almacena un bien y el número del mismo que hay en stock
 */
type Stock = [Assets, number];

/**
 * Clase Inventary. Representa un inventario compuesto de bienes, mercaderes y clientes
 */
export class Inventary {

  /**
   * Constructor de Inventary
   * @param bienes_list - Lista de bienes
   * @param merchant_list - Lista de mercaderes
   * @param client_list - Lista de clientes
   */
  constructor(
    private readonly bienes_list: Stock[], 
    private readonly merchant_list: Merchant[], 
    private readonly client_list : Clients[] ) {}
  
  /**
   * Añade al inventario un bien
   * @param asset - Bien a añadir
   */
  addAssets(stock: Stock): void {
    if (this.bienes_list.some((asset) => asset[0] === stock[0])) {
      const index: number = this.bienes_list.findIndex((asset) => asset[0] === stock[0]);
      this.bienes_list[index][1] += stock[1];
    } else {
      this.bienes_list.push(stock);
    }
  }

  /**
   * Añade a un mercader
   * @param merchant - Mercader a añadir
   */
  addMerchant(merchant: Merchant): void {
    this.merchant_list.push(merchant);
  }

  /**
   * Añade a un cliente
   * @param client - Cliente a añadir
   */
  addClient(client: Clients): void {
    this.client_list.push(client);
  }
  
  /**
   * Elimina un bien del inventario
   * @param asset - Bien a eliminar
   */
  removeAsset(asset: Assets): void {
    this.bienes_list.forEach((element, index) => {
      if (element[0] === asset && element[1] > 1 ) this.bienes_list[index][1]--;
      else if (element[0] === asset)this.bienes_list.filter(element => element[0] !== asset);
      else throw new Error('No se ha encontrado el bien especificado');
    })
  }

  /**
   * Elimina a un mercader
   * @param merchant - Mercader a eliminar
   */
  removeMerchant(merchant: Merchant): void {
    this.merchant_list.filter(element => element !== merchant);
  }
  
  /**
   * Elimina a un cliente
   * @param client - Cliente a eliminar
   */
  removeClient(client: Clients): void {
    this.client_list.filter(element => element !== client);
  }
}
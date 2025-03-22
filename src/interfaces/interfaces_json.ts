import { Type, Race } from "../enums/types-and-races.js";

/**
 * Representación en JSON de un bien Asset.
 * Se usa para almacenar datos en la base de datos sin instancias de clases.
 */
export interface AssetJSON {
  /**
   * ID único del bien
   */
  _id: number;
  
  /**
   * Nombre del bien,
   */
  _name: string;

  /**
   * Descripción del bien.
   */
  _description: string;

  /**
   * Lista de materiales que componen el bien.
   */
  _materials: string[];

  /**
   * Peso del bien.
   */
  _weight: number;

  /**
   * Valor en coronas del bien.
   */
  _crowns: number;
}

/**
 * Representación en JSON de un mercader Merchant.
 * Permite almacenar mercaderes en la base de datos sin perder información de tipo.
 */
export interface MerchantJSON {
  /**
   * ID único del mercader
   */
  _id: number;
  
  /**
   * Nombre del mercader.
   */
  _name: string;

  /**
   * Ubicación donde se encuentra el mercader.
   */
  _location: string;

  /**
   * Tipo de mercader, representado por Type.
   */
  _type: Type;
}

/**
 * Representación en JSON de un cliente Clients.
 * Se usa para guardar información de clientes en la base de datos.
 */
export interface ClientsJSON {
  /**
   * ID único del cliente
   */
  _id: number;
  
  /**
   * Nombre del cliente.
   */
  _name: string;
  /**
   * Ubicaión del cliente.
   */
  _location: string;

  /**
   * Raza del cliente, representado por Race.
   */
  _race: Race;
}
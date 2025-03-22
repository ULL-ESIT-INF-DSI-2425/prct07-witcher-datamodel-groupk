import { Person } from "../characters/person.js";
import * as Enums from "../enums/types-and-races.js";
import { MerchantJSON } from "../interfaces/interfaces_json.js";

/**
 * Clase Merchant. Representa a un mercader
 */
export class Merchant extends Person {

  private static _idCount = 1; // Cuenta de IDs que se van asignando cada vez que se crea un nuevo objeto

  /**
   * Constructor de Merchant
   * @param name - Nombre del mercader
   * @param location - Ubicación del mercader
   * @param _type - Tipo del mercader
   */
  constructor(
    name: string, 
    location: string, 
    private _type: Enums.Type) 
    {
      super(name, location);

      this._id = Merchant._idCount;
      Merchant._idCount++;
    }

  /**
   * Getter de type
   */
  get type() {
    return this._type
  }

  /**
   * Setter de type
   */
  set type(type: Enums.Type) {
    this._type = type;
  }

/**
 * Método estático para reconstruir un objeto Merchant desde JSON.
 * @param json - Objeto con la estructura de MerchantJSON
 * @returns Nueva instancia de Merchant
 */
  static fromJSON(json: MerchantJSON): Merchant {
    const m: Merchant = new Merchant(json._name, json._location, json._type);
    m.setId(json._id);
    
    return m;
  }
}
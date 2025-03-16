import { Person } from "../characters/person.js";
import * as Enums from "../enums/types-and-races.js";

/**
 * Clase Merchant. Representa a un mercader
 */
export class Merchant extends Person {

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
  }
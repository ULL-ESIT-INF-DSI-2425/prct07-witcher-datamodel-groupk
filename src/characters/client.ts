import { Person } from "../characters/person.js";
import * as Enums from "../enums/types-and-races.js";

/**
 * Clase Clients. Representa a un cliente
 */
export class Clients extends Person {

  private static _idCount = 1;
  
    /**
     * Constructor de Clients
     * @param name - Nombre del cliente
     * @param location - Ubicación del cliente
     * @param _race - Raza del cliente
     */
    constructor(
      name: string, 
      location: string, 
      private _race: Enums.Race
    ) {
      super(name, location);

      this._id = Clients._idCount;
      Clients._idCount++;
    }
  
    /**
     * Getter de race
     */
    get race() {
      return this._race;
    }
  
    /**
     * Setter de race
     */
    set race(race: Enums.Race) {
      this._race = race;
    }
  }
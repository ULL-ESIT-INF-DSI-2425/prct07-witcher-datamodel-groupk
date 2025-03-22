import { Person } from "../characters/person.js";
import * as Enums from "../enums/types-and-races.js";
import { ClientsJSON } from "../interfaces/interfaces_json.js";

/**
 * Clase Clients. Representa a un cliente
 */
export class Clients extends Person {

  private static _idCount = 1; // Cuenta de IDs que se van asignando cada vez que se crea un nuevo objeto
  
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

    /**
     * Convierte el cliente de la base de datos a cliente normal.
     * @param json - Cliente en formato json (base de datos).
     * @returns - Cliente en formato Clients.
     */
    static fromJSON(json: ClientsJSON): Clients {
      return new Clients(json._name, json._location, json._race);
    }
  }
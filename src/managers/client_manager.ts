import { Clients } from "../characters/client.js";
import { Race } from "../enums/types-and-races.js";

/**
 * Clase ClientsManager que contiene métodos de búsqueda para clientes.
 */
export class ClientsManager {
  /**
   * Contructor.
   * @param clients - Lista de clientes. 
   */
  constructor(private clients: Clients[]) {}

  /**
   * Permite buscar un cliente dado un nombre.
   * @param name - Nombre del cliente a buscar
   * @returns - Lista con el cliente o lista vacía.
   */
  searchByName(name: string): Clients[] {
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Permite buscar un cliente dada una localización.
   * @param location - Lacalización a buscar.
   * @returns - Lista con el cliente o lista vacía.
   */
  searchByLocation(location: string): Clients[] {
    return this.clients.filter(client =>
      client.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Permite buscar un cliente dada una raza.
   * @param race - Raza a buscar.
   * @returns - Lista con el cliente o lista vacía.
   */
  searchByRace(race: Race): Clients[] {
    return this.clients.filter(client => client.race === race);
  }
}
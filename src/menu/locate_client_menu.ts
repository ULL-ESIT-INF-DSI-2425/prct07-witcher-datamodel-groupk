import inquirer from "inquirer";
import { Clients } from "../characters/client.js";
import { ClientsManager } from "../managers/client_manager.js";
import { Race } from "../enums/types-and-races.js";
import { ClientsJSON } from "../interfaces/interfaces_json.js";
import { db } from "../database/database.js";
import { locateMenu } from "./locate_menu.js";

/**
 * Submenú locateClient(). Permite localizar al cliente por:
 * Nombre: Localiza al cliente dado su nombre. Si no está en la base de datos 
 * muestra un mensaje de error. 
 * Raza: Localiza al cliente dado su raza. Si no está en la base de datos 
 * muestra un mensaje de error.
 * Ubicación: Localiza al cliente dado su ubicación. Si no está en la base de datos 
 * muestra un mensaje de error.
 * Ver todos: Muestra todos los clientes de la base de datos.
 * Volver atrás: Vuelve al submenu invocante "locateMenu()". 
 */
export async function locateClient() {
  const clients: Clients[] = db.data.clients.map(client => Clients.fromJSON(client as unknown as ClientsJSON));
  const client_manager = new ClientsManager(clients);

  const { filter } = await inquirer.prompt([
    {
      type: "list",
      name: "filter",
      message: "¿Cómo desea buscar el cliente?",
      choices: ["Nombre", "Raza", "Ubicación", "Ver todos", "Volver atrás"],
    },
  ]);

  let found_clients: Clients[] = [];

  switch (filter) {
    case "Nombre":
      const { search_name } = await inquirer.prompt([
        { type: "input", name: "search_name", message: "Ingrese el nombre a buscar:" },
      ]);

      found_clients = client_manager.searchByName(search_name);

      if (found_clients.length > 0) console.table(found_clients.map(client => ({
        Nombre: client.name,
        Ubicación: client.location,
        Raza: typeof client.race === "number" ? Race[client.race] : client.race
      })));
      
      else console.log("No se encontraron mercaderes con ese nombre.");
      break;

    case "Tipo":
      const { selected_race } = await inquirer.prompt([
          { type: "list", name: "selected_race", message: "Seleccione el tipo de mercader:", choices: Object.values(Race).filter((race): race is keyof typeof Race => isNaN(Number(race))) },
      ]);
      const enum_race = Race[selected_race as keyof typeof Race];
      found_clients = client_manager.searchByRace(enum_race);

      if (found_clients.length > 0) console.table(found_clients.map(client => ({
        Nombre: client.name,
        Ubicación: client.location,
        Raza: typeof client.race === "number" ? Race[client.race] : client.race
      })));

      else console.log("No se encontraron mercaderes de dicho tipo.");
      break;

    case "Ubicación":
      const { search_location } = await inquirer.prompt([
          { type: "input", name: "search_location", message: "Ingrese la ubicación a buscar:" },
      ]);
      found_clients = client_manager.searchByLocation(search_location);

      if (found_clients.length > 0) console.table(found_clients.map(client => ({
        Nombre: client.name,
        Ubicación: client.location,
        Raza: typeof client.race === "number" ? Race[client.race] : client.race
      })));

      else console.log("No se encontraron mercaderes de dicho tipo.");
      break;

    case "Ver todos":
      console.table(clients.map(client => ({
        Nombre: client.name,
        Ubicación: client.location,
        Raza: typeof client.race === "number" ? Race[client.race] : client.race
      })));
      break;

    case "Volver atrás":
      await locateMenu();
      return;
  }
}
import inquirer from "inquirer";
import { Merchant } from "../characters/merchant.js";
import { MerchantManager } from "../managers/merchant_manager.js";
import { Type } from "../enums/types-and-races.js";
import { MerchantJSON } from "../interfaces/interfaces_json.js";
import { db } from "../database/database.js";
import { locateMenu } from "./locate_menu.js";

/**
 * Submenú locateMerchant(). Permite localizar al mercader por:
 * Nombre: Localiza al mercader dado su nombre. Si no está en la base de datos 
 * muestra un mensaje de error. 
 * Tipo: Localiza al mercader dado su tipo. Si no está en la base de datos 
 * muestra un mensaje de error.
 * Ubicación: Localiza al mercader dado su ubicación. Si no está en la base de datos 
 * muestra un mensaje de error.
 * Ver todos: Muestra todos los mercaderes de la base de datos.
 * Volver atrás: Vuelve al submenu invocante "locateMenu()". 
 */
export async function locateMerchant() {
  db.read();

  const merchants: Merchant[] = db.data.merchants.map(merchant => Merchant.fromJSON(merchant as unknown as MerchantJSON));
  const merchant_manager = new MerchantManager(merchants);

  const { filter } = await inquirer.prompt([
    {
      type: "list",
      name: "filter",
      message: "¿Cómo desea buscar el mercader?",
      choices: ["Nombre", "Tipo", "Ubicación", "Ver todos", "Volver atrás"],
    },
  ]);

  let found_merchants: Merchant[] = [];

  switch (filter) {
    case "Nombre":
      const { search_name } = await inquirer.prompt([
        { type: "input", name: "search_name", message: "Ingrese el nombre a buscar:" },
      ]);

      found_merchants = merchant_manager.searchByName(search_name);

      if (found_merchants.length > 0) console.table(found_merchants.map(merchant => ({
        Nombre: merchant.name,
        Ubicación: merchant.location,
        Tipo: typeof merchant.type === "number" ? Type[merchant.type] : merchant.type
      })));

      else console.log("No se encontraron mercaderes con ese nombre.");
      break;

    case "Tipo":
      const { selected_type } = await inquirer.prompt([
          { type: "list", name: "selected_type", message: "Seleccione el tipo de mercader:", choices: Object.values(Type).filter((type): type is keyof typeof Type => isNaN(Number(type))) },
      ]);
      const enum_type = Type[selected_type as keyof typeof Type];
      found_merchants = merchant_manager.searchByType(enum_type);

      if (found_merchants.length > 0) console.table(found_merchants.map(merchant => ({
        Nombre: merchant.name,
        Ubicación: merchant.location,
        Tipo: typeof merchant.type === "number" ? Type[merchant.type] : merchant.type
      }))); 

      else console.log("No se encontraron mercaderes de dicho tipo.");
      break;

    case "Ubicación":
      const { search_location } = await inquirer.prompt([
          { type: "input", name: "search_location", message: "Ingrese la ubicación a buscar:" },
      ]);
      found_merchants = merchant_manager.searchByLocation(search_location);

      if (found_merchants.length > 0) console.table(found_merchants.map(merchant => ({
        Nombre: merchant.name,
        Ubicación: merchant.location,
        Tipo: typeof merchant.type === "number" ? Type[merchant.type] : merchant.type
      }))); 
      
      else console.log("No se encontraron mercaderes de dicho tipo.");
      break;

    case "Ver todos":
      console.table(merchants.map(merchant => ({
        Nombre: merchant.name,
        Ubicación: merchant.location,
        Tipo: typeof merchant.type === "number" ? Type[merchant.type] : merchant.type
      })));
      break;

    case "Volver atrás":
      await locateMenu();
      return;
  }
}
import inquirer from "inquirer";
import { db } from "../database/database.js";
import { AssetManager } from "../managers/assets_manager.js"
import { Assets } from "../items/asset.js";
import { AssetJSON } from "../interfaces/interfaces_json.js";
import { consultMenu } from "./consult_menu.js";

/**
 * Permite buscar los bienes con distintas opciones:
 * Nombre: Dado un nombre, busca el bien en la base de datos.
 * Descripción: Dada una descripción, busca el bien en la base de datos.
 * Ver todos: Muestra por pantalla todos los bienes de la base de datos.
 * Volver atrás: Vuelve al submenú "consultMenu()".
 */
export async function searchItemMenu() {
  await db.read();

  const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
  const asset_manager = new AssetManager(assets);
  
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Cómo desea buscar los bienes?",
      choices: ["Nombre", "Descripción", "Ver todos", "Volver atrás"],
    },
  ]);

  let search_assets: Assets[] = [];

  switch (option) {
    case "Nombre":
      const { search_name } = await inquirer.prompt([
        { type: "input", name: "search_name", message: "Ingrese el nombre a buscar:" },
      ]);

      search_assets = asset_manager.searchByName(search_name);

      if (search_assets.length > 0) console.table(search_assets) ; 
      else console.log("No se encontraron bienes con ese nombre.");
      break;

    case "Descripción":
      const { search_description } = await inquirer.prompt([
        { type: "input", name: "search_description", message: "Ingrese el nombre a buscar:" },
      ]);
      
      search_assets = asset_manager.searchByDescription(search_description);
      
      if (search_assets.length > 0) console.table(search_assets) ; 
      else console.log("No se encontraron bienes con esa descripción.");
      break;

    case "Ver todos":
      console.table(db.data.assets);
      break;
    case "Volver atrás":
      await consultMenu();
      return;
  }
}
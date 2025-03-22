import inquirer from "inquirer";
import { db } from "../database/database.js";
import { consultMenu } from "./consult_menu.js";
import { AssetManager } from "../managers/assets_manager.js"
import { Assets } from "../items/asset.js";
import { AssetJSON } from "../interfaces/interfaces_json.js";

/**
 * Permite ordenar los bienes con distintas opciones:
 * Nombre (A-Z): Ordena los bienes alfabéticamente.
 * Nombre (Z-A): Ordena los bienes alfabeticamente desde el final.
 * Valor en coronas (Ascendente): Ordena los bienes por su valor en coronas (de menor a mayor).
 * Valor en coronas (Descendente): Ordena los bienes por su valor en coronas (de mayor a menor).
 * Volver atrás: Vuelve al submenú "consultMenu()".
 */
export async function sortItemMenu() {
  db.read();

  const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
  const asset_manager = new AssetManager(assets);

  const { sort_type } = await inquirer.prompt([
    {
      type: "list",
      name: "sort_type",
      message: "¿Cómo desea ordenar los resultados?",
      choices: ["Nombre (A-Z)", "Nombre (Z-A)", "Valor en coronas (Ascendente)", "Valor en coronas (Descendente)", "Volver atrás"],
    },
  ]);

  let sorted_assets: Assets[] = [];

  switch (sort_type) {
    case "Nombre (A-Z)":
      sorted_assets = asset_manager.sortByName(true);
      break;
    case "Nombre (Z-A)":
      sorted_assets = asset_manager.sortByName(false);
      break;
    case "Valor en coronas (Ascendente)":
      sorted_assets = asset_manager.sortByCrowns(true);
      break;
    case "Valor en coronas (Descendente)":
      sorted_assets = asset_manager.sortByCrowns(false);
      break;
    case "Volver atrás":
      await consultMenu();
      return;
  }

  console.table(sorted_assets);
}
import inquirer from "inquirer";
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import * as Enums from "../enums/types-and-races.js";
import { db } from "../database/database.js";
import { menu } from "./menu.js";

/**
 * Submenú addMenu(). Permite las siguientes opciones:
 * Bien: Añade un nuevo bien a la base de datos.
 * Mercader: Añade un nuevo mercader a la base de datos.
 * Cliente: Añade un nuevo cliente a la base de datos.
 * Volver atrás: Vuelve al menú principal.
 */
export async function addMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué desea añadir?",
      choices: ["Bien", "Mercader", "Cliente", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Bien":
      const asset = await inquirer.prompt([
        {type: "input", name: "name", message: "Nombre del bien:" },
        {type: "input", name: "description", message: "Descripción:" },
        {type: "input", name: "materials", message: "Materiales:" },
        {type: "number", name: "weight", message: "Peso: "},
        {type: "number", name: "crowns", message: "Valor en coronas: "},
      ]);

      await addAsset(new Assets(asset.name, asset.description, asset.materials.split(","), asset.weight, asset.crowns));
      break;

    case "Mercader":
      const merchant = await inquirer.prompt([
        {type: "input", name: "name", message: "Nombre del mercader:" },
        {type: "input", name: "location", message: "Ubicación:" },
        {type: "list", name: "type", message: "Tipo: ", choices: Object.values(Enums.Type).filter(value => isNaN(Number(value))).map(String)},
      ]);
      
      await addMerchant(new Merchant(merchant.name, merchant.location, merchant.type));
      break;

    case "Cliente":
      const client = await inquirer.prompt([
        {type: "input", name: "name", message: "Nombre del cliente:" },
        {type: "input", name: "location", message: "Ubicación:" },
        {type: "list", name: "race", message: "Raza: ", choices: Object.values(Enums.Race).filter(value => isNaN(Number(value))).map(String)},
      ]);
      
      await addClient(new Clients(client.name, client.location, client.race));
      break;

    case "Volver atrás":
      await menu();
      return;
  }
  
  await addMenu();
}

/**
 * Añade un bien a la base de datos.
 * @param asset - Bien a agregar.
 */
export async function addAsset(asset: Assets) {
  db.data.assets.push(asset);
  await db.write();
}

/**
 * Añade un mercader a la base de datos.
 * @param merchant - Mercader a agregar.
 */
export async function addMerchant(merchant: Merchant) {
  db.data.merchants.push(merchant);
  await db.write();
}


/**
 * Añade un cliente a la base de datos.
 * @param client - Cliente a agregar
 */
export async function addClient(client: Clients) {
  db.data.clients.push(client);
  await db.write();
}
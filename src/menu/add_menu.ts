import inquirer from "inquirer";
import { Inventary } from "../items/inventary.js";
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import * as Enums from "../enums/types-and-races.js";
import { addAsset, addMerchant, addClient } from "../database/database.js";;

const inventary = new Inventary([]);

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
        {type: "list", name: "type", message: "Tipo: ", choices: Object.values(Enums.Type)},
      ]);
      
      await addMerchant(new Merchant(merchant.name, merchant.location, merchant.type));
      break;

    case "Cliente":
      const client = await inquirer.prompt([
        {type: "input", name: "name", message: "Nombre del cliente:" },
        {type: "input", name: "location", message: "Ubicación:" },
        {type: "list", name: "race", message: "Raza: ", choices: Object.values(Enums.Race)},
      ]);
      
      await addClient(new Clients(client.name, client.location, client.race));
      break;

    case "Volver atrás":
      return;
  }
  
  await addMenu();
}
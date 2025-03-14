import inquirer from "inquirer";
import { Assets, Merchant, Clients, Inventary, Type, Race } from "../src/main"

const inventary = new Inventary();

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
        {type: "number", name: "id", message: "ID: "},
        {type: "input", name: "name", message: "Nombre del bien:" },
        {type: "input", name: "description", message: "Descripción:" },
        {type: "input", name: "materials", message: "Materiales:" },
        {type: "number", name: "weight", message: "Peso: "},
        {type: "number", name: "crowns", message: "Valor en coronas: "},
      ]);
      inventary.addAssets(new Assets(asset.id, asset.name, asset.description, asset.materials.split(","), asset.weight, asset.crowns));
      break;

    case "Mercader":
      const merchant = await inquirer.prompt([
        {type: "number", name: "id", message: "ID: "},
        {type: "input", name: "name", message: "Nombre del mercader:" },
        {type: "input", name: "location", message: "Ubicación:" },
        {type: "list", name: "type", message: "Tipo: ", choices: Object.values(Type)},
      ]);
      inventary.addMerchant(new Merchant(merchant.id, merchant.name, merchant.location, merchant.type));
      break;

    case "Cliente":
      const client = await inquirer.prompt([
        {type: "number", name: "id", message: "ID: "},
        {type: "input", name: "name", message: "Nombre del cliente:" },
        {type: "input", name: "location", message: "Ubicación:" },
        {type: "list", name: "race", message: "Raza: ", choices: Object.values(Race)},
      ]);
      inventary.addClient(new Clients(client.id, client.name, client.location, client.race));
      break;

    case "Volver atrás":
      return;
  }
  
  await addMenu();
}
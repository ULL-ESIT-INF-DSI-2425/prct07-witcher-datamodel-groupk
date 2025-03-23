import inquirer from "inquirer";
import * as Enums from "../enums/types-and-races.js"
import { db } from "../database/database.js"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { menu } from "./menu.js"
import { AssetJSON, ClientsJSON, MerchantJSON } from "../interfaces/interfaces_json.js";
import { Race, Type } from "../enums/types-and-races.js"

/**
 * Submenú modifyMenu(). Permite las siguientes opciones:
 * Bien: Modifica un bien existente de la base de datos.
 * Mercader: Modifica un mercader existente de la base de datos.
 * Cliente: Modifica un cliente existente de la base de datos.
 * Volver atrás: Vuelve al menú principal.
 */
export async function modifyMenu() {
  db.read();

  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué desea modificar?",
      choices: ["Bien", "Mercader", "Cliente", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Bien":
      db.read();

      const assets: Assets[] = db.data.assets.map((asset: Assets) => Assets.fromJSON(asset as unknown as AssetJSON));
      if (assets.length === 0) return;

      const { name: asset_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el bien a modificar:", choices: assets.map(asset => asset.name) },
      ]);

      const updated_asset_data = await inquirer.prompt([
        { type: "input", name: "name", message: "Nuevo nombre (dejar vacío para no cambiar):" },
        { type: "input", name: "description", message: "Nueva descripción (dejar vacío para no cambiar):" },
        { type: "input", name: "materials", message: "Nuevos materiales (dejar vacío para no cambiar):" },
        { type: "number", name: "weight", message: "Nuevo peso (0 para no cambiar):" },
        { type: "number", name: "crowns", message: "Nuevo valor en coronas (0 para no cambiar):" },
      ]);

      const index = assets.findIndex(asset => asset.name === asset_name);
      if (index === -1) {
        console.log("Bien no encontrado.");
        return;
      }

      updateAsset(asset_name, {
        name: updated_asset_data.name || assets[index].name,
        description: updated_asset_data.description || assets[index].description,
        materials: updated_asset_data.materials && updated_asset_data.materials.trim() !== ""  ? updated_asset_data.materials.split(",") : assets[index].materials,
        weight: updated_asset_data.weight !== 0 ? updated_asset_data.weight : assets[index].weight,
        crowns: updated_asset_data.crowns !== 0 ? updated_asset_data.crowns : assets[index].crowns,
      });
      
      db.write();
      break;

    case "Mercader":
      db.read();

      const merchants: Merchant[] = db.data.merchants.map((merchant: Merchant) => Merchant.fromJSON(merchant as unknown as MerchantJSON));
      if (merchants.length === 0) return;
      
      const { name: merchant_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el mercader a modificar:", choices: merchants.map(merchant => merchant.name) },
      ]);

      const i = merchants.findIndex(merchant => merchant.name === merchant_name);
      if (i === -1) {
        console.log("Mercader no encontrado.");
        return;
      }

      const updated_merchant_data = await inquirer.prompt([
        { type: "input", name: "name", message: "Nuevo nombre (dejar vacío para no cambiar):" },
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "type", message: "Nuevo tipo de mercader:", choices: Object.values(Enums.Type).filter(value => isNaN(Number(value))).map(String) },
      ]);

      updateMerchant(merchant_name, {
        name: updated_merchant_data.name || merchants[i].name,
        location: updated_merchant_data.location || merchants[i].location,
        type: updated_merchant_data.type || merchants[i].type,
      });

      db.write();
      break;

    case "Cliente":
      db.read();

      const clients = db.data.clients.map((client: Clients) => Clients.fromJSON(client as unknown as ClientsJSON));
      if (clients.length === 0) return;

      const { name: client_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el cliente a modificar:", choices: clients.map(client => client.name) },
      ]);

      const j = clients.findIndex(client => client.name === client_name);
      if (j === -1) {
        console.log("Cliente no encontrado.");
        return;
      }

      const updated_client_data = await inquirer.prompt([
        { type: "input", name: "name", message: "Nuevo nombre (dejar vacío para no cambiar):" },
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "race", message: "Nueva raza:", choices: Object.values(Enums.Race).filter(value => isNaN(Number(value))).map(String) },
      ]);

      updateClient(client_name, {
        location: updated_client_data.location || clients[j].location,
        race: updated_client_data.race || clients[j].race,
      });

      db.write();
      break;

    case "Volver atrás":
      await menu();
      return;
  }

  await modifyMenu();
}

/**
 * Permite modificar un bien.
 * @param name - Nombre del bien a modificar.
 * @param updated_data - Datos del bien a modificar. 
 */
export function updateAsset(name: string, updated_data: Partial<Assets>): void {
  db.read();

  const index = db.data.assets.findIndex((asset: Assets) => Assets.fromJSON(asset as unknown as AssetJSON).name === name);
  if (index !== -1) {
    const old_asset_data = db.data.assets[index];
    const asset: Assets = Assets.fromJSON(db.data.assets[index] as unknown as AssetJSON);
    asset.name = updated_data.name ?? old_asset_data.name;
    asset.description = updated_data.description ?? old_asset_data.description;
    asset.materials = updated_data.materials !== undefined ? updated_data.materials : old_asset_data.materials;
    asset.weight = updated_data.weight ?? old_asset_data.weight;
    asset.crowns = updated_data.crowns ?? old_asset_data.crowns;
    db.data.assets[index] = asset;
    db.write();
  }
}

/**
 * Permite modificar el estado de un mercader.
 * @param name - Nombre del mercader a modificar.
 * @param updated_data - Datos del mercader a modificar.
 */
export function updateMerchant(name: string, updated_data: Partial<Merchant>): void {
  db.read();
  
  const index = db.data.merchants.findIndex((merchant: Merchant) => Merchant.fromJSON(merchant as unknown as MerchantJSON).name === name);
  const merchants: Merchant[] = db.data.merchants.map((merchant: Merchant) => Merchant.fromJSON(merchant as unknown as MerchantJSON));

  const parsed_type: Type | undefined = typeof updated_data.type === "string" ? Type[updated_data.type as keyof typeof Type] : updated_data.type;
  if (typeof parsed_type === "undefined") {
    console.log("Tipo invalido");
    return;
  } 

  if (index !== -1) {
    const old_merchant_data = merchants[index];
    const merchant: Merchant = Merchant.fromJSON(old_merchant_data as unknown as MerchantJSON);
    merchant.name = updated_data.name ?? old_merchant_data.name;
    merchant.location = updated_data.location ?? old_merchant_data.location;
    merchant.type = parsed_type ?? old_merchant_data.type;
    db.data.merchants[index] = merchant;
    db.write(); 
  } 
}

/**
 * Permite modificar el estado de un cliente.
 * @param name - Nombre del cliente a modificar.
 * @param updated_data - Datos del cliente a modificar. 
 */
export function updateClient(name: string, updated_data: Partial<Clients>): void {
  db.read();

  const index = db.data.clients.findIndex((client: Clients) => Clients.fromJSON(client as unknown as ClientsJSON).name === name);
  const clients = db.data.clients.map((client: Clients) => Clients.fromJSON(client as unknown as ClientsJSON));

  const parsed_race = typeof updated_data.race === "string" ? Race[updated_data.race as keyof typeof Race] : updated_data.race;
  if (typeof parsed_race === "undefined") {
    console.log("Raza invalido");
    return;
  } 

  if (index !== -1) {
    const old_client_data = clients[index];
    const client: Clients = Clients.fromJSON(old_client_data as unknown as ClientsJSON);
    client.name = updated_data.name ?? old_client_data.name;
    client.location = updated_data.location ?? old_client_data.location;
    client.race = parsed_race ?? old_client_data.race;
    db.data.clients[index] = client;
    db.write();
  }
}
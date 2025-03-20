import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import * as MyGoods from "../database/assets.js";
import * as MyMerchants from "../database/merchants.js";
import * as MyClients from "../database/clients.js";

type Data = {
    assets: Assets[],
    merchants: Merchant[],
    clients: Clients[]
};

const defaultData: Data = { 
    assets: [ MyGoods.asset1, MyGoods.asset2, MyGoods.asset3, MyGoods.asset4, MyGoods.asset5,
              MyGoods.asset6, MyGoods.asset7, MyGoods.asset8, MyGoods.asset9, MyGoods.asset10,
              MyGoods.asset11, MyGoods.asset12, MyGoods.asset13, MyGoods.asset14, MyGoods.asset15,
              MyGoods.asset16, MyGoods.asset17, MyGoods.asset18, MyGoods.asset19, MyGoods.asset20 ], 

    merchants: [ MyMerchants.merchant1, MyMerchants.merchant2, MyMerchants.merchant3, MyMerchants.merchant4, MyMerchants.merchant5, 
                MyMerchants.merchant6, MyMerchants.merchant7, MyMerchants.merchant8, MyMerchants.merchant9, MyMerchants.merchant10 ], 

    clients: [ MyClients.client1, MyClients.client2, MyClients.client3, MyClients.client4, MyClients.client5, 
              MyClients.client6, MyClients.client7, MyClients.client8, MyClients.client9, MyClients.client10 ]
};

export let db = new Low<Data>(new JSONFile('src/database/db.json'), defaultData);

/**
 * Inicializamos la base de datos con los valores por defecto.
 */
export async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = JSON.parse(JSON.stringify(defaultData));
    await db.write();
  }
}

/**
 * Añade un bien a la base de datos.
 * @param asset - Bien a agregar.
 */
export async function addAsset(asset: Assets) {
  await initDB();
  db.data.assets.push(asset);
  await db.write();
}

/**
 * Elimina un bien de la base de datos dado su nombre.
 * @param name - Nombre del bien a eliminar.
 */
export async function removeAsset(name: string) {
  await initDB();
  const index = db.data.assets.findIndex((asset: Assets) => asset.name === name);
  if (index !== -1) {
    db.data.assets.splice(index, 1);
    await db.write();
  } 
}

/**
 * Permite modificar un bien.
 * @param name - Nombre del bien a modificar.
 * @param updated_data - Datos del bien a modificar. 
 */
export async function updateAsset(name: string, updated_data: Partial<Assets>) {
  await initDB();
  const index = db.data.assets.findIndex((asset: Assets) => asset.name === name);
  if (index !== -1) {
    const old_asset_data = db.data.assets[index];
    db.data.assets[index] = new Assets(
      updated_data.name ?? old_asset_data.name,
      updated_data.description ?? old_asset_data.description,
      updated_data.materials !== undefined ? updated_data.materials : old_asset_data.materials,
      updated_data.weight ?? old_asset_data.weight,
      updated_data.crowns ?? old_asset_data.crowns
    );
    await db.write();
  }
}

/**
 * Añade un mercader a la base de datos.
 * @param merchant - Mercader a agregar.
 */
export async function addMerchant(merchant: Merchant) {
  await initDB();
  db.data.merchants.push(merchant);
  await db.write();
}

/**
 * Elimina un mercader de la base de datos dado su nombre.
 * @param name - Nombre del mercader a eliminar.
 */
export async function removeMerchant(name: string) {
  await initDB();
  db.data.merchants = db.data.merchants.filter((merchant: Merchant) => merchant.name !== name);
  await db.write();
}

/**
 * Permite modificar el estado de un mercader.
 * @param name - Nombre del mercader a modificar.
 * @param updated_data - Datos del mercader a modificar.
 */
export async function updateMerchant(name: string, updated_data: Partial<Merchant>) {
  await initDB();
  const index = db.data.merchants.findIndex((merchant: Merchant) => merchant.name === name);
  if (index !== -1) {
    const old_merchant_data = db.data.merchants[index];
    db.data.merchants[index] = new Merchant(
      updated_data.name ?? old_merchant_data.name,
      updated_data.location ?? old_merchant_data.location,
      updated_data.type ?? old_merchant_data.type
    );
    await db.write(); 
  } 
}

/**
 * Añade un cliente a la base de datos.
 * @param client - Cliente a agregar
 */
export async function addClient(client: Clients) {
  await initDB();
  db.data.clients.push(client);
  await db.write();
}

/**
 * Elimina un cliente de la base de datos dado su nombre.
 * @param name - Nombre del cliente a eliminar.
 */
export async function removeClient(name: string) {
  await initDB();
  db.data.clients = db.data.clients.filter((client: Clients) => client.name !== name);
  await db.write();
}

/**
 * Permite modificar el estado de un cliente.
 * @param name - Nombre del cliente a modificar.
 * @param updated_data - Datos del cliente a modificar. 
 */
export async function updateClient(name: string, updated_data: Partial<Clients>) {
  await initDB();
  const index = db.data.clients.findIndex((client: Clients) => client.name === name);
  if (index !== -1) {
    const old_client_data = db.data.clients[index];
    db.data.clients[index] = new Clients(
      updated_data.name ?? old_client_data.name,
      updated_data.location ?? old_client_data.location,
      updated_data.race ?? old_client_data.race
    );
    await db.write();
  }
}
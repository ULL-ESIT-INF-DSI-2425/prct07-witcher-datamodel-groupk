import inquirer from "inquirer";
import { db } from "../database/database.js";
import { menu } from "./menu.js";
import { locateMerchant } from "./locate_merchant_menu.js"
import { locateClient } from "./locate_client_menu.js";

/**
 * Submenu de localización. Permite localizar a un mercader, cliente o volver al menu anterior.
 * Mercader: Llama al menú locateMerchant() para dar las opciones para localizar al mercader.
 * Cliente: Llama al menú locateClient() para dar las opciones para localizar al cliente.
 * Volver atrás: Vuelve al menú principal.
 */
export async function locateMenu() {
  db.read(); 

  const { category } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "¿Qué desea localizar?",
      choices: ["Mercader", "Cliente", "Volver atrás"],
    },
  ]);

  switch (category) {
    case "Mercader":
      await locateMerchant();
      break;

    case "Cliente":
      await locateClient();
      break;

    case "Volver atrás":
      await menu();
      break;
  }

  await locateMenu();
}
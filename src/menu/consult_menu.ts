import inquirer from "inquirer";
import { db } from "../database/database.js";
import { menu } from "./menu.js";
import { searchItemMenu } from "./search_item_menu.js";
import { sortItemMenu } from "./sort_item_menu.js";

/**
 * Submenú de consulta. Permite:
 * Buscar bien: Te lleva al submenú "searchItemMenu()".
 * Ordenar bienes: Te lleva al submenú "sortItemMenu()".
 * Volver atrás: Regresa al menú principal.
 */
export async function consultMenu() {
  await db.read();

  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué desea hacer en la consulta de bienes?",
      choices: ["Buscar bien", "Ordenar bienes", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Buscar bien":
      await searchItemMenu();
      break;

    case "Ordenar bienes":
      await sortItemMenu();
      break;

    case "Volver atrás":
      await menu();
      return;
  }

  await consultMenu();
}
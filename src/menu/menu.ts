import inquirer from "inquirer";
import { addMenu } from "./add_menu.js";
import { removeMenu } from "./remove_menu.js";
import { modifyMenu } from "./modify_menu.js";
import { consultMenu } from "./consult_menu.js";
import { locateMenu } from "./locate_menu.js";
import { reportMenu } from "./report_menu.js"
import { initDB } from "../database/database.js";
import { Inventary } from "../items/inventary.js";
import { transactionMenu } from "./transactions_menu.js";

export const inventary: Inventary = await Inventary.buildInventaryFromDB();

/**
 * Menu principal. Permite las opciones de: 
 * Añadir: Añade un bien, mercader o cliente a la base de datos.
 * Eliminar: Elimina un bien, mercader o cliente de la base de datos.
 * Modificar: Modifica un bien, mercader o cliente ya existente en la base de datos.
 * Consultar información: Permite buscar un bien por su nombre o descripción. Además permite ordenar
 * los bienes por orden alfabetico o precio en coronas (tanto ascendente como descendente).
 * Localizar: Permite localizar a un mercader por su nombre, ubicación y tipo
 * y a un cliente por su nombre, tipo y raza.
 * Reiniciar Base de Datos: Reinicia la base de datos con los valores por defecto.
 * Salir: Sale del menú principal.
 */
export async function menu() {
  const { option } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "option",
      message: "Seleccione una de las siguientes opciones: ",
      choices: ["Añadir", "Eliminar", "Modificar", "Consultar información", "Localizar", "Reiniciar Base de Datos", "Generar informes", "Transacciones", "Salir"],
    },
  ]);

  switch (option) {
    case "Añadir":
      await addMenu();
      break;

    case "Eliminar":
      await removeMenu();
      break;

    case "Modificar":
      await modifyMenu();
      break;

    case "Consultar información":
      await consultMenu();
      break;
    
    case "Localizar":
      await locateMenu(); 
      break;

    case "Reiniciar Base de Datos":
      await initDB();
      await menu();
      break;

    case "Generar informes":
      await reportMenu();
      break;

    case "Transacciones":
      await transactionMenu();
      break;

    case "Salir":
      console.log("Saliendo del sistema...");
      process.exit();
  }
}

initDB();
await menu();
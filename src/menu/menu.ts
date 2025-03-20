import inquirer from "inquirer";
import { addMenu } from "./add_menu.js";
import { removeMenu } from "./remove_menu.js";
import { modifyMenu } from "./modify_menu.js";

export async function menu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Seleccione una de las siguientes opciones: ",
      choices: ["Añadir", "Eliminar", "Modificar", "Consultar información", "Salir"],
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

    case "Salir":
      console.log("Saliendo del sistema...");
      process.exit();
  }
}

await menu(); 
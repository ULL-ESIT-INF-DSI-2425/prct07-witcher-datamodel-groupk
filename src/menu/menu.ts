import inquirer from "inquirer";
import { Inventary } from "../items/inventary.js";

async function menu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Seleccione una de las siguientes opciones: ",
      choices: ["Añadir", "Eliminar", "Modificar", "Consultar información", "Salir"],
    },
  ]);
}
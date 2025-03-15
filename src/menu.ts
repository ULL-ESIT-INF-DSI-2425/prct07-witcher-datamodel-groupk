import inquirer from "inquirer";
import { Assets, Merchant, Clients, Inventary, Type, Race } from "../src/main"

const inventary = new Inventary();

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
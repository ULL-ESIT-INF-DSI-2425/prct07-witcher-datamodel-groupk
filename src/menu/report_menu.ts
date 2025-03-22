import inquirer from "inquirer";
import { Inventary } from "../items/inventary.js"
import  { menu, inventary } from "../menu/menu.js"
import { db } from "../database/database.js";

export async function reportMenu() {
  await db.read();

  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Seleccione una de las siguientes opciones: ",
      choices: ["Estado del Stock", "Mejores Ventas", "Ingresos y Gastos", "Historial de transacciones", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Estado del Stock":
      const { search_name } = await inquirer.prompt([
        { type: "input", name: "search_name", message: "Ingrese el nombre a buscar:" },
      ]);
      
      const report_stock = inventary.getStockReport(search_name);
      console.table(report_stock.map(stock => ({
        Nombre: stock[0].name,
        Cantidad: stock[1]
      })));
      break;

    case "Mejores Ventas":

      break;

    case "Ingresos y Gastos":
      break;

    case "Historial de transacciones":

      break;

    case "Volver atrás":
      await menu();
      return;
  }

  await reportMenu();
}
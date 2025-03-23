import inquirer from "inquirer";
import  { menu, inventary } from "../menu/menu.js"
import { db } from "../database/database.js";
import * as MyClients from "../database/clients.js";
import * as MyMerchants from "../database/merchants.js";

/**
 * Submenú reportMenu(). Permite ver informes de las transacciones que se han realizado:
 * Estado del Stock: Te muestra los bienes en stock (pueden ser todos o seleccionar uno).
 * Mejores ventas: Te muestra una lista con los bienes más vendidos.
 * Ingresos y Gastos: Te muestra un balance entre el dinero ingresado y el dinero
 * gastado en compras y ventas.
 * Historial de transacciones: Te muestra el historial de transacciones de un cliente
 * o de un mercader.
 * Volver atrás: Vuelve al menú principal.
 */
export async function reportMenu() {
  db.read();

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
      const stock_demand = inventary.getBestSellingAssets();
      console.table(stock_demand.map(stock => ({
        Nombre: stock.asset.name,
        Ventas: stock.sold
      })))
      break;
    case "Ingresos y Gastos":
      const financy_result = inventary.getFinancialSummary();
      console.table({
        Ingresos_totales: financy_result.totalIncome,
        Gastos_totales: financy_result.totalExpenses,
        Beneficios: financy_result.totalIncome - financy_result.totalExpenses
      })
      break;

    case "Historial de transacciones":
      const { option_history } = await inquirer.prompt([
        {
          type: "list",
          name: "option_history",
          message: "Seleccione una de las siguientes opciones: ",
          choices: ["Historial de un cliente", "Historial de un mercader", "Volver atrás"],
        },
      ]);
      switch (option_history) {
        case "Historial de un cliente":
          const { client_name } = await inquirer.prompt([
            { type: "input", name: "client_name", message: "Ingrese el nombre a buscar:" },
          ]);
          const client = MyClients.clients.find(c => c.name.toLowerCase() === client_name.toLowerCase());
          if (!client) {
            console.log("No se encontró un cliente con ese nombre.");
            break;
          }
          const client_history = inventary.getTransactionHistoryForClient(client);
          console.table(client_history.map(trans => {
            const bienes = trans.getExchangeAssets()
              .map(([asset, quantity]) => `${asset.name} (x${quantity})`)
              .join(", ");
            return {
              Nombre: trans.client.name,
              Fecha: trans.date.getDate(),
              Pago: trans.crowns,
              Tipo: trans.isRefund ? "Devolución" : "Compra",
              Bienes: bienes
            };
          }));
          break;
        case "Historial de un mercader":
          const { mercader_name } = await inquirer.prompt([
            { type: "input", name: "mercader_name", message: "Ingrese el nombre a buscar:" },
          ]);
          const mercader = MyMerchants.merchants.find(c => c.name.toLowerCase() === mercader_name.toLowerCase());
          if (!mercader) {
            console.log("No se encontró un cliente con ese nombre.");
            break;
          }
          const mercader_history = inventary.getTransactionHistoryForMerchant(mercader);
          if (typeof mercader_history === "undefined") console.log("Error con mercader_history. Es undefined");
          console.table(mercader_history.map(trans => {
            const bienes = trans.getExchangeAssets()
              .map(([asset, quantity]) => `${asset.name} (x${quantity})`)
              .join(", ");
            return {
              Nombre: trans.merchant.name,
              Fecha: trans.date.getDate(),
              Pago: trans.crowns,
              Tipo: trans.isRefund ? "Reembolso" : "Venta",
              Bienes: bienes
            };
          }));
          break;
        case "Volver atrás":
          await reportMenu();
          break;
      }
      break;
    case "Volver atrás":
      await menu();
      return;
  }

  await reportMenu();
}
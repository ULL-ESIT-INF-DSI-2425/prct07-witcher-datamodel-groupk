import { describe, test, expect, beforeEach } from "vitest";
import { Assets } from "../src/items/asset.js";
import { Inventary } from "../src/items/inventary.js";
import { Date } from "../src/utils/date.js";
import * as MyAssets from "../src/database/assets.js";
import * as MyMerchants from "../src/database/merchants.js";
import * as MyClients from "../src/database/clients.js";
import * as Enums from "../src/enums/types-and-races.js";
import { BuyTransaction } from "../src/transactions/buyTransaction.js";
import { SellTransaction } from "../src/transactions/sellTransation.js";
import { Merchant } from "../src/characters/merchant.js";
import { Clients } from "../src/characters/client.js";
import { RefundBuyTransaction } from "../src/transactions/refundBuyTransaction.js";

const inventary: Inventary = new Inventary([[MyAssets.asset1, 2], [MyAssets.asset2, 3]]);

describe("Pruebas de Inventary", () => {
    describe("Pruebas de los getter", () => {
        test("Getter de assetsList", () => {
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 3]]);
        });

        test("Getter de transactions", () => {
            expect(inventary.transactions).toStrictEqual([]);
        });
    });

    const transaction1: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset3], [5], MyMerchants.merchant1);
    const transaction2: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset2], [2], MyMerchants.merchant1);
    const transaction3: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset4, MyAssets.asset5], [3, 1], MyMerchants.merchant1);
    const transaction4: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset6], [1], MyMerchants.merchant1);
    const transaction5: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset2], [2], MyClients.client1);
    const transaction6: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [2], MyClients.client1);
    const transaction7: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset4, MyAssets.asset5], [1, 1], MyClients.client1);
    const transaction8: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset3], [3], MyClients.client2);

    describe("Pruebas de buyAssets", () => {
        test("El bien no existe", () => {
            const asset: Assets = new Assets("Nombre", "Descripción", ["Material"], 10, 10);
            expect(() => inventary.buyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [asset, 1])).toThrowError("El bien que quieres comprar no existe.");
        });

        test("El mercader no existe", () => {
            const merchant: Merchant = new Merchant("Nombre", "Localización", Enums.Type.General);
            expect(() => inventary.buyAssets(merchant, new Date(10, 10, 2025), [MyAssets.asset1, 1])).toThrowError("El mercader al que le quieres comprar no existe.");
        });

        test("Añadir asset3 con 5 unidades", () => {
            inventary.buyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset3, 5]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 3], [MyAssets.asset3, 5]]);
            expect(inventary.transactions).toStrictEqual([transaction1]);
        });

        test("Añadir asset2 con 2 unidades", () => {
            inventary.buyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset2, 2]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 5], [MyAssets.asset3, 5]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2]);
        });

        test("Añadir asset4 con 3 unidades y asset5 con 1 unidad", () => {
            inventary.buyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset4, 3], [MyAssets.asset5, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 5], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3]);
        });

        test("Añadir asset6 con 1 unidad", () => {
            inventary.buyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset6, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 5], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4]);
        });
    });

    describe("Pruebas de sellAssets", () => {
        test("El bien no está disponible en el inventario", () => {
            const asset: Assets = new Assets("Nombre", "Descripción", ["Material"], 10, 10);
            expect(() => inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [asset, 1])).toThrowError("El bien que quieres vender no está disponible o no cuenta con el suficiente stock");
        });

        test("El inventario no cuenta con los suficientes bienes para vender", () => {
            expect(() => inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset1, 10])).toThrowError("El bien que quieres vender no está disponible o no cuenta con el suficiente stock");
        });

        test("El cliente no existe", () => {
            const client: Clients = new Clients("Nombre", "Localización", Enums.Race.Elf);
            expect(() => inventary.sellAssets(client, new Date(10, 10, 2025), [MyAssets.asset1, 1])).toThrowError("El cliente al que le quieres vender no existe.");
        });

        test("Eliminar 2 unidades de asset2", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset2, 2]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5]);
        });

        test("Eliminar 2 unidades de asset1", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset1, 2]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6]);
        });

        test("Eliminar asset4 con 2 unidades y asset5 con 1 unidad", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset4, 1], [MyAssets.asset5, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 2], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, transaction7]);
        });

        test("Eliminar asset3 con 3 unidades", () => {
            inventary.sellAssets(MyClients.client2, new Date(10, 10, 2025), [MyAssets.asset3, 3]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 2], [MyAssets.asset4, 2], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, transaction7, transaction8]);
        });
    });

    const transaction9: RefundBuyTransaction = new RefundBuyTransaction(new Date(10, 10, 2025), [MyAssets.asset3], [1], MyMerchants.merchant1);
    const transaction10: RefundBuyTransaction = new RefundBuyTransaction(new Date(11, 10, 2025), [MyAssets.asset2], [2], MyMerchants.merchant1);
    const transaction11: RefundBuyTransaction = new RefundBuyTransaction(new Date(12, 10, 2025), [MyAssets.asset4, MyAssets.asset6], [1, 1], MyMerchants.merchant1);
    const transaction12: RefundBuyTransaction = new RefundBuyTransaction(new Date(12, 10, 2025), [MyAssets.asset4], [1], MyMerchants.merchant1);

    describe("Pruebas de refundBuyAssets", () => {
        test("No se tiene uno de los bienes a devolver", () => {
            expect(() => inventary.refundBuyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset3, 5])).toThrowError("No tienes del bien que quieres devolver.");
        });

        test("No hay transacciones con ese mercader", () => {
            expect(() => inventary.refundBuyAssets(MyMerchants.merchant3, new Date(10, 10, 2025), [MyAssets.asset3, 1])).toThrowError("No se realizó ninguna transacción sobre algún bien hasta el momento con ese mercader hasta el momento.");
        });

        test("No hay transacciones con ese mercader hasta el momento", () => {
            expect(() => inventary.refundBuyAssets(MyMerchants.merchant1, new Date(9, 10, 2025), [MyAssets.asset3, 1])).toThrowError("No se realizó ninguna transacción sobre algún bien hasta el momento con ese mercader hasta el momento.");
        });

        test("Las cantidades que se han comprado de ese mercader son menores que las indicadas", () => {
            expect(() => inventary.refundBuyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset2, 3])).toThrowError("Entre todas las compras a ese mercader, no se compró tanta cantidad de uno de los bienes.");
        });

        test("Devolver 1 unidades de asset3", () => {
            inventary.refundBuyAssets(MyMerchants.merchant1, new Date(10, 10, 2025), [MyAssets.asset3, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 1], [MyAssets.asset4, 2], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, 
                                                            transaction7, transaction8, transaction9]);
        });

        test("Devolver 2 unidades de asset2", () => {
            inventary.refundBuyAssets(MyMerchants.merchant1, new Date(11, 10, 2025), [MyAssets.asset2, 2]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 1], [MyAssets.asset3, 1], [MyAssets.asset4, 2], [MyAssets.asset6, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, 
                                                            transaction7, transaction8, transaction9, transaction10]);
        });

        test("Devolver 1 unidad de asset4 y 1 unidad de asset6", () => {
            inventary.refundBuyAssets(MyMerchants.merchant1, new Date(12, 10, 2025), [MyAssets.asset4, 1], [MyAssets.asset6, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 1], [MyAssets.asset3, 1], [MyAssets.asset4, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, 
                                                            transaction7, transaction8, transaction9, transaction10, transaction11]);
        });

        test("Devolver 1 unidad de asset4", () => {
            inventary.refundBuyAssets(MyMerchants.merchant1, new Date(12, 10, 2025), [MyAssets.asset4, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 1], [MyAssets.asset3, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, 
                                                            transaction7, transaction8, transaction9, transaction10, transaction11, transaction12]);
        });
    });      

    describe("Tests para getStockReport", () => {

        let inventaryInforme: Inventary;
        beforeEach(() => {
            inventaryInforme = new Inventary([[MyAssets.asset1, 10],[MyAssets.asset2, 5],[MyAssets.asset7, 3]]);
            inventaryInforme.sellAssets(MyClients.client1, new Date(1, 1, 2025), [MyAssets.asset1, 2]);
            inventaryInforme.sellAssets(MyClients.client1, new Date(1, 1, 2025), [MyAssets.asset2, 1]);
            inventaryInforme.sellAssets(MyClients.client1, new Date(1, 1, 2025), [MyAssets.asset1, 3]);
        });

        test("getStockReport sin filtro", () => {
            const report = inventaryInforme.getStockReport();
            expect(report).toStrictEqual([[MyAssets.asset1, 5], [MyAssets.asset2, 4], [MyAssets.asset7, 3]]);
        });

        test("getStockReport con filtro", () => {
            const report = inventaryInforme.getStockReport(
            (stock) => stock[0].description === "Espada"
            );
            expect(report).toStrictEqual([[MyAssets.asset1, 5], [MyAssets.asset2, 4]]);
        });

        test("Inventario sin ventas, getStockReport devuelve stock original", () => {
          const inv = new Inventary([[MyAssets.asset1, 5],[MyAssets.asset2, 8]]);
          const report = inv.getStockReport();
          expect(report).toStrictEqual([
            [MyAssets.asset1, 5],
            [MyAssets.asset2, 8]
          ]);
        });
      
        test("Filtro que devuelve vacío: getStockReport", () => {
          const inv = new Inventary([[MyAssets.asset1, 5], [MyAssets.asset2, 8]]);
          const report = inv.getStockReport(() => false);
          expect(report).toStrictEqual([]);
        });
      
        test("Filtro que devuelve todos: getStockReport", () => {
          const inv = new Inventary([[MyAssets.asset1, 5],[MyAssets.asset2, 8]]);
          const report = inv.getStockReport(() => true);
          expect(report).toStrictEqual([[MyAssets.asset1, 5],[MyAssets.asset2, 8]]);
        });
      
        test("Inventario modificado con ventas adicionales: getStockReport", () => {
          const inv = new Inventary([[MyAssets.asset1, 10],[MyAssets.asset2, 6]]);
          inv.sellAssets(MyClients.client1, new Date(2, 2, 2025), [MyAssets.asset1, 4]);
          inv.sellAssets(MyClients.client1, new Date(2, 2, 2025), [MyAssets.asset2, 2]);
          inv.sellAssets(MyClients.client1, new Date(2, 2, 2025), [MyAssets.asset1, 1]);
          const report = inv.getStockReport();
          expect(report).toStrictEqual([[MyAssets.asset1, 5],[MyAssets.asset2, 4]]);
        });
      
        test("Filtro por descripción en inventario mixto: getStockReport", () => {
          const inv = new Inventary([[MyAssets.asset1, 10],[MyAssets.asset2, 8],[MyAssets.asset7, 4]]);
          const report = inv.getStockReport(
            (stock) => stock[0].description === "Espada"
          );
          expect(report).toStrictEqual([[MyAssets.asset1, 10],[MyAssets.asset2, 8]]);
        });
      });

      describe("Tests adicionales para getBestSellingAssets", () => {

        test("Sin ventas, getBestSellingAssets devuelve array vacío", () => {
          const inv = new Inventary([[MyAssets.asset1, 10], [MyAssets.asset2, 5]]);
          const bestSelling = inv.getBestSellingAssets();
          expect(bestSelling).toStrictEqual([]);
        });
      
        test("Ventas múltiples acumuladas para un mismo activo: getBestSellingAssets", () => {
          const inv = new Inventary([ [MyAssets.asset1, 10], [MyAssets.asset2, 5]]);
          inv.sellAssets(MyClients.client1, new Date(3, 3, 2025), [MyAssets.asset1, 3]);
          inv.sellAssets(MyClients.client1, new Date(3, 3, 2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(3, 3, 2025), [MyAssets.asset2, 1]);
          const bestSelling = inv.getBestSellingAssets();
          expect(bestSelling).toStrictEqual([{ asset: MyAssets.asset1, sold: 5 }, { asset: MyAssets.asset2, sold: 1 }]);
        });
      
        test("Empate en ventas entre activos: getBestSellingAssets", () => {
          const inv = new Inventary([ [MyAssets.asset1, 10], [MyAssets.asset2, 10]]);
          inv.sellAssets(MyClients.client1, new Date(4, 4, 2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(4, 4, 2025), [MyAssets.asset2, 2]);
          const bestSelling = inv.getBestSellingAssets();
          expect(bestSelling).toEqual(
            expect.arrayContaining([ { asset: MyAssets.asset1, sold: 2 }, { asset: MyAssets.asset2, sold: 2 }])
          );
          expect(bestSelling.length).toBe(2);
        });
      
        test("Ventas en diferentes transacciones acumuladas: getBestSellingAssets", () => {
          const inv = new Inventary([ [MyAssets.asset1, 20]]);
          inv.sellAssets(MyClients.client1, new Date(5, 5, 2025), [MyAssets.asset1, 4]);
          inv.sellAssets(MyClients.client1, new Date(5, 5, 2025), [MyAssets.asset1, 6]);
          inv.sellAssets(MyClients.client1, new Date(5, 5, 2025), [MyAssets.asset1, 3]);
          const bestSelling = inv.getBestSellingAssets();
          expect(bestSelling).toStrictEqual([{ asset: MyAssets.asset1, sold: 13 }]);
        });
      });

      describe("getFinancialSummary", () => {
        let inv: Inventary;
        beforeEach(() => {
          inv = new Inventary([ [MyAssets.asset1, 10], [MyAssets.asset2, 5]]);
        });
    
        test("Sin transacciones, ingresos y gastos son 0", () => {
          const summary = inv.getFinancialSummary();
          expect(summary).toStrictEqual({ totalIncome: 0, totalExpenses: 0 });
        });
    
        test("Solo ventas: calcular ingresos correctamente", () => {
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset2, 1]);
          const summary = inv.getFinancialSummary();
          expect(summary).toStrictEqual({ totalIncome: 840 + 960, totalExpenses: 0 });
        });
    
        test("Solo compras: calcular gastos correctamente", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset2, 1]);
          const summary = inv.getFinancialSummary();
          expect(summary).toStrictEqual({ totalIncome: 0, totalExpenses: 1400 + 800 });
        });
    
        test("Combinación de venta y compra", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const summary = inv.getFinancialSummary();
          expect(summary).toStrictEqual({ totalIncome: 840, totalExpenses: 1400 });
        });
    
        test("Varias transacciones combinadas", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 3]);
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset2, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset2, 1]);
          const summary = inv.getFinancialSummary();
          expect(summary).toStrictEqual({ totalIncome: 1680 + 960, totalExpenses: 2100 + 1600 });
        });
      });

      describe("getTransactionHistoryForMerchant", () => {
        let inv: Inventary;
        beforeEach(() => {
          inv = new Inventary([ [MyAssets.asset1, 10], [MyAssets.asset2, 5]]);
        });
    
        test("Sin transacciones para el mercader, devuelve array vacío", () => {
          const history = inv.getTransactionHistoryForMerchant(MyMerchants.merchant1);
          expect(history).toStrictEqual([]);
        });
    
        test("Transacción única de compra para el mercader", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const history = inv.getTransactionHistoryForMerchant(MyMerchants.merchant1);
          expect(history.length).toBe(1);
          expect(history[0]).toBeInstanceOf(BuyTransaction);
          expect((history[0] as BuyTransaction).merchant).toBe(MyMerchants.merchant1);
        });
    
        test("Múltiples transacciones para el mismo mercader", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset2, 2]);
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 3]);
          const history = inv.getTransactionHistoryForMerchant(MyMerchants.merchant1);
          expect(history.length).toBe(3);
          history.forEach((trans) => {
            expect(trans).toBeInstanceOf(BuyTransaction);
            expect((trans as BuyTransaction).merchant).toBe(MyMerchants.merchant1);
          });
        });
    
        test("Transacciones de distintos mercaderes se filtran correctamente", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          inv.buyAssets(MyMerchants.merchant2, new Date(10,10,2025), [MyAssets.asset2, 2]);
          const history1 = inv.getTransactionHistoryForMerchant(MyMerchants.merchant1);
          const history2 = inv.getTransactionHistoryForMerchant(MyMerchants.merchant2);
          expect(history1.length).toBe(1);
          expect(history2.length).toBe(1);
          expect((history1[0] as BuyTransaction).merchant).toBe(MyMerchants.merchant1);
          expect((history2[0] as BuyTransaction).merchant).toBe(MyMerchants.merchant2);
        });
    
        test("Transacciones mixtas: solo se cuentan compras, no ventas", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const history = inv.getTransactionHistoryForMerchant(MyMerchants.merchant1);
          expect(history.length).toBe(1);
          expect((history[0] as BuyTransaction).merchant).toBe(MyMerchants.merchant1);
        });
      });    

      describe("getTransactionHistoryForClient", () => {
        let inv: Inventary;
        beforeEach(() => {
          inv = new Inventary([ [MyAssets.asset1, 10], [MyAssets.asset2, 5]]);
        });
    
        test("Sin transacciones para el cliente, devuelve array vacío", () => {
          const history = inv.getTransactionHistoryForClient(MyClients.client1);
          expect(history).toStrictEqual([]);
        });
    
        test("Transacción única de venta para el cliente", () => {
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const history = inv.getTransactionHistoryForClient(MyClients.client1);
          expect(history.length).toBe(1);
          expect(history[0]).toBeInstanceOf(SellTransaction);
          expect((history[0] as SellTransaction).client).toBe(MyClients.client1);
        });
    
        test("Múltiples transacciones para el mismo cliente", () => {
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset2, 1]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const history = inv.getTransactionHistoryForClient(MyClients.client1);
          expect(history.length).toBe(3);
          history.forEach((trans) => {
            expect(trans).toBeInstanceOf(SellTransaction);
            expect((trans as SellTransaction).client).toBe(MyClients.client1);
          });
        });
    
        test("Transacciones de distintos clientes se filtran correctamente", () => {
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client2, new Date(10,10,2025), [MyAssets.asset2, 2]);
          const history1 = inv.getTransactionHistoryForClient(MyClients.client1);
          const history2 = inv.getTransactionHistoryForClient(MyClients.client2);
          expect(history1.length).toBe(1);
          expect(history2.length).toBe(1);
          expect((history1[0] as SellTransaction).client).toBe(MyClients.client1);
          expect((history2[0] as SellTransaction).client).toBe(MyClients.client2);
        });
    
        test("Transacciones mixtas: solo se cuentan ventas, no compras", () => {
          inv.buyAssets(MyMerchants.merchant1, new Date(10,10,2025), [MyAssets.asset1, 2]);
          inv.sellAssets(MyClients.client1, new Date(10,10,2025), [MyAssets.asset1, 1]);
          const history = inv.getTransactionHistoryForClient(MyClients.client1);
          expect(history.length).toBe(1);
          expect((history[0] as SellTransaction).client).toBe(MyClients.client1);
        });
      });
});
import { describe, test, expect } from "vitest";
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
    const transaction4: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset2], [2], MyClients.client1);
    const transaction5: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [2], MyClients.client1);
    const transaction6: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset4, MyAssets.asset5], [1, 1], MyClients.client1);
    const transaction7: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset2, MyAssets.asset3], [1, 3], MyClients.client1);

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
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4]);
        });

        test("Eliminar 2 unidades de asset1", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset1, 2]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 3], [MyAssets.asset5, 1]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5]);
        });

        test("Eliminar asset4 con 2 unidades y asset5 con 1 unidad", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset4, 1], [MyAssets.asset5, 1]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 3], [MyAssets.asset3, 5], [MyAssets.asset4, 2]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6]);
        });

        test("Eliminar asset4 con 2 unidades y asset5 con 1 unidad", () => {
            inventary.sellAssets(MyClients.client1, new Date(10, 10, 2025), [MyAssets.asset2, 1], [MyAssets.asset3, 3]);
            expect(inventary.assetsList).toStrictEqual([[MyAssets.asset2, 2], [MyAssets.asset3, 2], [MyAssets.asset4, 2]]);
            expect(inventary.transactions).toStrictEqual([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, transaction7]);
        });
    });

    describe("Pruebas de funciones de informes", () => {
        // No funcionan (en proceso)
        // test("getStockReport sin filtro", () => {
        //     const report = inventary.getStockReport();
        //     expect(report).toStrictEqual([[MyAssets.asset1, 1], [MyAssets.asset2, 1], [MyAssets.asset3, 5]]);
        // });
        
        // test("getStockReport con filtro", () => {
        //     const report = inventary.getStockReport((stock) => stock[0].description === "Espada");
        //     expect(report).toStrictEqual([[MyAssets.asset1, 1], [MyAssets.asset2, 1]]);
        // });
        
        // test("getBestSellingAssets", () => {
        //     const bestSelling = inventary.getBestSellingAssets();
        //     expect(bestSelling).toStrictEqual([
        //     { asset: MyAssets.asset2, sold: 2 },
        //     { asset: MyAssets.asset1, sold: 1 },
        //     ]);
        // });

        test("getFinancialSummary", () => {
            const summary = inventary.getFinancialSummary();
            expect(summary).toStrictEqual({ totalIncome: 4920, totalExpenses: 3300 });
          });

        test("getTransactionHistoryForMerchant", () => {
            const history = inventary.getTransactionHistoryForMerchant(MyMerchants.merchant1);
            expect(history.length).toBe(3);
            history.forEach((trans) => {
              expect(trans).toBeInstanceOf(BuyTransaction);
              expect((trans as BuyTransaction).merchant).toBe(MyMerchants.merchant1);
            });
          });

        test("getTransactionHistoryForClient", () => {
            const history = inventary.getTransactionHistoryForClient(MyClients.client1);
            expect(history.length).toBe(4);
            history.forEach((trans) => {
                expect(trans).toBeInstanceOf(SellTransaction);
                expect((trans as SellTransaction).client).toBe(MyClients.client1);
            });
        });
    });
});
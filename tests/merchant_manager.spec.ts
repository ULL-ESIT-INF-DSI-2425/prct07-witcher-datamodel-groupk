import { describe, test, expect } from "vitest";
import { MerchantManager } from "../src/managers/merchant_manager.js";
import * as MyMerchants from "../src/database/merchants.js";
import { Type } from "../src/enums/types-and-races.js";

const merchants: MerchantManager = new MerchantManager([MyMerchants.merchant1, MyMerchants.merchant2, MyMerchants.merchant3]);

describe("Pruebas de AssetManager", () => {
    describe("Pruebas de searchByName", () => {
        test("Prueba 1", () => {
            expect(merchants.searchByName("Chet")).toStrictEqual([MyMerchants.merchant1]);
        });

        test("Prueba 2", () => {
            expect(merchants.searchByName("Millie")).toStrictEqual([MyMerchants.merchant2]);
        });

        test("Prueba 3", () => {
            expect(merchants.searchByName("Mislav")).toStrictEqual([MyMerchants.merchant3]);
        });

        test("Prueba 4", () => {
            expect(merchants.searchByName("AAA")).toStrictEqual([]);
        });
    });

    describe("Pruebas de searchByLocation", () => {
        test("Prueba 1", () => {
            expect(merchants.searchByLocation("Beauclair")).toStrictEqual([MyMerchants.merchant1]);
        });

        test("Prueba 2", () => {
            expect(merchants.searchByLocation("Vengerberg")).toStrictEqual([MyMerchants.merchant2]);
        });

        test("Prueba 3", () => {
            expect(merchants.searchByLocation("Ard Carraigh")).toStrictEqual([MyMerchants.merchant3]);
        });

        test("Prueba 4", () => {
            expect(merchants.searchByLocation("AAA")).toStrictEqual([]);
        });
    });

    describe("Pruebas de searchByRace", () => {
        test("Prueba 1", () => {
            expect(merchants.searchByType(Type.General)).toStrictEqual([MyMerchants.merchant1, MyMerchants.merchant2]);
        });

        test("Prueba 2", () => {
            expect(merchants.searchByType(Type.Alchemist)).toStrictEqual([MyMerchants.merchant3]);
        });

        test("Prueba 3", () => {
            expect(merchants.searchByType(Type.Blacksmith)).toStrictEqual([]);
        });
    });
});
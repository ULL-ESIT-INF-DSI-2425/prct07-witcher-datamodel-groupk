import { describe, test, expect } from "vitest";
import { AssetManager } from "../src/managers/assets_manager.js"
import * as MyAssets from "../src/database/assets.js";

const assets: AssetManager = new AssetManager([MyAssets.asset1, MyAssets.asset2, MyAssets.asset3]);
const assets2: AssetManager = new AssetManager([MyAssets.asset5, MyAssets.asset6, MyAssets.asset7]);

describe("Pruebas de AssetManager", () => {
    describe("Pruebas de searchByName", () => {
        test("Prueba 1", () => {
            expect(assets.searchByName("Mediadora")).toStrictEqual([MyAssets.asset1]);
        });

        test("Prueba 2", () => {
            expect(assets.searchByName("Carabella")).toStrictEqual([MyAssets.asset2]);
        });

        test("Prueba 3", () => {
            expect(assets.searchByName("Espada de acero del brujo")).toStrictEqual([MyAssets.asset3]);
        });

        test("Prueba 4", () => {
            expect(assets.searchByName("AAA")).toStrictEqual([]);
        });
    });

    describe("Pruebas de searchByDescription", () => {
        test("Prueba 1", () => {
            expect(assets.searchByDescription("Espada")).toStrictEqual([MyAssets.asset1, MyAssets.asset2, MyAssets.asset3]);
        });

        test("Prueba 2", () => {
            expect(assets.searchByDescription("AAA")).toStrictEqual([]);
        });

        test("Prueba 3", () => {
            expect(assets2.searchByDescription("Espada")).toStrictEqual([MyAssets.asset5, MyAssets.asset6]);
        });

        test("Prueba 4", () => {
            expect(assets2.searchByDescription("Armadura")).toStrictEqual([MyAssets.asset7]);
        });
    });

    describe("Pruebas de sortByName", () => {
        test("Prueba 1", () => {
            expect(assets.sortByName(true)).toStrictEqual([MyAssets.asset2, MyAssets.asset3, MyAssets.asset1]);
        });

        test("Prueba 2", () => {
            expect(assets.sortByName(false)).toStrictEqual([MyAssets.asset1, MyAssets.asset3, MyAssets.asset2]);
        });

        test("Prueba 3", () => {
            expect(assets2.sortByName(true)).toStrictEqual([MyAssets.asset7, MyAssets.asset5, MyAssets.asset6]);
        });

        test("Prueba 4", () => {
            expect(assets2.sortByName(false)).toStrictEqual([MyAssets.asset6, MyAssets.asset5, MyAssets.asset7]);
        });
    });


    describe("Pruebas de sortByCrowns", () => {
        test("Prueba 1", () => {
            expect(assets.sortByCrowns(true)).toStrictEqual([MyAssets.asset3, MyAssets.asset1, MyAssets.asset2]);
        });

        test("Prueba 2", () => {
            expect(assets.sortByCrowns(false)).toStrictEqual([MyAssets.asset2, MyAssets.asset1, MyAssets.asset3]);
        });

        test("Prueba 3", () => {
            expect(assets2.sortByCrowns(true)).toStrictEqual([MyAssets.asset6, MyAssets.asset5, MyAssets.asset7]);
        });

        test("Prueba 4", () => {
            expect(assets2.sortByCrowns(false)).toStrictEqual([MyAssets.asset7, MyAssets.asset5, MyAssets.asset6]);
        });
    });
});
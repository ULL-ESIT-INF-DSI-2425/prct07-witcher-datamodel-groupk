import { describe, test, expect } from "vitest"
import { Assets } from "../src/items/asset.js";
import * as MyAssets from "../src/database/assets.js";

describe("Pruebas de Assets", () => {
    describe("Pruebas del constructor", () => {
        test("Nombre del bien vacío", () => {
            expect(() => new Assets("", "Descripción", ["Material 1"], 10, 10)).toThrowError("El nombre no puede estar vacío.");
        });
    
        test("Descripción del bien vacía", () => {
            expect(() => new Assets("Nombre", "", ["Material 1"], 10, 10)).toThrowError("El descripción no puede estar vacía.");
        });
    
        test("Lista de materiales del bien vacía", () => {
            expect(() => new Assets("Nombre", "Descripción", [], 10, 10)).toThrowError("La lista de materiales no puede estar vacía.");
        });
    
        test("Peso del bien menor o igual a 0", () => {
            expect(() => new Assets("Nombre", "Descripción", ["Material 1"], -10, 10)).toThrowError("El peso del bien ha de ser mayor que 0.");
        });
    
        test("Precio en coronas del bien negativo", () => {
            expect(() => new Assets("", "Descripción", ["Material 1"], 10, -10)).toThrowError("El número de coronas no puede ser negativos.");
        });
    });

    describe("Pruebas de getters", () => {
        test("Getter de name", () => {
            expect(MyAssets.asset1.name).toStrictEqual("Mediadora");
        });

        test("Getter de description", () => {
            expect(MyAssets.asset1.description).toStrictEqual("Espada");
        });

        test("Getter de materials", () => {
            expect(MyAssets.asset1.materials).toStrictEqual(["Cuero", "Acero", "Amatista"]);
        });

        test("Getter de weight", () => {
            expect(MyAssets.asset1.weight).toStrictEqual(9);
        });

        test("Getter de crowns", () => {
            expect(MyAssets.asset1.crowns).toStrictEqual(700);
        });
    });

    describe("Pruebas de setters", () => {
        test("Setter de name", () => {
            MyAssets.asset1.name = "Espada";
            expect(MyAssets.asset1.name).toStrictEqual("Espada");
        });

        test("Setter de description", () => {
            MyAssets.asset1.description = "Descripción";
            expect(MyAssets.asset1.description).toStrictEqual("Descripción");
        });

        test("Setter de materials", () => {
            MyAssets.asset1.materials = ["Acero"];
            expect(MyAssets.asset1.materials).toStrictEqual(["Acero"]);
        });

        test("Setter de weight", () => {
            MyAssets.asset1.weight = 10;
            expect(MyAssets.asset1.weight).toStrictEqual(10);
        });

        test("Setter de crowns", () => {
            MyAssets.asset1.crowns = 800;
            expect(MyAssets.asset1.crowns).toStrictEqual(800);
        });
    });
});
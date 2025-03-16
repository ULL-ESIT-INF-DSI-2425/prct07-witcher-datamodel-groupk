import { describe, test, expect } from "vitest"
import { Assets } from "../src/items/asset.js";

describe("Pruebas de Assets", () => {
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
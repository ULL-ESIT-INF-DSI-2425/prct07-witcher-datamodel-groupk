import { describe, test, expect } from "vitest"
import { Assets, Merchant, Clients, Type, Race } from "../src/main"
import { Type } from "typedoc";

describe("Pruebas de Assets", () => {
    test("", () => {
        expect(() => new Assets(1, "", "Descripción", ["Material 1"], 10, 10)).toThrowError("El nombre no puede estar vacío.");
    });

    test("", () => {
        expect(() => new Assets(1, "Nombre", "", ["Material 1"], 10, 10)).toThrowError("El descripción no puede estar vacía.");
    });

    test("", () => {
        expect(() => new Assets(1, "Nombre", "", [], 10, 10)).toThrowError("La lista de materiales no puede estar vacía.");
    });

    test("", () => {
        expect(() => new Assets(1, "Nombre", "Descripción", ["Material 1"], -10, 10)).toThrowError("El peso del bien ha de ser mayor que 0.");
    });

    test("", () => {
        expect(() => new Assets(1, "", "Descripción", ["Material 1"], 10, -10)).toThrowError("El número de coronas no puede ser negativos.");
    });
});

describe("Pruebas de Person", () => {
    test("", () => {
        expect(() => new Merchant(1, "", "Localización", Type.General)).toThrowError("El nombre no puede estar vacío.");
    });

    test("", () => {
        expect(() => new Clients(1, "Nombre", "", Race.Elf)).toThrowError("El nombre de la localización no puede estar vacío.");
    });
});


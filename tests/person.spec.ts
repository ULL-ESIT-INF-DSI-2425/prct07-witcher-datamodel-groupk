import { describe, test, expect } from "vitest"
import { Merchant } from "../src/characters/merchant.js";
import { Clients } from "../src/characters/client.js";
import * as Enums from "../src/enums/types-and-races.js";

describe("Pruebas de Person", () => {
    test("Nombre vacío", () => {
        expect(() => new Merchant("", "Localización", Enums.Type.General)).toThrowError("El nombre no puede estar vacío.");
    });

    test("Nombre de la localización vacío", () => {
        expect(() => new Clients("Nombre", "", Enums.Race.Elf)).toThrowError("El nombre de la localización no puede estar vacío.");
    });
});
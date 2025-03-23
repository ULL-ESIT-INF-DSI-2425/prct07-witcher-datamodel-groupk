import { describe, test, expect } from "vitest";
import { Clients } from "../src/characters/client.js";
import * as Enums from "../src/enums/types-and-races.js";
import * as MyClients from "../src/database/clients.js";

describe("Pruebas de Clients", () => {
    describe("Pruebas del constructor", () => {
        test("Nombre vacío", () => {
            expect(() => new Clients("", "Localización", Enums.Race.Wizard)).toThrowError("El nombre no puede estar vacío.");
        });
    
        test("Nombre de la localización vacío", () => {
            expect(() => new Clients("Nombre", "", Enums.Race.Elf)).toThrowError("El nombre de la localización no puede estar vacío.");
        });
    });

    describe("Pruebas de los getter", () => {
        test("Getter de name", () => {
            expect(MyClients.client1.name).toStrictEqual("Vesemir");
        });

        test("Getter de location", () => {
            expect(MyClients.client1.location).toStrictEqual("Drakenborg");
        });

        test("Getter de race", () => {
            expect(MyClients.client1.race).toStrictEqual(Enums.Race.Human);
        });
    });

    describe("Pruebas de los setter", () => {
        test("Setter de name fallido", () => {
            expect(() => MyClients.client1.name = "").toThrowError("El nombre no puede estar vacío.");
        });

        test("Setter de name", () => {
            MyClients.client1.name = "Nombre";
            expect(MyClients.client1.name).toStrictEqual("Nombre");
        });

        test("Setter de location fallido", () => {
            expect(() => MyClients.client1.location = "").toThrowError("El nombre de la localización no puede estar vacío.");
        });

        test("Setter de location", () => {
            MyClients.client1.location = "Localización";
            expect(MyClients.client1.location).toStrictEqual("Localización");
        });

        test("Setter de race", () => {
            MyClients.client1.race = Enums.Race.Elf;
            expect(MyClients.client1.race).toStrictEqual(Enums.Race.Elf);
        });
    });
});
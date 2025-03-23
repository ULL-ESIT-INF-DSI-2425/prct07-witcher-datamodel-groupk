import { describe, test, expect } from "vitest";
import { ClientsManager } from "../src/managers/client_manager.js";
import * as MyClients from "../src/database/clients.js";
import { Race } from "../src/enums/types-and-races.js";

const clients: ClientsManager = new ClientsManager([MyClients.client1, MyClients.client2, MyClients.client3]);

describe("Pruebas de AssetManager", () => {
    describe("Pruebas de searchByName", () => {
        test("Prueba 1", () => {
            expect(clients.searchByName("Vesemir")).toStrictEqual([MyClients.client1]);
        });

        test("Prueba 2", () => {
            expect(clients.searchByName("Cahir")).toStrictEqual([MyClients.client2]);
        });

        test("Prueba 3", () => {
            expect(clients.searchByName("Calanthe")).toStrictEqual([MyClients.client3]);
        });

        test("Prueba 4", () => {
            expect(clients.searchByName("AAA")).toStrictEqual([]);
        });
    });

    describe("Pruebas de searchByLocation", () => {
        test("Prueba 1", () => {
            expect(clients.searchByLocation("Drakenborg")).toStrictEqual([MyClients.client1]);
        });

        test("Prueba 2", () => {
            expect(clients.searchByLocation("Pont Vanis")).toStrictEqual([MyClients.client2]);
        });

        test("Prueba 3", () => {
            expect(clients.searchByLocation("Novigrad")).toStrictEqual([MyClients.client3]);
        });

        test("Prueba 4", () => {
            expect(clients.searchByLocation("AAA")).toStrictEqual([]);
        });
    });

    describe("Pruebas de searchByRace", () => {
        test("Prueba 1", () => {
            expect(clients.searchByRace(Race.Human)).toStrictEqual([MyClients.client1, MyClients.client2]);
        });

        test("Prueba 2", () => {
            expect(clients.searchByRace(Race.Elf)).toStrictEqual([MyClients.client3]);
        });

        test("Prueba 3", () => {
            expect(clients.searchByRace(Race.Dwarf)).toStrictEqual([]);
        });
    });
});
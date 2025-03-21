import { describe, test, expect } from "vitest"
import { SellTransaction } from "../src/transactions/sellTransation";
import { Date } from "../src/utils/date";
import * as MyAssets from "../src/database/assets";
import * as MyClients from "../src/database/clients";

const transaction1: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [2], MyClients.client1);
const transaction2: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset1, MyAssets.asset2], [2, 3], MyClients.client2);

describe("Pruebas de BuyTransaction", () => {
    test("Bienes y cantidad con número de elementos diferentes", () => {
        expect(() => new SellTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [1, 2], MyClients.client1)).toThrowError("Cada bien tiene que tener especificada una cantidad específica.");
    });
    
    test("Transacción sin bienes", () => {
        expect(() => new SellTransaction(new Date(10, 10, 2025), [], [], MyClients.client1)).toThrowError("La transacción debe de tener al menos un bien.");
    });
    
    test("Getter de date", () => {
        expect(transaction1.date).toStrictEqual(new Date(10, 10, 2025));
    });

    test("Getter de assets 1", () => {
        expect(transaction1.getExchangeAssets()).toStrictEqual([[MyAssets.asset1, 2]]);
    });

    test("Getter de assets 2", () => {
        expect(transaction2.getExchangeAssets()).toStrictEqual([[MyAssets.asset1, 2], [MyAssets.asset2, 3]]);
    });

    test("Getter de merchant", () => {
        expect(transaction1.client).toStrictEqual(MyClients.client1);
    });

    test("Getter de crowns y prueba del cálculo del atributo 1", () => {
        expect(transaction1.crowns).toStrictEqual(1680);
    });

    test("Getter de crowns y prueba del cálculo del atributo 2", () => {
        expect(transaction2.crowns).toStrictEqual(4560);
    });
});
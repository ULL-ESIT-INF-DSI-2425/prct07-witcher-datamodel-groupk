import { describe, test, expect } from "vitest"
import { SellTransaction } from "../src/transactions/sellTransation";
import { Date } from "../src/utils/date";
import * as MyAssets from "../src/database/assets";
import * as MyClients from "../src/database/clients";

const transaction1: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [[MyAssets.asset1, 2]], MyClients.client1);
const transaction2: SellTransaction = new SellTransaction(new Date(10, 10, 2025), [[MyAssets.asset1, 2], [MyAssets.asset2, 3]], MyClients.client2);

describe("Pruebas de BuyTransaction", () => {
    test("Getter de date", () => {
        expect(transaction1.date).toStrictEqual(new Date(10, 10, 2025));
    });

    test("Getter de assets", () => {
        expect(transaction1.exchangeAssets).toStrictEqual([[MyAssets.asset1, 2]]);
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
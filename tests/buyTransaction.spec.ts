import { describe, test, expect } from "vitest"
import { BuyTransaction } from "../src/transactions/buyTransaction";
import { Date } from "../src/utils/date";
import * as MyAssets from "../src/database/assets";
import * as MyMerchants from "../src/database/merchants";

const transaction1: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [[MyAssets.asset1, 2]], MyMerchants.merchant1);
const transaction2: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [[MyAssets.asset1, 2], [MyAssets.asset2, 3]], MyMerchants.merchant1);

describe("Pruebas de BuyTransaction", () => {
    test("Getter de date", () => {
        expect(transaction1.date).toStrictEqual(new Date(10, 10, 2025));
    });

    test("Getter de assets", () => {
        expect(transaction1.exchangeAssets).toStrictEqual([[MyAssets.asset1, 2]]);
    });

    test("Getter de merchant", () => {
        expect(transaction1.merchant).toStrictEqual(MyMerchants.merchant1);
    });

    test("Getter de crowns y prueba del cálculo del atributo 1", () => {
        expect(transaction1.crowns).toStrictEqual(1400);
    });

    test("Getter de crowns y prueba del cálculo del atributo 2", () => {
        expect(transaction2.crowns).toStrictEqual(3800);
    });
});
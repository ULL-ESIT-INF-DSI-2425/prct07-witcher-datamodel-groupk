import { describe, test, expect } from "vitest"
import { BuyTransaction } from "../src/transactions/buyTransaction";
import { Date } from "../src/utils/date";
import * as MyAssets from "../src/database/assets";
import * as MyMerchants from "../src/database/merchants";

const transaction1: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [2], MyMerchants.merchant1);
const transaction2: BuyTransaction = new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset1, MyAssets.asset2], [2, 3], MyMerchants.merchant1);

describe("Pruebas de BuyTransaction", () => {
    test("Bienes y cantidad con número de elementos diferentes", () => {
        expect(() => new BuyTransaction(new Date(10, 10, 2025), [MyAssets.asset1], [1, 2], MyMerchants.merchant1)).toThrowError("Cada bien tiene que tener especificada una cantidad específica.");
    });

    test("Transacción sin bienes", () => {
        expect(() => new BuyTransaction(new Date(10, 10, 2025), [], [], MyMerchants.merchant1)).toThrowError("La transacción debe de tener al menos un bien.");
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
        expect(transaction1.merchant).toStrictEqual(MyMerchants.merchant1);
    });

    test("Getter de crowns y prueba del cálculo del atributo 1", () => {
        expect(transaction1.crowns).toStrictEqual(1400);
    });

    test("Getter de crowns y prueba del cálculo del atributo 2", () => {
        expect(transaction2.crowns).toStrictEqual(3800);
    });
});
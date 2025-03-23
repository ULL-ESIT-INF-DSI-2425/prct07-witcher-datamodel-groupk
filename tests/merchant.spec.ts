import { describe, test, expect } from "vitest";
import { Merchant } from "../src/characters/merchant.js";
import * as Enums from "../src/enums/types-and-races.js";
import * as MyMerchants from "../src/database/merchants.js";

describe("Pruebas de Merchant", () => {
    describe("Pruebas del constructor", () => {
        test("Nombre vacío", () => {
            expect(() => new Merchant("", "Localización", Enums.Type.General)).toThrowError("El nombre no puede estar vacío.");
        });
    
        test("Nombre de la localización vacío", () => {
            expect(() => new Merchant("Nombre", "", Enums.Type.General)).toThrowError("El nombre de la localización no puede estar vacío.");
        });
    });

    describe("Pruebas de los getter", () => {
            test("Getter de name", () => {
                expect(MyMerchants.merchant1.name).toStrictEqual("Chet");
            });
    
            test("Getter de location", () => {
                expect(MyMerchants.merchant1.location).toStrictEqual("Beauclair");
            });
    
            test("Getter de type", () => {
                expect(MyMerchants.merchant1.type).toStrictEqual(Enums.Type.General);
            });
        });
    
        describe("Pruebas de los setter", () => {
            test("Setter de name fallido", () => {
                expect(() => MyMerchants.merchant1.name = "").toThrowError("El nombre no puede estar vacío.");
            });
            
            test("Setter de name", () => {
                MyMerchants.merchant1.name = "Nombre";
                expect(MyMerchants.merchant1.name).toStrictEqual("Nombre");
            });

            test("Setter de location fallido", () => {
                ;
                expect(() => MyMerchants.merchant1.location = "").toThrowError("El nombre de la localización no puede estar vacío.");
            });
    
            test("Setter de location", () => {
                MyMerchants.merchant1.location = "Localización";
                expect(MyMerchants.merchant1.location).toStrictEqual("Localización");
            });
    
            test("Setter de type", () => {
                MyMerchants.merchant1.type = Enums.Type.Blacksmith;
                expect(MyMerchants.merchant1.type).toStrictEqual(Enums.Type.Blacksmith);
            });
        });
});
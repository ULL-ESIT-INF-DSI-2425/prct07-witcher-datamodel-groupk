import { describe, test, expect } from "vitest"
import { Assets, Merchant, Clients, Type, Race, Date } from "../src/main"

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

describe("Pruebas de Person", () => {
    test("Nombre vacío", () => {
        expect(() => new Merchant("", "Localización", Type.General)).toThrowError("El nombre no puede estar vacío.");
    });

    test("Nombre de la localización vacío", () => {
        expect(() => new Clients("Nombre", "", Race.Elf)).toThrowError("El nombre de la localización no puede estar vacío.");
    });
});


describe("Pruebas de Date", () => {
    describe("Pruebas respecto al atributo day", () => {
        test("Día 0 o negativo", () => {
            expect(() => new Date(0, 1, 2025)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Día mayor que 31 en enero, marzo, mayo, julio, agosto, octubre y diciembre", () => {
            expect(() => new Date(32, 1, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 3, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 5, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 7, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 8, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 10, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(32, 12, 2025)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Día mayor que 30 en abril, junio, septiembre y noviembre", () => {
            expect(() => new Date(31, 4, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(31, 6, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(31, 9, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(31, 11, 2025)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Día mayor que 28 en febrero no bisiesto", () => {
            expect(() => new Date(29, 2, 2025)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(29, 2, 1900)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Día mayor que 29 en febrero bisiesto", () => {
            expect(() => new Date(30, 2, 2024)).toThrowError("Formato de fecha incorrecto.");
            expect(() => new Date(30, 2, 2000)).toThrowError("Formato de fecha incorrecto.");
        });
    });

    describe("Pruebas de month y year", () => {
        test("Mes inferior a 1", () => {
            expect(() => new Date(1, 0, 2025)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Mes mayor que 12", () => {
            expect(() => new Date(1, 13, 2025)).toThrowError("Formato de fecha incorrecto.");
        });

        test("Año inferior a 1", () => {
            expect(() => new Date(1, 0, 0)).toThrowError("Formato de fecha incorrecto.");
        });
    });
});
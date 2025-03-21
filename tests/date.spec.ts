import { describe, test, expect } from "vitest"
import { Date } from "../src/utils/date.js";

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

    const date1: Date = new Date(10, 10, 2025);
    const date2: Date = new Date(8, 10, 2025);
    const date3: Date = new Date(21, 7, 2025);
    const date4: Date = new Date(15, 2, 2023);

    describe("Pruebas de getDate", () => {
        test("10/10/2025", () => {
            expect(date1.getDate()).toStrictEqual("10/10/2025");
        });

        test("8/10/2025", () => {
            expect(date2.getDate()).toStrictEqual("8/10/2025");
        });

        test("21/7/2025", () => {
            expect(date3.getDate()).toStrictEqual("21/7/2025");
        });

        test("15/2/2023", () => {
            expect(date4.getDate()).toStrictEqual("15/2/2023");
        });
    });

    describe("Pruebas de isLowerOrEqualThan", () => {
        test("10/10/2025 > 8/10/2025", () => {
            expect(date1.isLowerOrEqualThan(date2)).toStrictEqual(false);
        });

        test("8/10/2025 > 21/7/2025", () => {
            expect(date2.isLowerOrEqualThan(date3)).toStrictEqual(false);
        });

        test("21/7/2025 <= 10/10/2025", () => {
            expect(date3.isLowerOrEqualThan(date1)).toStrictEqual(true);
        });

        test("15/2/2023 <= 8/10/2025", () => {
            expect(date4.isLowerOrEqualThan(date2)).toStrictEqual(true);
        });
    });
});
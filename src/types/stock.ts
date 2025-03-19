import { Assets } from "../items/asset.js";

/**
 * Tipo Stock. Representa una tupla que almacena un bien y el número del mismo que hay en stock
 */
export type Stock = [Assets, number];
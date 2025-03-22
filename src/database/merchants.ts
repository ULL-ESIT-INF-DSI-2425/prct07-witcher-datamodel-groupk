import { Merchant } from "../characters/merchant.js";
import { Type } from "../enums/types-and-races.js";

export const merchant1: Merchant = new Merchant("Chet", "Beauclair", Type.General);
export const merchant2: Merchant = new Merchant("Millie", "Vengerberg", Type.General);
export const merchant3: Merchant = new Merchant("Mislav", "Ard Carraigh", Type.Alchemist);
export const merchant4: Merchant = new Merchant("Napp", "Lan Exeter", Type.Blacksmith);
export const merchant5: Merchant = new Merchant("Oswin", "Flotsam", Type.General);

export const merchant6: Merchant = new Merchant("Elsa", "Thanedd", Type.Alchemist);
export const merchant7: Merchant = new Merchant("Eskel", "Visima", Type.Alchemist);
export const merchant8: Merchant = new Merchant("Rhosyn", "Beauclair", Type.Blacksmith);
export const merchant9: Merchant = new Merchant("Fringilla", "Flotsam", Type.Blacksmith);
export const merchant10: Merchant = new Merchant("Salma", "Kaer Trolde", Type.General);

export const merchants = [
    merchant1, merchant2, merchant3, merchant4, merchant5,
    merchant6, merchant7, merchant8, merchant9, merchant10
];
import { Clients } from "../characters/client.js";
import { Race } from "../enums/types-and-races.js";

export const client1: Clients = new Clients("Vesemir", "Drakenborg", Race.Human);
export const client2: Clients = new Clients("Cahir", "Pont Vanis", Race.Human);
export const client3: Clients = new Clients("Calanthe", "Novigrad", Race.Elf);
export const client4: Clients = new Clients("Jaskier", "Cintra", Race.Dwarf);
export const client5: Clients = new Clients("Keira", "Kaer Trolde", Race.Human);

export const client6: Clients = new Clients("Agneta", "Novigrad", Race.Wizard);
export const client7: Clients = new Clients("Liesje", "Strept", Race.Dwarf);
export const client8: Clients = new Clients("Lessy", "Drakenborg", Race.Dwarf);
export const client9: Clients = new Clients("Bolko", "Thanned", Race.Wizard);
export const client10: Clients = new Clients("Mikah", "Attre", Race.Elf);

export const clients = [
    client1, client2, client3, client4, client5, client6, client7, client8, client9, client10 
];
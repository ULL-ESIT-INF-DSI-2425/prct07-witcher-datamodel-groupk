import inquirer from "inquirer";

/**
 * Interfaz Identifiable. Concreta los atributos mínimos que ha de tener una clase para ser identificable
 */
export interface Identifiable {
  id: number;
  name: string;
}

/**
 * Clase Assets. Representa un bien
 */
export class Assets implements Identifiable {

  /**
   * Constructor de Assets
   * @param id - ID único del bien
   * @param name - Nombre del bien
   * @param description - Descripción del bien
   * @param materials - Materiales del bien
   * @param weight - Peso del bien
   * @param crowns - Valor en coronas del bien
   */
  constructor(
    private readonly id: number, 
    private readonly name: string, 
    private readonly description: string, 
    private readonly materials: string[],
    private readonly weight: number,
    private readonly crowns: number
  ) {
    if (weight <= 0) {
      throw new Error("El peso del bien ha de ser mayor que 0.");
    } else if (crowns < 0) {
      throw new Error("El número de coronas no puede ser negativos.");
    } else if (name === "") {
      throw new Error("El nombre no puede estar vacío.");
    } else if (description === "") {
      throw new Error("El descripción no puede estar vacía.");
    } else if (materials.length === 0) {
      throw new Error("La lista de materiales no puede estar vacía.");
    }
  }
}

/**
 * Enumerable Type. Representa los diferentes tipos de mercaderes
 */
export enum Type { 
    Blacksmith,
    Alchemist,
    General 
}

/**
 * Enumerable Race. Representa las diferentes razas de los habitantes del mundo
 */
export enum Race { 
    Human, 
    Elf, 
    Dwarf, 
    Wizard
}

/**
 * Clase abstracta Person. Describe los atributos mínimos que ha de tener una perrsona.
 */
export abstract class Person implements Identifiable {

  /**
   * Costructor de Person
   * @param id - ID único de la persona
   * @param name - Nombre de la persona
   * @param location - Ubicación de la persona
   */
  constructor(
    protected readonly id: number, 
    protected readonly name: string, 
    protected readonly location: string) 
    {
      if (name === "") {
       throw new Error("El nombre no puede estar vacío.");
      } else if (location === "") {
       throw new Error("El nombre de la localización no puede estar vacío.");
      }
    }
}

/**
 * Clase Merchant. Representa a un mercader
 */
export class Merchant extends Person {

  /**
   * Constructor de Merchant
   * @param id - ID único del mercader
   * @param name - Nombre del mercader
   * @param location - Ubicación del mercader
   * @param _tipo - Tipo del mercader
   */
  constructor(id: number, 
    name: string, 
    location: string, 
    private readonly _tipo: Type) 
    {
      super(id, name, location);
    }
}

/**
 * Clase Clients. Representa a un cliente
 */
export class Clients extends Person {
  
  /**
   * 
   * @param id - ID único del cliente
   * @param name - Nombre del cliente
   * @param location - Ubicación del cliente
   * @param race - Raza del cliente
   */
  constructor(
    id: number, 
    name: string, 
    location: string, 
    private readonly race: Race
  ) {
    super(id, name, location);
  }
}

/**
 * Tipo Stock. Representa una tupla que almacena un bien y el número del mismo que hay en stock
 */
type Stock = [Assets, number];

/**
 * Clase Inventary. Representa un inventario compuesto de bienes, mercaderes y clientes
 */
export class Inventary {

  /**
   * Constructor de Inventary
   * @param bienes_list - Lista de bienes
   * @param merchant_list - Lista de mercaderes
   * @param client_list - Lista de clientes
   */
  constructor(
    private readonly bienes_list: Stock[], 
    private readonly merchant_list: Merchant[], 
    private readonly client_list : Clients[] ) {}
  
  /**
   * Añade al inventario un bien
   * @param asset - Bien a añadir
   */
  addAssets(stock: Stock): void {
    if (this.bienes_list.some((asset) => asset[0] === stock[0])) {
      const index: number = this.bienes_list.findIndex((asset) => asset[0] === stock[0]);
      this.bienes_list[index][1] += stock[1];
    } else {
      this.bienes_list.push(stock);
    }
  }

  /**
   * Añade a un mercader
   * @param merchant - Mercader a añadir
   */
  addMerchant(merchant: Merchant): void {
    this.merchant_list.push(merchant);
  }

  /**
   * Añade a un cliente
   * @param client - Cliente a añadir
   */
  addClient(client: Clients): void {
    this.client_list.push(client);
  }
  
  /**
   * Elimina un bien del inventario
   * @param asset - Bien a eliminar
   */
  removeAsset(asset: Assets): void {
    this.bienes_list.forEach((element, index) => {
      if (element[0] === asset && element[1] > 1 ) this.bienes_list[index][1]--;
      else if (element[0] === asset)this.bienes_list.filter(element => element[0] !== asset);
      else throw new Error('No se ha encontrado el bien especificado');
    })
  }

  /**
   * Elimina a un mercader
   * @param merchant - Mercader a eliminar
   */
  removeMerchant(merchant: Merchant): void {
    this.merchant_list.filter(element => element !== merchant);
  }
  
  /**
   * Elimina a un cliente
   * @param client - Cliente a eliminar
   */
  removeClient(client: Clients): void {
    this.client_list.filter(element => element !== client);
  }

  getAssets(pred: (asset: Stock) => boolean): string {
    const assets: Stock[] = this.bienes_list.filter(pred);

    
  }
}

/**
 * Clase Date. Representa a una fecha
 */
class Date {

  /**
   * Constructor de Date
   * @param day - Día
   * @param month - Mes
   * @param year - Año
   */
  constructor(
    private readonly day: number, 
    private readonly month: number, 
    private readonly year: number) {
  }

  /**
   * Crea una cadena que representa a una fecha en el formato DD/MM/AAAA
   * @returns String de forma DD/MM/AAAA
   */
  getDate(): string {
    return `${this.day}/${this.month}/${this.year}`;
  }
}

enum TransactionType {
  Selling = "Selling",
  Sale = "Sale",
  Devolution = "Devolution"
}

class Transaction {
  constructor(
    private readonly date: Date, 
    private readonly exchange_asset: Assets[], 
    private readonly crowns: number, 
    private readonly type: TransactionType) {}
  
}
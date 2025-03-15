
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

  public readonly id: number;
  private static _idCount: number = 1; 

  /**
   * Constructor de Assets
   * @param name - Nombre del bien
   * @param _description - Descripción del bien
   * @param _materials - Materiales del bien
   * @param _weight - Peso del bien
   * @param _crowns - Valor en coronas del bien
   */
  constructor(
    public name: string, 
    private _description: string, 
    private _materials: string[],
    private _weight: number,
    private _crowns: number
  ) {
    if (_weight <= 0) {
      throw new Error("El peso del bien ha de ser mayor que 0.");
    } else if (_crowns < 0) {
      throw new Error("El número de coronas no puede ser negativos.");
    } else if (name === "") {
      throw new Error("El nombre no puede estar vacío.");
    } else if (_description === "") {
      throw new Error("El descripción no puede estar vacía.");
    } else if (_materials.length === 0) {
      throw new Error("La lista de materiales no puede estar vacía.");
    }

    this.id = Assets._idCount;
    Assets._idCount++;
  }

  /**
   * Getter de description
   */
  get description() {
    return this._description;
  }

  /**
   * Setter de description
   */
  set description(desc: string) {
    this._description = desc;
  }

  /**
   * Getter de materials
   */
  get materials() {
    return this._materials;
  }

  /**
   * Setter de materials
   */
  set materials(mats: string[]) {
    this._materials = mats;
  }

  /**
   * Getter de weight
   */
  get weight() {
    return this._weight;
  }

  /**
   * Setter de weight
   */
  set weight(weight: number) {
    this._weight = weight;
  }

  /**
   * Getter de crowns
   */
  get crowns() {
    return this._crowns;
  }

  /**
   * Setter de crowns
   */
  set crowns(crowns: number) {
    this._crowns = crowns;
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

  public readonly id: number;
  private static _idCount: number = 1;

  /**
   * Costructor de Person
   * @param name - Nombre de la persona
   * @param _location - Ubicación de la persona
   */
  constructor(
    public name: string, 
    protected _location: string) 
    {
      if (name === "") {
       throw new Error("El nombre no puede estar vacío.");
      } else if (_location === "") {
       throw new Error("El nombre de la localización no puede estar vacío.");
      }

      this.id = Person._idCount;
      Person._idCount++;
    }

    /**
     * Getter de location
     */
    get location() {
      return this._location;
    }

    /**
     * Setter de location
     */
    set location(local: string) {
      this._location = local;
    }
}

/**
 * Clase Merchant. Representa a un mercader
 */
export class Merchant extends Person {

  /**
   * Constructor de Merchant
   * @param name - Nombre del mercader
   * @param location - Ubicación del mercader
   * @param _type - Tipo del mercader
   */
  constructor(
    name: string, 
    location: string, 
    private _type: Type) 
    {
      super(name, location);
    }

  /**
   * Getter de type
   */
  get type() {
    return this._type
  }

  /**
   * Setter de type
   */
  set type(type: Type) {
    this._type = type;
  }
}

/**
 * Clase Clients. Representa a un cliente
 */
export class Clients extends Person {
  
  /**
   * Constructor de Clients
   * @param name - Nombre del cliente
   * @param location - Ubicación del cliente
   * @param _race - Raza del cliente
   */
  constructor(
    name: string, 
    location: string, 
    private _race: Race
  ) {
    super(name, location);
  }

  /**
   * Getter de race
   */
  get race() {
    return this._race;
  }

  /**
   * Setter de race
   */
  set race(race: Race) {
    this._race = race;
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
}

/**
 * Clase Date. Representa a una fecha
 */
export class Date {

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
      if (day < 1 || month < 1 || month > 12 || year < 1 || 
          (month === 2 && ((year % 4 === 0 && (year % 100 !== 0 || year % 400) && day > 29) || day > 28)) ||
          ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) || (day > 31)) {
            throw new Error("Formato de fecha incorrecto.");
      }
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
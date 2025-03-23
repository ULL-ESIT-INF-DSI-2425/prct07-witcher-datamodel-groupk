import { AssetJSON } from "../interfaces/interfaces_json.js";

/**
 * Clase Assets. Representa un bien
 */
export class Assets {

  private _id: number; // ID único del bien
  private static _idCount: number = 1; // Cuenta de IDs que se van asignando cada vez que se crea un nuevo objeto

  /**
   * Constructor de Assets
   * @param _name - Nombre del bien
   * @param _description - Descripción del bien
   * @param _materials - Materiales del bien
   * @param _weight - Peso del bien
   * @param _crowns - Valor en coronas del bien
   */
  constructor(
    private _name: string, 
    private _description: string, 
    private _materials: string[],
    private _weight: number,
    private _crowns: number
  ) {
    if (_weight <= 0) {
      throw new Error("El peso del bien ha de ser mayor que 0.");
    } else if (_crowns < 0) {
      throw new Error("El número de coronas no puede ser negativos.");
    } else if (_name === "") {
      throw new Error("El nombre no puede estar vacío.");
    } else if (_description === "") {
      throw new Error("El descripción no puede estar vacía.");
    } else if (_materials.length === 0) {
      throw new Error("La lista de materiales no puede estar vacía.");
    }

    this._id = Assets._idCount;
    Assets._idCount++;
  }

  /**
   * Getter de id
   */
  get id() {
    return this._id;
  }

  /**
   * Setter de id
   * @param id - Nuevo ID
   */
  setId(id: number): void {
    this._id = id;
  }

  /**
   * Getter de name
   */
  get name() {
    return this._name;
  }

  /**
   * Setter de name
   */
  set name(name: string) {
    this._name = name;
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

/**
 * Método estático para reconstruir un objeto Assets desde JSON.
 * @param json - Objeto con la estructura de AssetJSON
 * @returns Nueva instancia de Assets
 */
static fromJSON(json: AssetJSON): Assets {
  const a: Assets = new Assets(json._name, json._description, json._materials, json._weight, json._crowns);
    a.setId(json._id);
    
    return a;
}
}
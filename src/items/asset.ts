import { Identifiable } from "../interfaces/identifiable.js";

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
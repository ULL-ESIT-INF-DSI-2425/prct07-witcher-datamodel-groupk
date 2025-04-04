/**
 * Clase abstracta Person. Describe los atributos mínimos que ha de tener una perrsona.
 */
export abstract class Person {

    protected _id: number; // ID único de la persona
  
    /**
     * Costructor de Person
     * @param _name - Nombre de la persona
     * @param _location - Ubicación de la persona
     */
    constructor(
      protected _name: string, 
      protected _location: string) 
      {
        if (_name === "") {
         throw new Error("El nombre no puede estar vacío.");
        } else if (_location === "") {
         throw new Error("El nombre de la localización no puede estar vacío.");
        }
  
        this._id = 0;
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
        if (name === "") {
          throw new Error("El nombre no puede estar vacío.");
        }

        this._name = name;
      }

      /**
       * Getter de id
       */
      get id() {
        return this._id;
      }

      /**
       * Setter del ID
       * @param id - Nuevo ID
       */
      protected setId(id: number): void {
        this._id = id;
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
        if (local === "") {
          throw new Error("El nombre de la localización no puede estar vacío.");
         }

        this._location = local;
      }
  }
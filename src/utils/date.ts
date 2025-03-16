/**
 * Clase Date. Representa a una fecha
 */
export class Date {

    /**
     * Constructor de Date
     * @param _day - Día
     * @param _month - Mes
     * @param _year - Año
     */
    constructor(
      private _day: number, 
      private _month: number, 
      private _year: number) {
        if (_day < 1 || _month < 1 || _month > 12 || _year < 1 || 
            (_month === 2 && ((_year % 4 === 0 && (_year % 100 !== 0 || _year % 400) && _day > 29) || _day > 28)) ||
            ((_month === 4 || _month === 6 || _month === 9 || _month === 11) && _day > 30) || (_day > 31)) {
              throw new Error("Formato de fecha incorrecto.");
        }
    }
  
    /**
     * Crea una cadena que representa a una fecha en el formato DD/MM/AAAA
     * @returns String de forma DD/MM/AAAA
     */
    getDate(): string {
      return `${this._day}/${this._month}/${this._year}`;
    }
  }
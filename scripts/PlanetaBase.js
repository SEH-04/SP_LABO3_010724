export default class PlanetaBase {
  constructor(id, nombre, masa, tamano, tipo) {
    this.id = id;
    this.nombre = nombre;
    this.masa = +masa;
    this.tamano = +tamano;
    this.tipo = tipo;
  }

  verificar() {
    const tipoValid = ["rocoso", "gaseoso", "enano", "helado"];

    if (this.checkCadena(this.nombre)) {
      return {
        success: false,
        response: `El nombre es muy corto`,
      };
    }

    if (this.checkNum(this.masa)) {
      return {
        success: false,
        response: "Masa inválida",
      };
    }

    if (this.checkNum(this.tamano)) {
      return {
        success: false,
        response: "Tamaño inválido",
      };
    }

    if (!tipoValid.includes(this.tipo.toLowerCase())) {
      return {
        success: false,
        response: "Tipo inválido",
      };
    }

    return {
      success: true,
      response: null,
    };
  }

  checkCadena(cadena) {
    return cadena.length <= 3;
  }

  checkNum(num) {
    return isNaN(num) || num <= 0;
  }
}

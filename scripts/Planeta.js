import PlanetaBase from "./PlanetaBase.js";

export default class Planeta extends PlanetaBase {
  constructor(
    id,
    nombre,
    masa,
    tamano,
    tipo,
    distancia,
    vida,
    anillo,
    composicion
  ) {
    super(id, nombre, masa, tamano, tipo);

    this.distancia = +distancia;
    this.vida = vida;
    this.anillo = anillo;
    this.composicion = composicion;
  }

  verificar() {
    return true;
    const respuesta = super.verificar();

    if (!respuesta.success) {
      return respuesta;
    }

    const checkDistancia = super.checkNum(this.distancia);

    if (checkDistancia) {
      return {
        success: false,
        response: "Distancia inválida",
      };
    }

    if (this.checkBoolean(this.anillo)) {
      return {
        success: false,
        response: "Valor de anillo inválido",
      };
    }

    if (this.checkBoolean(this.vida)) {
      return {
        success: false,
        response: "Valor de vida inválido",
      };
    }

    if (super.checkCadena(this.composicion)) {
      return {
        success: false,
        response: "Composición inválida",
      };
    }

    return { success: true, response: null };
  }

  checkBoolean(value) {
    return typeof value !== "boolean";
  }
}

export default class Casa {
  constructor(id, titulo, precio, transaccion) {
    this.id = id;
    this.titulo = titulo;
    this.precio = +precio;
    this.transaccion = transaccion;
  }

  verificar() {
    const tituloCheck = this.checkTitulo();
    const precioCheck = this.checkPrecio();

    if (!tituloCheck.success) {
      return { success: false, response: tituloCheck.response };
    }

    if (!precioCheck.success) {
      return { success: false, response: precioCheck.response };
    }

    return { success: true, response: null };
  }

  checkPrecio() {
    if (this.precio < 0) {
      return { success: false, response: "El precio no puede ser negativo" };
    }

    return { success: true, response: null };
  }

  checkTitulo() {
    if (this.titulo.length < 4) {
      return { success: false, response: "El titulo es muy corto" };
    }

    return { success: true, response: null };
  }
}

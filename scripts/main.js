import Casa from "./Casa.js";
import { cargarDatos } from "./loader.js";
import * as API from "../utils/api.js";
import { crearTabla, renderizarTabla, idFilaSeleccionada } from "./tabla.js";
import { $DIALOG, $BTN_SUBMIT } from "./dialog.js";

const OBJETOS = [];

const $FORM = document.forms[0];
const $BTN_ELIMINAR = document.getElementById("btn-eliminar");
const $BTN_ELIMINAR_TODO = document.getElementById("btn-eliminar-todo");
const $BTN_MODIFICAR = document.getElementById("btn-modificar");

const $SELECT_TRANSACCION = document.getElementById("input-transaccion");

document.addEventListener("DOMContentLoaded", onInit);

function onInit(e) {
  handlerCargarObjetos(OBJETOS);
  handlerCargarTabla();

  $FORM.addEventListener("submit", handlerSubmit);
  $BTN_MODIFICAR.addEventListener("click", handlerModificar);
  $BTN_ELIMINAR.addEventListener("click", handlerEliminar);
  $BTN_ELIMINAR_TODO.addEventListener("click", handlerEliminarTodo);
  $SELECT_TRANSACCION.addEventListener("change", handlerPromedio);
}

async function handlerSubmit(e) {
  e.preventDefault();
  const form = e.target;

  switch ($BTN_SUBMIT.textContent) {
    case "Guardar":
      const MODEL = new Casa(
        Date.now(),
        ...Object.values(form)
          .filter((e) => e.type !== "hidden") //? Omite el input del id
          .map((e) => e.value)
      );

      alta(MODEL);
      break;

    case "Actualizar":
      const objetoSeleccionado = OBJETOS.find(
        (e) => e.id == idFilaSeleccionada
      );
      modificar(objetoSeleccionado, form);
      restablecerFormulario();
      $DIALOG.close();
      break;
  }
}

function handlerModificar(e) {
  try {
    if (!idFilaSeleccionada) {
      throw new Error("No se ha seleccionado un Item para modificar");
    }

    const $fila = document.querySelector(`tr[data-id="${idFilaSeleccionada}"]`);

    if ($fila) {
      $BTN_SUBMIT.textContent = "Actualizar";
      $DIALOG.showModal();
    }
  } catch (error) {
    alert(error);
  }
}

function handlerEliminar(e) {
  try {
    if (!idFilaSeleccionada) {
      throw new Error("No se ha seleccionado un Item para eliminar");
    }

    const $fila = document.querySelector(`tr[data-id="${idFilaSeleccionada}"]`);

    if ($fila && confirm("¿Desea eliminar el Item?")) {
      cargarDatos(async () => {
        const id = $fila.getAttribute("data-id");
        let elementos = OBJETOS.filter((p) => p.id != id);
        const model = OBJETOS.find((e) => e.id == id);
        await API.eliminar(model);
        handlerCargarTabla(elementos);
      });
    }
  } catch (error) {
    alert(error);
  }
}

function handlerEliminarTodo(e) {
  cargarDatos(async () => {
    if (confirm("¿Desea eliminar todos los Items?")) {
      await API.eliminarTodo();
      OBJETOS.length = 0;
      handlerCargarTabla();
    }
  });
}

function alta(model) {
  cargarDatos(() => {
    const respuesta = model.verificar();

    if (respuesta.success) {
      try {
        OBJETOS.push(model);
        API.agregar(model);
        restablecerFormulario();
        handlerCargarTabla();
        $DIALOG.close();
      } catch (error) {
        alert(error);
      }
    } else {
      alert(respuesta.response);
    }
  });
}

function modificar(model, form) {
  cargarDatos(async () => {
    const propiedades = Object.keys(model).filter((e) => e !== "id");
    propiedades.forEach((field) => {
      if (form[field]) {
        model[field] = form[field].value;
      }
    });

    const respuesta = model.verificar();

    if (respuesta.success) {
      try {
        await API.modificar(model);
        restablecerFormulario();
        handlerCargarTabla();
      } catch (error) {
        alert(error);
      }
    } else {
      alert(respuesta.response);
    }
  });
}

function handlerCargarObjetos(array) {
  cargarDatos(async () => {
    let objectosAPI = await API.seleccionarTodos();

    objectosAPI.map((obj) => {
      const model = new Casa(...Object.values(obj));
      array.push(model);
    });

    handlerCargarTabla(array);
  });
}

function restablecerFormulario() {
  $FORM.reset();
}

function handlerCargarTabla(datos = OBJETOS) {
  const tabla = crearTabla(datos);
  renderizarTabla(tabla, document.getElementById("tabla-container"));
}

function handlerPromedio(e) {
  const $PROMEDIO = document.getElementById("promedio");
  let value = e.target.value;
  let promedio = 0;

  OBJETOS.map(({ precio, transaccion }) => {
    if (value === transaccion) {
      promedio += precio;
    }
  });

  if (promedio === 0) {
    promedio = "N/A";
  } else {
    promedio = promedio / OBJETOS.filter((e) => e.transaccion === value).length;
  }

  $PROMEDIO.value = promedio;
}

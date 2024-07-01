import Planeta from "./Planeta.js";
import { cargarDatos } from "./loader.js";
import * as API from "../utils/api.js";
import { crearTabla, renderizarTabla, idFilaSeleccionada } from "./tabla.js";
import { $DIALOG, $BTN_SUBMIT } from "./dialog.js";

const OBJETOS = [];

const $FORM = document.forms[0];
const $BTN_ELIMINAR = document.getElementById("btn-eliminar");
const $BTN_ELIMINAR_TODO = document.getElementById("btn-eliminar-todo");
const $BTN_MODIFICAR = document.getElementById("btn-modificar");

const $SELECT_TIPO = document.getElementById("input-tipo");

document.addEventListener("DOMContentLoaded", onInit);

function onInit(e) {
  handlerCargarObjetos(OBJETOS);
  handlerCargarTabla();
  crearControles(OBJETOS);

  $FORM.addEventListener("submit", handlerSubmit);
  $BTN_MODIFICAR.addEventListener("click", handlerModificar);
  $BTN_ELIMINAR.addEventListener("click", handlerEliminar);
  $BTN_ELIMINAR_TODO.addEventListener("click", handlerEliminarTodo);
  $SELECT_TIPO.addEventListener("change", handlerPromedio);
}

async function handlerSubmit(e) {
  e.preventDefault();
  const form = e.target;

  switch ($BTN_SUBMIT.textContent) {
    case "Guardar":
      const MODEL = new Planeta(
        OBJETOS.length + 1,
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
  cargarDatos(async () => {
    const respuesta = model.verificar();

    if (respuesta.success) {
      $DIALOG.close();
      OBJETOS.push(model);

      try {
        await API.agregar(model);
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
      const model = new Planeta(...Object.values(obj));
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

  OBJETOS.map(({ distancia, tipo }) => {
    if (value === tipo) {
      promedio += distancia;
    }
  });

  if (promedio === 0) {
    promedio = "N/A";
  } else {
    promedio = promedio / OBJETOS.filter((e) => e.tipo === value).length;
  }

  $PROMEDIO.value = promedio;
}

function crearControles() {
  let $contenedor = document.getElementById("controles-container");

  Object.keys(new Planeta())
    .filter((p) => p !== "id")
    .map((propiedad) => {
      let $label = document.createElement("label");
      let $checkbox = document.createElement("input");

      $label.textContent = propiedad;
      $checkbox.type = "checkbox";
      $checkbox.checked = true;
      $checkbox.setAttribute("name", propiedad);
      $label.setAttribute("for", propiedad);

      $checkbox.addEventListener("change", handleFiltrarTabla);

      $contenedor.appendChild($label);
      $contenedor.appendChild($checkbox);
    });
}

function handleFiltrarTabla(e) {
  const $checkbox = e.target;
  const $columnas = document.querySelectorAll(`table thead tr th`);
  const $filas = document.querySelectorAll("table tbody tr");

  $columnas.forEach((c) => {
    if (c.textContent === $checkbox.name) {
      c.classList.toggle("hidden");
    }
  });

  $filas.forEach((f) => {
    let $td = f.querySelector(`td[data-key=${$checkbox.name}]`);
    $td.classList.toggle("hidden");
  });
}

export let idFilaSeleccionada = null;
let idFilaAnterior = null;

export function renderizarTabla($tabla, $contenedor) {
  while ($contenedor.hasChildNodes()) {
    $contenedor.removeChild($contenedor.firstChild);
  }
  $tabla && $contenedor.appendChild($tabla);
}

export function crearTabla(items) {
  const $TABLA = document.createElement("table");
  $TABLA.appendChild(crearThead(items[0]));
  $TABLA.appendChild(crearTbody(items));
  return $TABLA;
}

function crearThead(items) {
  const $THEAD = document.createElement("thead");
  const $TR = document.createElement("tr");

  for (const key in items) {
    if (key != "id") {
      const $CHECKBOX = document.createElement("input");
      const $TH = document.createElement("th");
      $CHECKBOX.type = "checkbox";
      $CHECKBOX.checked = true;
      $CHECKBOX.id = "is-visible";

      $TH.textContent = key;
      $TH.appendChild($CHECKBOX);
      $TR.appendChild($TH);
    }
  }

  $TR.addEventListener("change", handleCheckedChange);
  $THEAD.appendChild($TR);
  return $THEAD;
}

function crearTbody(items) {
  const $TBODY = document.createElement("tbody");
  items.forEach((e) => {
    const $TR = document.createElement("tr");
    for (const key in e) {
      if (key !== "id") {
        const $TD = document.createElement("td");
        $TD.textContent = e[key];
        $TD.setAttribute("data-key", key);
        $TR.appendChild($TD);
      } else {
        $TR.setAttribute("data-id", e[key]);
      }
    }

    $TR.addEventListener("click", handleRowClick);
    $TBODY.appendChild($TR);
  });
  return $TBODY;
}

function handleRowClick(event) {
  const $TR = event.currentTarget;
  idFilaSeleccionada = $TR.getAttribute("data-id");

  if (idFilaAnterior) {
    idFilaAnterior.style.backgroundColor = "";
  }

  $TR.style.backgroundColor = "#e8e8e8";
  idFilaAnterior = $TR;
}

function handleCheckedChange(e) {
  const $CHECKBOX = e.target;
  const $TBODY = document.querySelector("table tbody");
  const $filas = $TBODY.querySelectorAll("tr");
  const key = $CHECKBOX.parentElement.te;

  $filas.forEach(($fila) => {
    const $celda = $fila.querySelector(`td[data-key="${key}"]`);

    if ($celda) {
      $celda.style.opacity = $CHECKBOX.checked ? 1 : 0;
    }
  });
}

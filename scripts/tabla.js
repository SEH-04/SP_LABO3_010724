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
      const $TH = document.createElement("th");

      $TH.textContent = key;
      $TR.appendChild($TH);
    }
  }

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

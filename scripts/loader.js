export async function cargarDatos(action) {
  mostrarLoader();
  await action();
  ocultarLoader();
}

function mostrarLoader() {
  action(true);
}

function ocultarLoader() {
  action();
}

function action(visible = false) {
  const DISPLAY = visible ? "flex" : "none";
  document.getElementById("loader").style.display = DISPLAY;
}

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
  document.getElementById("loader").classList.toggle("invisible");
}

export const $DIALOG = document.querySelector("dialog");
export const $BTN_SUBMIT = document.querySelector("button[type='submit']");

const $BTN_AGREGAR = document.getElementById("btn-agregar");
const $BTN_CANCELAR = document.getElementById("btn-cancelar");

//? Muestra y oculta la venta de dialogo
$BTN_AGREGAR.addEventListener("click", () => {
  $BTN_SUBMIT.textContent = "Guardar";
  $DIALOG.showModal();
});

$BTN_CANCELAR.addEventListener("click", () => {
  $DIALOG.close();
});

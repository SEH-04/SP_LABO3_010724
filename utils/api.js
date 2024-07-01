const ENDPOINT = "http://localhost:3000";

export function seleccionarTodos() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("GET", `${ENDPOINT}/planetas`);
    xhr.send();
  });
}

export function agregar(model) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("POST", `${ENDPOINT}/planetas`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(model));
  });
}

export function modificar(model) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("PUT", `${ENDPOINT}/planetas/${model.id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(model));
  });
}

export function eliminar(model) {
  return new Promise((resolve, reject) => {
    fetch(`${ENDPOINT}/planetas/${model.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`ERR ${response.status} : ${response.statusText}`);
        }
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function eliminarTodo() {
  return new Promise((resolve, reject) => {
    fetch(`${ENDPOINT}/planetas`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`ERR ${response.status} : ${response.statusText}`);
        }

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

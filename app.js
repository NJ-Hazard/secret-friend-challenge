// Lista donde guardaremos los amigos
const amigos = [];
let sorteoRealizado = false;
let resultadoSorteoGlobal = {}; // Variable para almacenar el resultado del sorteo

// Función para agregar un amigo
function agregarAmigo() {
  const input = document.getElementById("amigo");
  const nombre = input.value.trim();
  if (nombre === "") {
    alert("Por favor, ingresa un nombre válido.");
    return;
  }
  amigos.push(nombre);
  mostrarLista();
  input.value = "";
}

// Función para mostrar la lista de amigos
function mostrarLista() {
  const lista = document.getElementById("listaAmigos");
  lista.innerHTML = "";
  amigos.forEach((amigo, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${amigo}`;
    lista.appendChild(li);
  });
}

// Función para sortear un amigo
function sortearAmigo() {
  if (amigos.length < 2) {
    alert("Necesitas al menos dos amigos para realizar el sorteo.");
    return;
  }
  if (sorteoRealizado) {
    alert("El sorteo ya se realizó. Limpia la lista para hacer uno nuevo.");
    return;
  }

  // Copia del array para el sorteo
  let participantes = [...amigos];
  let receptores = [...amigos];
  let resultadoSorteo = {};

  // Algoritmo de sorteo para asegurar que nadie se sortee a sí mismo y no haya duplicados
  try {
    participantes.forEach((participante) => {
      let receptorValido = false;
      let receptorAleatorio;
      // Intenta encontrar un receptor válido (que no sea el mismo participante)
      while (!receptorValido) {
        if (receptores.length === 1 && receptores[0] === participante) {
          // Si solo queda un receptor y es el mismo participante, resetea el sorteo
          throw new Error("Sorteo imposible, intentando de nuevo...");
        }

        const indiceAleatorio = Math.floor(Math.random() * receptores.length);
        receptorAleatorio = receptores[indiceAleatorio];

        if (participante !== receptorAleatorio) {
          resultadoSorteo[participante] = receptorAleatorio;
          // Elimina el receptor del array para que no pueda ser sorteado de nuevo
          receptores.splice(indiceAleatorio, 1);
          receptorValido = true;
        }
      }
    });

    resultadoSorteoGlobal = resultadoSorteo; // Almacenamos el resultado en la variable global
    mostrarResultadoSorteo(resultadoSorteo);
    sorteoRealizado = true;
  } catch (e) {
    // Si el sorteo falla, lo intentamos de nuevo llamando a la función recursivamente
    sortearAmigo();
    return;
  }
}

// Función para mostrar el resultado del sorteo
function mostrarResultadoSorteo(resultadoSorteo) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = ""; // Limpia el contenido anterior

  for (const [participante, sorteado] of Object.entries(resultadoSorteo)) {
    const li = document.createElement("li");
    // Puedes ajustar este mensaje para mostrar solo el resultado final, por ejemplo
    li.innerHTML = `🎉 ${participante} le regaló a: <strong>${sorteado}</strong> 🎉`;
    resultado.appendChild(li);
  }
}

// Función para limpiar la lista de amigos
function limpiarLista() {
  amigos.length = 0;
  sorteoRealizado = false;
  resultadoSorteoGlobal = {};
  const lista = document.getElementById("listaAmigos");
  const resultado = document.getElementById("resultado");
  if (lista) lista.innerHTML = "";
  if (resultado) resultado.innerHTML = "";
  alert("La lista ha sido limpiada correctamente.");
}

// Nueva función para cargar amigos desde un archivo
function cargarAmigosDesdeArchivo() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const contenido = event.target.result;
    const nombreArchivo = file.name.split(".").pop().toLowerCase();

    if (nombreArchivo === "txt" || nombreArchivo === "csv") {
      const nombres = contenido
        .split(/[\n,;]+/)
        .map((nombre) => nombre.trim())
        .filter((nombre) => nombre !== "");
      nombres.forEach((nombre) => {
        if (!amigos.includes(nombre)) {
          amigos.push(nombre);
        }
      });
      mostrarLista();
      alert(`Se cargaron ${nombres.length} nombres desde el archivo.`);
    } else if (nombreArchivo === "xlsx" || nombreArchivo === "xls") {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Suponemos que la primera columna contiene los nombres
      json.forEach((fila) => {
        const nombre = fila[0] ? String(fila[0]).trim() : null;
        if (nombre && !amigos.includes(nombre)) {
          amigos.push(nombre);
        }
      });

      mostrarLista();
      alert(`Se cargaron nombres desde el archivo de Excel.`);
    } else {
      alert("Formato de archivo no soportado.");
    }
  };

  if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

// Función para descargar el sorteo
function descargarSorteo() {
  if (!sorteoRealizado) {
    alert("Por favor, realiza el sorteo antes de descargar.");
    return;
  }

  const data = Object.entries(resultadoSorteoGlobal).map(
    ([participante, sorteado]) => [participante, sorteado]
  );

  // Puedes elegir entre descargar como .txt o .xlsx
  // Aquí te muestro el código para ambos, puedes comentar el que no quieras.

  // Opción 1: Descargar como archivo de texto (.txt)
  let textoParaDescargar = "Sorteo Amigo Secreto:\n";
  for (const [participante, sorteado] of Object.entries(
    resultadoSorteoGlobal
  )) {
    textoParaDescargar += `${participante} le regaló a ${sorteado}\n`;
  }
  const blobTxt = new Blob([textoParaDescargar], {
    type: "text/plain;charset=utf-8",
  });
  const linkTxt = document.createElement("a");
  linkTxt.href = URL.createObjectURL(blobTxt);
  linkTxt.download = "amigo_secreto_sorteo.txt";
  linkTxt.click();

  // Opción 2: Descargar como archivo de Excel (.xlsx)
  // Descomenta este bloque si prefieres Excel
  /*
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Amigo", "Amigo Secreto"],
    ...data,
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sorteo");
  XLSX.writeFile(workbook, "amigo_secreto_sorteo.xlsx");
  */
}

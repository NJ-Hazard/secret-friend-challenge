//Lista donde guardaremos los amigos
//Se utiliza un array para almacenar los nombres de los amigos
//Se usa const porque no vamos a reasignar la variable, pero sí podemos modificar su contenido
const amigos = [];
//--- --- --- --- --- --- --- //
// Función para agregar un amigo
function agregarAmigo() {
  const input = document.getElementById("amigo");
  // quitamos espacios al inicio y final
  const nombre = input.value.trim();
  // Validamos que el nombre no esté vacío
  if (nombre === "") {
    alert("Por favor, ingresa un nombre válido.");
    return;
  }
  // Agregamos el nombre al array
  amigos.push(nombre);
  // Mostramos la lista actualizada
  mostrarLista();
  // Limpiamos el campo de entrada
  input.value = "";
}
//--- --- --- --- --- --- --- //
// Función para mostrar la lista de amigos
function mostrarLista() {
  // Obtenemos el elemento ul donde mostraremos la lista
  const lista = document.getElementById("listaAmigos");
  // limpiar lista antes de actualizar para evitar duplicados
  lista.innerHTML = "";
  // Recorremos el array y creamos un elemento li por cada amigo
  // También mostramos el índice + 1 para numerar la lista
  // Usamos forEach para iterar sobre el array
  amigos.forEach((amigo, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${amigo}`;
    // Usamos appendChild para agregar el li al ul
    lista.appendChild(li);
  });
}
//--- --- --- --- --- --- --- //
// Función para sortear un amigo
// Validamos que haya al menos un amigo en la lista
// Usamos Math.random para obtener un índice aleatorio
// Mostramos el resultado en el elemento con id "resultado"
function sortearAmigo() {
  if (amigos.length === 0) {
    alert("La lista está vacía. Agrega al menos un nombre antes de sortear.");
    return;
  }
  // Obtenemos un índice aleatorio entre 0 y la longitud del array - 1
  // Math.floor redondea hacia abajo para obtener un índice válido
  const indiceAleatorio = Math.floor(Math.random() * amigos.length);
  const amigoSorteado = amigos[indiceAleatorio];
  // Mostramos el resultado
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `<li>🎉 El amigo secreto es: <strong>${amigoSorteado}</strong> 🎉</li>`;
}
//--- --- --- --- --- --- --- //
// Función para limpiar la lista de amigos
// Vaciamos el array y limpiamos la lista en el DOM
// Mostramos una alerta confirmando que la lista ha sido limpiada
function limpiarLista() {
  amigos.length = 0; // vaciar el array
  const lista = document.getElementById("listaAmigos");
  const resultado = document.getElementById("resultado");
  // Limpiamos el contenido del ul y del resultado
  if (lista) lista.innerHTML = "";
  if (resultado) resultado.innerHTML = "";
  alert("La lista ha sido limpiada correctamente.");
}
//--- --- --- --- --- --- --- //
// Nota: Las funciones se llaman desde los botones en el HTML usando el atributo onclick
// Ejemplo: <button onclick="agregarAmigo()">Agregar Amigo</button>
// Esto es una forma sencilla de manejar eventos sin necesidad de usar addEventListener
//--- --- --- --- --- --- --- //
// Fin del código

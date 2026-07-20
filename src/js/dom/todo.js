import { validarTexto, formatearTexto, contarPalabras } from '../utils/texto.js';

/**
 * Crea un elemento <li> que representa una tarea.
 *
 * @param {string} texto - Texto de la tarea (ya formateado).
 * @returns {HTMLLIElement}
 */
export function crearTareaElemento(texto) {
  const li = document.createElement('li');
  li.className = 'tarea-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'tarea-checkbox';
  checkbox.addEventListener('change', () => alternarTarea(li, checkbox));

  const span = document.createElement('span');
  span.className = 'tarea-texto';
  span.textContent = texto;

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = '✕';
  btnEliminar.setAttribute('aria-label', 'Eliminar tarea');
  btnEliminar.addEventListener('click', () => eliminarTarea(li));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(btnEliminar);

  return li;
}

/**
 * Valida y agrega una tarea a la lista. Retorna el resultado de la operación.
 *
 * @param {string} texto - Texto ingresado por el usuario.
 * @param {HTMLUListElement} lista - Elemento <ul> contenedor de tareas.
 * @returns {{ exito: boolean, error?: string }}
 */
export function agregarTarea(texto, lista) {
  const validacion = validarTexto(texto);

  if (!validacion.valido) {
    return { exito: false, error: validacion.error };
  }

  // Tarea 3: además de la longitud, se exige un mínimo de 2 palabras.
  if (contarPalabras(texto) < 2) {
    return { exito: false, error: 'La tarea debe tener al menos 2 palabras.' };
  }

  const formateado = formatearTexto(texto);
  const elemento = crearTareaElemento(formateado);
  lista.appendChild(elemento);

  return { exito: true };
}

/**
 * Elimina una tarea del DOM.
 *
 * @param {HTMLLIElement} elemento - El elemento <li> a eliminar.
 */
export function eliminarTarea(elemento) {
  elemento.remove();
}

/**
 * Alterna el estado completado de una tarea.
 *
 * @param {HTMLLIElement} elemento - El elemento <li> de la tarea.
 * @param {HTMLInputElement} checkbox - El checkbox asociado.
 */
export function alternarTarea(elemento, checkbox) {
  elemento.classList.toggle('completada', checkbox.checked);
}

/**
 * Elimina todas las tareas completadas de la lista.
 *
 * @param {HTMLUListElement} lista - Elemento <ul> contenedor de tareas.
 * @returns {number} Cantidad de tareas eliminadas.
 */
export function limpiarCompletadas(lista) {
  const completadas = lista.querySelectorAll('.tarea-item.completada');
  completadas.forEach((item) => item.remove());
  return completadas.length;
}

/**
 * Actualiza el contador de tareas pendientes.
 *
 * @param {HTMLUListElement} lista - Elemento <ul> contenedor de tareas.
 * @param {HTMLElement} contenedor - Elemento donde se muestra el contador.
 */
export function actualizarContador(lista, contenedor) {
  const total = lista.querySelectorAll('.tarea-item').length;
  contenedor.textContent = `${total} tarea${total !== 1 ? 's' : ''}`;
}

/**
 * Muestra un mensaje de error temporal en el contenedor indicado.
 *
 * @param {string} mensaje - Mensaje de error a mostrar.
 * @param {HTMLElement} contenedor - Elemento donde se muestra el error.
 */
export function mostrarError(mensaje, contenedor) {
  contenedor.textContent = mensaje;
}

/**
 * Inicializa la aplicación: vincula eventos del formulario, botones y contador.
 */
export function inicializarTodoApp() {
  const form = document.getElementById('form-tarea');
  const input = document.getElementById('input-tarea');
  const lista = document.getElementById('lista-tareas');
  const mensajeError = document.getElementById('mensaje-error');
  const contador = document.getElementById('contador-tareas');
  const btnLimpiar = document.getElementById('btn-limpiar');

  if (!form || !input || !lista || !mensajeError || !contador || !btnLimpiar) {
    throw new Error('No se encontraron todos los elementos del DOM necesarios.');
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const texto = input.value;
    const resultado = agregarTarea(texto, lista);

    if (!resultado.exito) {
      mostrarError(resultado.error, mensajeError);
    } else {
      mostrarError('', mensajeError);
      input.value = '';
    }

    actualizarContador(lista, contador);
  });

  // Observa cambios en la lista (checkboxes) para actualizar el contador
  lista.addEventListener('change', () => {
    actualizarContador(lista, contador);
  });

  btnLimpiar.addEventListener('click', () => {
    limpiarCompletadas(lista);
    actualizarContador(lista, contador);
  });
}

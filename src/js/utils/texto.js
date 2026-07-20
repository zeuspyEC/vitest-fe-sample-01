/**
 * Valida que un texto cumpla con los requisitos mínimos.
 *
 * @param {string} texto - El texto a validar.
 * @returns {{ valido: boolean, error: string }}
 *   - valido: true si el texto es válido, false en caso contrario.
 *   - error: mensaje descriptivo si no es válido, cadena vacía si es válido.
 */
export function validarTexto(texto) {
  if (texto === undefined || texto === null) {
    return { valido: false, error: 'El texto no puede ser nulo o indefinido.' };
  }

  if (typeof texto !== 'string') {
    return { valido: false, error: 'El valor debe ser un texto (string).' };
  }

  const recortado = texto.trim();

  if (recortado.length === 0) {
    return { valido: false, error: 'El texto no puede estar vacío o contener solo espacios.' };
  }

  if (recortado.length < 3) {
    return { valido: false, error: 'El texto debe tener al menos 3 caracteres.' };
  }

  if (recortado.length > 200) {
    return { valido: false, error: 'El texto no puede exceder los 200 caracteres.' };
  }

  return { valido: true, error: '' };
}

/**
 * Formatea un texto: recorta espacios, convierte la primera letra a mayúscula
 * y el resto a minúscula.
 *
 * @param {string} texto - El texto a formatear.
 * @returns {string} El texto formateado.
 * @throws {Error} Si el texto no es una cadena válida.
 */
export function formatearTexto(texto) {
  if (typeof texto !== 'string') {
    throw new Error('El argumento debe ser un texto (string).');
  }

  const recortado = texto.trim();

  if (recortado.length === 0) {
    return '';
  }

  return recortado.charAt(0).toUpperCase() + recortado.slice(1).toLowerCase();
}

/**
 * Cuenta el número de palabras de un texto, separadas por uno o más espacios.
 * Añadida en la Tarea 3 para exigir un mínimo de 2 palabras por tarea.
 *
 * @param {string} texto - El texto a analizar.
 * @returns {number} Número de palabras. 0 si el texto está vacío o solo tiene espacios.
 * @throws {Error} Si el argumento no es una cadena.
 */
export function contarPalabras(texto) {
  if (typeof texto !== 'string') {
    throw new Error('El argumento debe ser un texto (string).');
  }

  const recortado = texto.trim();

  if (recortado.length === 0) {
    return 0;
  }

  return recortado.split(/\s+/).length;
}

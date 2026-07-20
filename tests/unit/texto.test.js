import { describe, it, expect } from 'vitest';
import { validarTexto, formatearTexto, contarPalabras } from '../../src/js/utils/texto.js';

// ============================================================
// Pruebas unitarias para validarTexto
// ============================================================
describe('validarTexto', () => {
  // --- Casos válidos ---
  it('debe retornar válido para un texto con 3 o más caracteres', () => {
    const resultado = validarTexto('Comprar pan');
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBe('');
  });

  it('debe retornar válido para un texto con exactamente 3 caracteres', () => {
    const resultado = validarTexto('ABC');
    expect(resultado.valido).toBe(true);
  });

  it('debe retornar válido para un texto con 200 caracteres (límite)', () => {
    const texto = 'A'.repeat(200);
    const resultado = validarTexto(texto);
    expect(resultado.valido).toBe(true);
  });

  // --- Casos no válidos ---
  it('debe retornar invalido cuando el texto esta vacio', () => {
    const resultado = validarTexto(''); // Arrange - Act
    expect(resultado.valido).toBe(false); // Assert
    expect(resultado.error).toBe('El texto no puede estar vacío o contener solo espacios.');
  });

  it('debe retornar invalido cuando el texto es < 3 caracteres', () => {
    const resultado = validarTexto('Hi');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El texto debe tener al menos 3 caracteres.');
  });

  it('debe retornar válido para textos con emojis, tildes y eñes', () => {
    const resultado = validarTexto('¡Hola 😊 ñaño!');
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBe('');
  });

  it('debe retornar inválido para un texto con espacios y una sola letra', () => {
    const resultado = validarTexto('   A');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El texto debe tener al menos 3 caracteres.');
  });
});

// ============================================================
// Pruebas unitarias para formatearTexto
// ============================================================
describe('formatearTexto', () => {
  it('debe convertir la primera letra a mayúscula y el resto a minúscula', () => {
    const resultado = formatearTexto('hOLA MUNDO');
    expect(resultado).toBe('Hola mundo');
  });

  it('debe retornar un string vacío si se ingresa un string vacío', () => {
    const resultado = formatearTexto('');
    expect(resultado).toBe('');
  });

  it('debe devolver un string vacío si solo hay espacios', () => {
    const resultado = formatearTexto('   ');
    expect(resultado).toBe('');
  });

  it('debe formatear correctamente palabras con tildes', () => {
    const resultado = formatearTexto('árbol');
    expect(resultado).toBe('Árbol');
  });

  it('no debe alterar un texto que ya está correctamente formateado', () => {
    const resultado = formatearTexto('Hola mundo');
    expect(resultado).toBe('Hola mundo');
  });
});

// ============================================================
// Pruebas adicionales — Tarea 1
// ============================================================
describe('Pruebas adicionales — Tarea 1', () => {
  // 1. validarTexto con caracteres especiales (emojis, tildes, eñes)
  it('validarTexto: acepta texto con emojis, tildes y eñes', () => {
    // Arrange & Act
    const resultado = validarTexto('Niño 🚀 corazón');
    // Assert
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBe('');
  });

  // 2. validarTexto con exactamente 3 espacios seguidos de una letra ("   A")
  it('validarTexto: rechaza 3 espacios seguidos de una sola letra ("   A")', () => {
    // Arrange & Act
    const resultado = validarTexto('   A');
    // Assert: tras recortar queda 1 carácter -> menos de 3
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El texto debe tener al menos 3 caracteres.');
  });

  // 3. formatearTexto con caracteres especiales: "árbol" -> "Árbol"
  it('formatearTexto: capitaliza correctamente "árbol" -> "Árbol"', () => {
    const resultado = formatearTexto('árbol');
    expect(resultado).toBe('Árbol');
  });

  // 4. formatearTexto con texto ya bien formateado: no debe alterarse
  it('formatearTexto: no altera un texto ya correctamente formateado', () => {
    const resultado = formatearTexto('Lista de compras');
    expect(resultado).toBe('Lista de compras');
  });
});

// ============================================================
// Pruebas unitarias para contarPalabras — Tarea 3
// ============================================================
describe('contarPalabras — Tarea 3', () => {
  it('cuenta 2 palabras separadas por un espacio', () => {
    expect(contarPalabras('Comprar pan')).toBe(2);
  });

  it('cuenta 1 palabra cuando hay un solo término', () => {
    expect(contarPalabras('Hola')).toBe(1);
  });

  it('retorna 0 para un string vacío', () => {
    expect(contarPalabras('')).toBe(0);
  });

  it('retorna 0 cuando el texto solo tiene espacios', () => {
    expect(contarPalabras('     ')).toBe(0);
  });

  it('ignora espacios múltiples entre palabras', () => {
    expect(contarPalabras('uno    dos   tres')).toBe(3);
  });

  it('lanza Error si el argumento no es un string', () => {
    expect(() => contarPalabras(123)).toThrow('El argumento debe ser un texto (string).');
  });

  it('lanza Error si el argumento es null', () => {
    expect(() => contarPalabras(null)).toThrow(Error);
  });
});

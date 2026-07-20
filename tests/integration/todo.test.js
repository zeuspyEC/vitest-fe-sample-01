import { describe, it, expect, beforeEach } from 'vitest';
import {
  crearTareaElemento,
  agregarTarea,
  eliminarTarea,
  alternarTarea,
  limpiarCompletadas,
  actualizarContador,
  mostrarError,
} from '../../src/js/dom/todo.js';

// Helper: crea una lista <ul> fresca para cada prueba
function crearLista() {
  return document.createElement('ul');
}

// ============================================================
// Pruebas de integración — manipulación del DOM
// ============================================================
describe('crearTareaElemento', () => {
  it('debe crear un elemento <li> con la clase "tarea-item"', () => {
    const li = crearTareaElemento('Test');
    expect(li.tagName).toBe('LI');
    expect(li.classList.contains('tarea-item')).toBe(true);
  });
});

describe('agregarTarea', () => {
  let lista;

  beforeEach(() => {
    lista = crearLista();
  });

  it('debe agregar un <li> a la lista cuando el texto es válido', () => {
    const resultado = agregarTarea('Aprender vitest', lista);
    expect(resultado.exito).toBe(true);
    expect(lista.children.length).toBe(1);
    expect(lista.querySelector('.tarea-texto').textContent).toBe('Aprender vitest');
  });

  it('debe formatear el texto antes de agregarlo', () => {
    const resultado = agregarTarea(' eSTudIAR VerIFIcacIon de SW', lista);
    const span = lista.querySelector('.tarea-texto');
    expect(resultado.exito).toBe(true);
    expect(span.textContent).toBe('Estudiar verificacion de sw');
  });
});

describe('eliminarTarea', () => {
  it('debe eliminar el elemento <li> del DOM', () => {
    const lista = crearLista();
    agregarTarea('Tarea a eliminar', lista);
    const li = lista.querySelector('.tarea-item');

    eliminarTarea(li);
    expect(lista.children.length).toBe(0);
  });
});

describe('alternarTarea', () => {
  it('debe agregar la clase "completada" cuando el checkbox está marcado', () => {
    const li = crearTareaElemento('Tarea test');
    const checkbox = li.querySelector('.tarea-checkbox');
    checkbox.checked = true;

    alternarTarea(li, checkbox);
    expect(li.classList.contains('completada')).toBe(true);
  });
});

describe('limpiarCompletadas', () => {
  it('debe eliminar solo las tareas completadas', () => {
    const lista = crearLista();
    agregarTarea('Tarea pendiente', lista);
    agregarTarea('Tarea completada', lista);

    // Marcar la segunda como completada
    const items = lista.querySelectorAll('.tarea-item');
    const checkbox = items[1].querySelector('.tarea-checkbox');
    checkbox.checked = true;
    alternarTarea(items[1], checkbox);

    const eliminadas = limpiarCompletadas(lista);
    expect(eliminadas).toBe(1);
    expect(lista.children.length).toBe(1);
    expect(lista.querySelector('.tarea-texto').textContent).toBe('Tarea pendiente');
  });
});

describe('actualizarContador', () => {
  it('debe mostrar "0 tareas" cuando la lista está vacía', () => {
    const lista = crearLista();
    const contenedor = document.createElement('span');

    actualizarContador(lista, contenedor);
    expect(contenedor.textContent).toBe('0 tareas');
  });

  it('debe mostrar "1 tarea" cuando hay exactamente un elemento', () => {
    const lista = crearLista();
    agregarTarea('Única tarea', lista);
    const contenedor = document.createElement('span');

    actualizarContador(lista, contenedor);
    expect(contenedor.textContent).toBe('1 tarea');
  });
});

describe('mostrarError', () => {
  it('debe establecer el texto del contenedor con el mensaje de error', () => {
    const contenedor = document.createElement('div');
    mostrarError('Error de prueba', contenedor);
    expect(contenedor.textContent).toBe('Error de prueba');
  });
});

// ============================================================
// Pruebas adicionales — Tarea 2
// ============================================================
describe('Pruebas adicionales — Tarea 2', () => {
  let lista;

  beforeEach(() => {
    lista = crearLista();
  });

  // 1. El botón eliminar borra el elemento de la lista (clic real)
  it('al hacer clic en el botón eliminar, el elemento se quita de la lista', () => {
    // Arrange
    const li = crearTareaElemento('Comprar leche');
    lista.appendChild(li);
    expect(lista.children.length).toBe(1);

    // Act: clic real sobre el botón eliminar
    const btnEliminar = li.querySelector('.btn-eliminar');
    btnEliminar.click();

    // Assert
    expect(lista.children.length).toBe(0);
  });

  // 2. El evento change del checkbox alterna la clase "completada" (dispatchEvent)
  it('el evento change del checkbox alterna la clase "completada"', () => {
    // Arrange
    const li = crearTareaElemento('Lavar el auto');
    const checkbox = li.querySelector('.tarea-checkbox');

    // Act: marcar y disparar el evento change como lo haría un clic real
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    // Assert
    expect(li.classList.contains('completada')).toBe(true);

    // Act 2: desmarcar y volver a disparar change
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    // Assert 2
    expect(li.classList.contains('completada')).toBe(false);
  });

  // 3. agregarTarea con un texto de exactamente 200 caracteres (debe ser exitoso)
  it('agregarTarea acepta un texto de exactamente 200 caracteres', () => {
    // Arrange: 200 caracteres y al menos 2 palabras (regla de Tarea 3)
    const texto = 'A'.repeat(100) + ' ' + 'B'.repeat(99);
    expect(texto.length).toBe(200);

    // Act
    const resultado = agregarTarea(texto, lista);

    // Assert
    expect(resultado.exito).toBe(true);
    expect(lista.children.length).toBe(1);
  });

  // 4. limpiarCompletadas cuando todas las tareas están completadas -> lista vacía
  it('limpiarCompletadas deja la lista vacía si todas están completadas', () => {
    // Arrange
    agregarTarea('Primera tarea', lista);
    agregarTarea('Segunda tarea', lista);

    const items = lista.querySelectorAll('.tarea-item');
    items.forEach((item) => {
      const cb = item.querySelector('.tarea-checkbox');
      cb.checked = true;
      alternarTarea(item, cb);
    });

    // Act
    const eliminadas = limpiarCompletadas(lista);

    // Assert
    expect(eliminadas).toBe(2);
    expect(lista.children.length).toBe(0);
  });
});

// ============================================================
// Pruebas adicionales — Tarea 3 (validación de mínimo 2 palabras)
// ============================================================
describe('Pruebas adicionales — Tarea 3 (validación de palabras)', () => {
  let lista;

  beforeEach(() => {
    lista = crearLista();
  });

  it('rechaza una tarea de una sola palabra con el mensaje correspondiente', () => {
    // Arrange & Act: "Comprar" es válido en longitud pero tiene 1 sola palabra
    const resultado = agregarTarea('Comprar', lista);

    // Assert
    expect(resultado.exito).toBe(false);
    expect(resultado.error).toBe('La tarea debe tener al menos 2 palabras.');
    expect(lista.children.length).toBe(0);
  });

  it('acepta una tarea con dos o más palabras', () => {
    // Arrange & Act
    const resultado = agregarTarea('Comprar pan', lista);

    // Assert
    expect(resultado.exito).toBe(true);
    expect(lista.children.length).toBe(1);
  });
});

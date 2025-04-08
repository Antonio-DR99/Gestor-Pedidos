# README

## Descripción
Este proyecto consiste en una página web principal diseñada con HTML y CSS, utilizando el framework **Bootstrap 5.3.3** para una interfaz responsiva y moderna. La página incluye una barra lateral deslizable (offcanvas) con un menú de navegación y un modal para iniciar sesión. Los estilos personalizados se encuentran en el archivo `styles.css`, mientras que la funcionalidad dinámica depende de Bootstrap y un script adicional (`backends.js`).

El diseño está pensado para ser intuitivo y visualmente atractivo, con transiciones suaves y efectos hover en los elementos interactivos.

---

## Estructura del Proyecto

- **HTML**: 
  - Archivo principal que contiene la estructura de la página (`index.html` o similar).
  - Incluye una barra lateral (offcanvas), un botón de menú, un botón de inicio de sesión y un modal de login.
- **CSS**: 
  - `styles/styles.css`: Hoja de estilos personalizada para la barra lateral, el botón de login y el modal.
  - Uso de Bootstrap mediante CDN (`bootstrap.min.css`).
- **JavaScript**: 
  - `backends.js`: Script personalizado (no proporcionado en el código).
  - Bootstrap JS mediante CDN (`bootstrap.bundle.min.js`) para funcionalidades como el offcanvas y el modal.
- **Dependencias Externas**:
  - Google Icons (`Material Symbols Outlined`) para los íconos del menú.

---

## Dependencias

- **Bootstrap 5.3.3**:
  - CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
  - JS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`
- **Google Fonts (Material Symbols)**:
  - `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined`

---

## Características Principales

### 1. Barra Lateral (Offcanvas)
- **Botón de Menú**: Un botón con el ícono `menu` que despliega la barra lateral.
- **Menú**:
  - Lista de opciones: Home, Pedidos, Envíos, Clientes, Productos.
  - Cada elemento incluye un ícono de Google Material Symbols y un enlace (actualmente sin funcionalidad definida: `<a href="/ruta"></a>`).
- **Estilos**:
  - Transiciones suaves al pasar el cursor (`hover`).
  - Fondo gris oscuro (`#444`) y sombra al interactuar.
  - Iconos alineados con texto, tamaño personalizado.

### 2. Modal de Inicio de Sesión
- **Botón de Activación**: Botón "Iniciar Sesión" ubicado en la esquina superior derecha.
- **Formulario**:
  - Campos para usuario y contraseña con validación básica (`required`).
  - Botón de envío centrado.
- **Estilos**:
  - Botón y modal con colores personalizados (gris oscuro: `#555`, hover: `#777`).
  - Bordes redondeados y diseño limpio.

---

## Estilos Personalizados (`styles.css`)

### Barra Lateral
- **Botón de Menú**:
  - Sin fondo ni bordes, ícono grande (`2.5em`).
- **Elementos de la Lista**:
  - Tamaño de fuente: `1.2em`.
  - Iconos: `2em` con margen derecho.
  - Efecto `hover`: Fondo oscuro, sombra y cambio de color a blanco.
- **Transiciones**: Suaves en 0.3 segundos.

### Login
- **Botón Principal**:
  - Fondo: `#555`, hover: `#777`.
  - Sin bordes, sombra en hover.
- **Modal**:
  - Campos de formulario con bordes suaves y espaciado.
  - Etiquetas en gris oscuro (`#555`).
  - Botón de envío con estilo consistente al botón principal.

---

## Instalación y Uso

1. **Requisitos**:
   - Conexión a internet para cargar las dependencias externas (Bootstrap y Google Icons).
   - Un navegador web moderno.

2. **Pasos**:
   - Coloca el archivo HTML en tu directorio de trabajo.
   - Crea una carpeta `styles/` y añade el archivo `styles.css` con los estilos proporcionados.
   - Asegúrate de incluir el archivo `backends.js` si contiene lógica adicional (no incluido en este ejemplo).
   - Abre el archivo HTML en un navegador.

---

## Notas Adicionales
- Los enlaces en el menú (`/home`, `/pedidos`, etc.) no tienen rutas funcionales definidas en este código. Deben configurarse según el backend o la estructura del proyecto.
- El archivo `backends.js` no está incluido, por lo que cualquier funcionalidad JavaScript personalizada debe ser añadida por el desarrollador.

---

## Autor

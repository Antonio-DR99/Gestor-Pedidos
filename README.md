# 🌐 Sistema de Gestión Local

**Sistema de Gestión Local** es una aplicación web para la gestión de operaciones comerciales como zonas, productos, pedidos y clientes. Desarrollada con **HTML, CSS y JavaScript**, utiliza **Bootstrap 5.3.3** para una interfaz moderna y completamente responsiva. Los datos se almacenan en `localStorage`, permitiendo persistencia sin servidor backend.

---

## 📂 Tabla de Contenidos

- [📌 Descripción](#descripción)
- [✨ Características](#características)
- [📁 Estructura del Proyecto](#estructura-del-proyecto)
- [📦 Dependencias](#dependencias)
- [⚙️ Instalación](#instalación)
- [🚀 Uso](#uso)
- [📝 Notas Adicionales](#notas-adicionales)
- [🤝 Contribución](#contribución)
- [🧾 Licencia](#licencia)

---

## 📌 Descripción

Esta aplicación está pensada para pequeñas empresas o usuarios que necesitan administrar fácilmente:

- **Zonas**: Áreas geográficas con tarifas y estadísticas.
- **Productos**: Inventario con stock y precios.
- **Pedidos**: Registro con estados (Pendiente, Enviado, Entregado).
- **Clientes**: Información básica y de contacto.
- **Home**: Resumen general de actividad reciente.

La interfaz incluye barra lateral navegable (offcanvas), un modal de login y páginas específicas para cada entidad. Todo funciona directamente en el navegador usando `localStorage`.

---

## ✨ Características

### 🤭 Interfaz y Navegación

- **Barra lateral (Offcanvas)** con enlaces a todas las secciones.
- **Iconos**: Material Symbols Outlined para mayor claridad.
- **Modal de Inicio de Sesión** con validación básica.
- **Diseño Responsivo** gracias a Bootstrap.

### 📂 Gestión de Entidades

- **Zonas**: Tarjetas con nombre, tarifa y estadísticas. CRUD completo.
- **Productos**: Tabla editable con nombre, stock y precio.
- **Pedidos**: Gestión de pedidos con fecha, estado y total.
- **Clientes**: Base de datos editable desde tabla.
- **Home**: Estadísticas generales y registros recientes.

### 💾 Persistencia de Datos

- Todos los datos se almacenan en `localStorage`.
- Persistencia asegurada entre recargas de página.

### 🎨 Estilos Personalizados

- **Sidebar**: Fondo gris oscuro, iconos grandes, animaciones suaves.
- **Botones**: Colores personalizados con efecto hover.
- **Modal**: Bordes redondeados, diseño limpio.
- **Tablas y Tarjetas**: Sombra ligera y alineación cuidada.

---

## 📁 Estructura del Proyecto

```
sistema-gestion-local/
│
├— index.html              # Página principal
├— home.html               # Página de inicio
├— styles/
│   └— styles.css          # Estilos personalizados
├— scripts/
│   └— backend.js          # Lógica CRUD
└— assets/                 # Imágenes y recursos estáticos (opcional)
```

---

## 📦 Dependencias

- **Bootstrap 5.3.3**
  - CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
  - JS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`
- **Google Fonts - Material Symbols Outlined**
  - `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined`

---

## ⚙️ Instalación

### ✅ Requisitos

- Navegador moderno (Chrome, Firefox, Edge, etc.).
- Conexión a Internet para cargar Bootstrap e iconos.

### 📅 Pasos

```bash
git clone https://github.com/tu-usuario/sistema-gestion-local.git
cd sistema-gestion-local
```

- Asegúrate de que los archivos estén ubicados correctamente.
- Abre `index.html` con tu navegador favorito.

---

## 🚀 Uso

### 📂 Navegar la aplicación

- Usa el **botón de menú** para abrir la barra lateral.
- Selecciona cualquier sección: *Home*, *Pedidos*, *Clientes*, *Productos*.
- Presiona **"Iniciar Sesión"** para abrir el modal de login.

### 📟 Gestionar datos

- **Zonas**: Añade, edita o elimina desde las tarjetas.
- **Productos**: Adminístralos desde la tabla y el modal.
- **Pedidos**: CRUD completo desde la tabla.
- **Clientes**: Gestión desde el formulario modal y tabla.

### 📊 Ver Resumen

- En `home.html` puedes consultar:
  - Pedidos por estado.
  - Últimos 3 clientes registrados.
  - Últimos 5 pedidos ingresados.

---

## 📝 Notas Adicionales

- ⚠️ **Navegación**: Si integras con backend, asegúrate de configurar correctamente los enlaces de navegación.
- 🔐 **Login**: Actualmente solo con validación básica. Puedes extenderlo en `backend.js`.
- 📊 **Escalabilidad**: Para entornos multiusuario, se recomienda integrar con una base de datos.
- 📄 **Archivos Adicionales**: Asegúrate de incluir cualquier otra página o recurso si es necesario.

---

## 🤝 Contribución

¡Gracias por tu interés en contribuir!

1. Haz un fork del repositorio.
2. Crea una rama:  
   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```
3. Realiza los cambios y haz commit:  
   ```bash
   git commit -am "Añadí una nueva funcionalidad"
   ```
4. Sube tu rama al repositorio:  
   ```bash
   git push origin mi-nueva-funcionalidad
   ```
5. Abre un Pull Request y describe tus cambios.

---


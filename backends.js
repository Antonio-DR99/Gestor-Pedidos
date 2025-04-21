// ================================================
// SISTEMA DE GESTIÓN: ZONAS, PRODUCTOS, PEDIDOS, CLIENTES Y HOME
// ================================================
// Este script gestiona las funcionalidades de zonas, productos, pedidos, clientes y la página principal (home).
// Cada sección del código está dedicada a una entidad específica y contiene funciones para agregar, editar, eliminar y renderizar datos.
// Las funciones están diseñadas para interactuar con modales de Bootstrap y manipular el DOM para reflejar los cambios.
// ================================================
// SECCIÓN: GESTIÓN DE ZONAS
// ================================================
// Esta sección maneja la creación, edición y eliminación de zonas, representadas como tarjetas en el DOM.
// Función: Abre el modal y carga los datos para editar una zona
// Parámetros:
//   - cardBody: El elemento del DOM que contiene los datos de la zona a editar
function abrirModalEditarZona(cardBody) {
    const nombre = cardBody.querySelector('.card-title').textContent.trim();
    const tarifa = cardBody.querySelector('[id^="tarifa"]').textContent.replace('€', '').trim();
    const pedidos = cardBody.querySelector('[id^="pedidos"]').textContent.trim();

    document.getElementById('zonaNombre').value = nombre;
    document.getElementById('zonaTarifa').value = tarifa;
    document.getElementById('zonaPedidos').value = pedidos;

    const modalEl = document.getElementById('zonaModal');
    modalEl.dataset.cardSelector = obtenerSelectorUnico(cardBody);

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// Función: Guarda los cambios editados de una zona
function guardarCambiosZona() {
    const modalEl = document.getElementById('zonaModal');
    const cardBody = document.querySelector(modalEl.dataset.cardSelector);
    if (!cardBody) return;

    const nombre = document.getElementById('zonaNombre').value;
    const tarifa = document.getElementById('zonaTarifa').value;
    const pedidos = document.getElementById('zonaPedidos').value;

    cardBody.querySelector('.card-title').textContent = nombre;
    cardBody.querySelector('[id^="tarifa"]').textContent = tarifa + '€';
    cardBody.querySelector('[id^="pedidos"]').textContent = pedidos;

    actualizarEstadisticas();
    guardarZonasEnLocalStorage();
    cerrarModal();
}

// Función: Elimina la zona seleccionada
function eliminarZona() {
    const modalEl = document.getElementById('zonaModal');
    const cardBody = document.querySelector(modalEl.dataset.cardSelector);
    if (!cardBody) return;

    cardBody.closest('.col-md-6').remove();
    actualizarEstadisticas();
    guardarZonasEnLocalStorage();
    cerrarModal();
}

// Función: Cierra el modal de edición
function cerrarModal() {
    const modalEl = document.getElementById('zonaModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    delete modalEl.dataset.cardSelector;
}

// Función: Abre el modal para añadir una nueva zona
function abrirModalAñadirZona() {
    const modal = new bootstrap.Modal(document.getElementById('addZoneModal'));
    modal.show();
}

// Función: Guarda una nueva zona
function guardarNuevaZona() {
    const nombreZona = document.getElementById('nombreZona').value;
    const tarifaZona = document.getElementById('tarifaZona').value;
    const pedidosZona = document.getElementById('pedidosZona').value;

    if (nombreZona && tarifaZona && pedidosZona) {
        const nuevaZona = crearTarjetaZona(nombreZona, tarifaZona, pedidosZona);
        const contenedorZonas = document.querySelector('.container.mt-4.mb-4 .row.g-4');
        contenedorZonas.appendChild(nuevaZona);

        nuevaZona.querySelector('.custom-outline-btn').addEventListener('click', () => {
            const cardBody = nuevaZona.querySelector('.card-body');
            abrirModalEditarZona(cardBody);
        });

        actualizarEstadisticas();
        guardarZonasEnLocalStorage();
        cerrarModalAñadirZona();
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función: Cierra el modal de añadir zona y limpia los campos
function cerrarModalAñadirZona() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addZoneModal'));
    modal.hide();
    document.getElementById('nombreZona').value = '';
    document.getElementById('tarifaZona').value = '';
    document.getElementById('pedidosZona').value = '';
}

// Función: Crea una tarjeta HTML para una nueva zona
// Parámetros:
//   - nombre: Nombre de la zona
//   - tarifa: Tarifa de la zona
//   - pedidos: Número de pedidos de la zona
function crearTarjetaZona(nombre, tarifa, pedidos) {
    const col = document.createElement('div');
    col.classList.add('col-md-6');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'border-0');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const idUnico = `zona-${nombre.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
    cardBody.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${nombre}</h5>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="text-muted">Tarifa</span>
            <span class="fw-bold text-dark" id="tarifa-${idUnico}">${tarifa}€</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">Pedidos (7d)</span>
            <span class="fw-bold text-dark" id="pedidos-${idUnico}">${pedidos}</span>
        </div>
        <div class="d-grid">
            <button class="custom-outline-btn">Ver Detalles</button>
        </div>
    `;

    card.appendChild(cardBody);
    col.appendChild(card);
    return col;
}

// Función: Actualiza las estadísticas de zonas (total de zonas, total de pedidos, zona más activa)
function actualizarEstadisticas() {
    const zonas = document.querySelectorAll('.col-md-6 .card-body');
    const totalZonas = zonas.length;
    let totalPedidos = 0;
    let zonaMasActiva = { nombre: 'N/A', pedidos: 0 };

    zonas.forEach(zona => {
        const pedidos = parseInt(zona.querySelector('[id^="pedidos"]').textContent) || 0;
        totalPedidos += pedidos;
        if (pedidos > zonaMasActiva.pedidos) {
            zonaMasActiva = {
                nombre: zona.querySelector('.card-title').textContent.trim(),
                pedidos: pedidos
            };
        }
    });

    document.getElementById('total-zonas').textContent = totalZonas;
    document.getElementById('total-pedidos').textContent = totalPedidos;
    document.getElementById('zona-mas-activa').textContent = zonaMasActiva.nombre;
}

// Función auxiliar: Genera un selector CSS único para un elemento
// Parámetros:
//   - element: El elemento del DOM para el cual generar el selector
function obtenerSelectorUnico(element) {
    const path = [];
    while (element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        path.unshift(`${element.tagName.toLowerCase()}:nth-child(${index + 1})`);
        element = element.parentElement;
        if (element.id) {
            path.unshift(`#${element.id}`);
            break;
        }
    }
    return path.join(' > ');
}

// Función: Guarda las zonas en el LocalStorage
function guardarZonasEnLocalStorage() {
    const zonas = [];
    document.querySelectorAll('.col-md-6 .card-body').forEach(zona => {
        const nombre = zona.querySelector('.card-title').textContent.trim();
        const tarifa = parseFloat(zona.querySelector('[id^="tarifa"]').textContent.replace('€', '').trim());
        const pedidos = parseInt(zona.querySelector('[id^="pedidos"]').textContent.trim());

        zonas.push({ nombre, tarifa, pedidos });
    });
    localStorage.setItem('zonas', JSON.stringify(zonas));
}

// Función: Carga las zonas desde el LocalStorage
function cargarZonasDesdeLocalStorage() {
    const zonasGuardadas = JSON.parse(localStorage.getItem('zonas')) || [];
    const contenedorZonas = document.querySelector('.container.mt-4.mb-4 .row.g-4');
    contenedorZonas.innerHTML = ''; // Limpiar contenedor

    zonasGuardadas.forEach(zona => {
        const nuevaZona = crearTarjetaZona(zona.nombre, zona.tarifa, zona.pedidos);
        contenedorZonas.appendChild(nuevaZona);

        nuevaZona.querySelector('.custom-outline-btn').addEventListener('click', () => {
            const cardBody = nuevaZona.querySelector('.card-body');
            abrirModalEditarZona(cardBody);
        });
    });
}

// Función: Inicializa los eventos de la página
function inicializarEventos() {
    document.querySelectorAll('.custom-outline-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            abrirModalEditarZona(cardBody);
        });
    });

    document.getElementById('add-zone-btn').addEventListener('click', abrirModalAñadirZona);
    document.getElementById('guardarZonaBtnAdd').addEventListener('click', guardarNuevaZona);
    document.getElementById('guardarZonaBtn').addEventListener('click', guardarCambiosZona);
    document.getElementById('eliminarZonaBtn').addEventListener('click', eliminarZona);
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarZonasDesdeLocalStorage();
    inicializarEventos();
    actualizarEstadisticas();
});

// ================================================
// SECCIÓN: GESTIÓN DE PRODUCTOS
// ================================================
// Esta sección maneja un array de productos y su representación en una tabla.

let productos = [
    { id: 1, nombre: "Producto Ejemplo", stock: 5, precio: 100 }
];
let idAEliminar = null;

// Función: Abre el modal para agregar un nuevo producto
function abrirModalAgregar() {
    document.getElementById('productModalLabel').textContent = 'Añadir Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

// Función: Abre el modal para editar un producto existente
// Parámetros:
//   - id: ID del producto
//   - nombre: Nombre del producto
//   - stock: Stock del producto
//   - precio: Precio del producto
function abrirModalEditar(id, nombre, stock, precio) {
    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = nombre;
    document.getElementById('productStock').value = stock;
    document.getElementById('productPrice').value = precio;
}

// Función: Guarda un producto nuevo o editado
function guardarProducto() {
    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const precio = parseFloat(document.getElementById('productPrice').value);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    if (id) {
        const indice = productos.findIndex(producto => producto.id === parseInt(id));
        if (indice !== -1) {
            productos[indice] = { id: parseInt(id), nombre, stock, precio };
        }
    } else {
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({ id: nuevoId, nombre, stock, precio });
    }

    renderizarTabla();
    guardarProductosEnLocalStorage();
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

// Función: Muestra el modal de confirmación para eliminar un producto
// Parámetros:
//   - id: ID del producto a eliminar
function mostrarModalEliminar(id) {
    idAEliminar = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    deleteModal.show();
}

// Evento para confirmar la eliminación de un producto
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (idAEliminar !== null) {
        productos = productos.filter(producto => producto.id !== idAEliminar);
        renderizarTabla();
        guardarProductosEnLocalStorage();
        idAEliminar = null;
    }
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    deleteModal.hide();
});

// Función: Renderiza la tabla de productos en el DOM
function renderizarTabla() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
            <td>${producto.precio.toFixed(2)}€</td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button class="custom-outline-btn edit btn btn-sm mx-1" 
                            data-bs-toggle="modal" 
                            data-bs-target="#productModal" 
                            onclick="abrirModalEditar(${producto.id}, '${producto.nombre}', ${producto.stock}, ${producto.precio})">
                        Editar
                    </button>
                    <button class="custom-outline-btn delete btn btn-sm mx-1" 
                            onclick="mostrarModalEliminar(${producto.id})">
                        Eliminar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Función: Guarda los productos en el LocalStorage
function guardarProductosEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Función: Carga los productos desde el LocalStorage
function cargarProductosDesdeLocalStorage() {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    productos = productosGuardados;
    renderizarTabla();
}

// Renderizar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeLocalStorage();
    renderizarTabla();
});

// ================================================
// SECCIÓN: GESTIÓN DE PEDIDOS
// ================================================
// Esta sección maneja un array de pedidos y su representación en una tabla.

let pedidos = [];
let pedidoEditando = null;
let siguienteId = 1;

// Función: Abre el modal para agregar un nuevo pedido
function abrirModalAgregar() {
    pedidoEditando = null;
    document.getElementById('pedidoForm').reset();
    document.getElementById('pedidoId').value = siguienteId;
}

// Función: Guarda un pedido nuevo o editado
function guardarPedido() {
    const id = parseInt(document.getElementById('pedidoId').value);
    const cliente = document.getElementById('pedidoCliente').value;
    const fecha = document.getElementById('pedidoFecha').value;
    const estado = document.getElementById('pedidoEstado').value;
    const total = parseFloat(document.getElementById('pedidoTotal').value);

    if (!cliente || !fecha || !estado || isNaN(total)) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const pedido = { id, cliente, fecha, estado, total };

    if (pedidoEditando) {
        const index = pedidos.findIndex(p => p.id === pedidoEditando.id);
        pedidos[index] = pedido;
    } else {
        pedidos.push(pedido);
        siguienteId++;
    }

    actualizarTabla();
    bootstrap.Modal.getInstance(document.getElementById('pedidoModal')).hide();
}

// Función: Actualiza la tabla de pedidos en el DOM
function actualizarTabla() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';

    pedidos.forEach(pedido => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.fecha}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.total.toFixed(2)}€</td>
            <td>
                <button class="custom-outline-btn edit btn btn-sm mx-1" onclick="editarPedido(${pedido.id})">Editar</button>
                <button class="custom-outline-btn delete btn btn-sm mx-1" onclick="confirmarEliminacion(${pedido.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Función: Abre el modal para editar un pedido existente
// Parámetros:
//   - id: ID del pedido a editar
function editarPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    pedidoEditando = pedido;

    document.getElementById('pedidoId').value = pedido.id;
    document.getElementById('pedidoCliente').value = pedido.cliente;
    document.getElementById('pedidoFecha').value = pedido.fecha;
    document.getElementById('pedidoEstado').value = pedido.estado;
    document.getElementById('pedidoTotal').value = pedido.total;

    const modal = new bootstrap.Modal(document.getElementById('pedidoModal'));
    modal.show();
}

// Función: Muestra el modal de confirmación para eliminar un pedido
// Parámetros:
//   - id: ID del pedido a eliminar
function confirmarEliminacion(id) {
    const btnConfirmar = document.getElementById('confirmDeleteBtn');
    btnConfirmar.onclick = () => eliminarPedido(id);

    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

// Función: Elimina un pedido del array y actualiza la tabla
// Parámetros:
//   - id: ID del pedido a eliminar
function eliminarPedido(id) {
    pedidos = pedidos.filter(p => p.id !== id);
    actualizarTabla();
    bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
}

// Inicializar la tabla de pedidos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    pedidos = [];
    siguienteId = 1;
    actualizarTabla();
});

// ================================================
// SECCIÓN: GESTIÓN DE CLIENTES
// ================================================
// Esta sección maneja un array de clientes y su representación en una tabla.

let clientes = [];
let contadorId = 1;

// Constructor para el objeto Cliente
class Cliente {
    constructor(id, nombre, email, telefono) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
}

// Función: Agrega un nuevo cliente
// Parámetros:
//   - nombre: Nombre del cliente
//   - email: Email del cliente
//   - telefono: Teléfono del cliente
function agregarCliente(nombre, email, telefono) {
    const id = contadorId++;
    const nuevoCliente = new Cliente(id, nombre, email, telefono);
    clientes.push(nuevoCliente);
    renderizarClientes();
}

// Función: Edita un cliente existente
// Parámetros:
//   - id: ID del cliente
//   - nombre: Nuevo nombre
//   - email: Nuevo email
//   - telefono: Nuevo teléfono
function editarCliente(id, nombre, email, telefono) {
    const cliente = clientes.find(cliente => cliente.id === id);
    if (cliente) {
        cliente.nombre = nombre;
        cliente.email = email;
        cliente.telefono = telefono;
        renderizarClientes();
    }
}

// Función: Elimina un cliente
// Parámetros:
//   - id: ID del cliente a eliminar
function eliminarCliente(id) {
    clientes = clientes.filter(cliente => cliente.id !== id);
    renderizarClientes();
}

// Función: Renderiza la tabla de clientes en el DOM
function renderizarClientes() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>
                <button class="btn btn-warning" onclick="abrirModalEditar(${cliente.id})">Editar</button>
                <button class="btn btn-danger" onclick="confirmarEliminacion(${cliente.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función: Abre el modal para editar un cliente
// Parámetros:
//   - id: ID del cliente a editar
function abrirModalEditar(id) {
    const cliente = clientes.find(cliente => cliente.id === id);
    if (cliente) {
        document.getElementById('clientId').value = cliente.id;
        document.getElementById('clientName').value = cliente.nombre;
        document.getElementById('clientEmail').value = cliente.email;
        document.getElementById('clientPhone').value = cliente.telefono;

        const myModal = new bootstrap.Modal(document.getElementById('clientModal'));
        myModal.show();
    }
}

// Función: Guarda un cliente nuevo o editado
function guardarCliente() {
    const id = document.getElementById('clientId').value;
    const nombre = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const telefono = document.getElementById('clientPhone').value;

    if (id) {
        editarCliente(Number(id), nombre, email, telefono);
    } else {
        agregarCliente(nombre, email, telefono);
    }

    document.getElementById('clientId').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';

    const myModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
    myModal.hide();
}

// Función: Confirma la eliminación de un cliente
// Parámetros:
//   - id: ID del cliente a eliminar
function confirmarEliminacion(id) {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = function() {
        eliminarCliente(id);
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        deleteModal.hide();
    };

    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    deleteModal.show();
}

// Función: Guarda los clientes en el LocalStorage
function guardarClientesEnLocalStorage() {
    const clientesExistentes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientesExistentes.push(...clientes);
    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));
}

// Renderizar los clientes inicialmente
renderizarClientes();

// ================================================
// SECCIÓN: FUNCIONES PARA EL HOME
// ================================================
// Esta sección actualiza dinámicamente la página principal con resúmenes de pedidos y clientes.

// Función: Actualiza el resumen de pedidos (pendientes, enviados, entregados)
function actualizarResumenPedidos() {
    const pendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    const enviados = pedidos.filter(p => p.estado === 'Enviado').length;
    const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

    document.getElementById('pendientes').textContent = pendientes;
    document.getElementById('enviados').textContent = enviados;
    document.getElementById('entregados').textContent = entregados;
}

// Función: Actualiza la sección de clientes recientes
function actualizarClientesRecientes() {
    const contenedor = document.getElementById('clientes-recientes');
    contenedor.innerHTML = '';

    const clientesRecientes = [...clientes]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);

    clientesRecientes.forEach(cliente => {
        const div = document.createElement('div');
        div.classList.add('col-12', 'mb-4');
        div.innerHTML = `
            <div class="card shadow-sm cliente-card">
                <div class="card-body d-flex align-items-center card-ancha">
                    <div class="d-flex align-items-center">
                        <span class="material-symbols-outlined">person</span>
                        <div class="ms-3">
                            <h5 class="card-title mb-1">${cliente.nombre}</h5>
                            <p class="card-text text-muted">Cliente</p>
                        </div>
                    </div>
                    <div class="ms-auto d-flex align-items-center gap-2">
                        <button class="btn btn-view-details btn-detalles" 
                                onclick="mostrarDetallesCliente(${cliente.id})">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// Función: Muestra los detalles de un cliente en un modal
// Parámetros:
//   - id: ID del cliente
function mostrarDetallesCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    const modalTitle = document.getElementById('clienteModalLabel');
    const modalBody = document.getElementById('detalles-cliente');

    modalTitle.textContent = `Detalles de ${cliente.nombre}`;
    modalBody.innerHTML = `
        <ul class="list-unstyled">
            <li><strong>ID:</strong> ${cliente.id}</li>
            <li><strong>Nombre completo:</strong> ${cliente.nombre}</li>
            <li><strong>Teléfono:</strong> ${cliente.telefono || 'No disponible'}</li>
            <li><strong>Correo:</strong> ${cliente.email || 'No disponible'}</li>
        </ul>
    `;

    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
}

// Función: Actualiza la tabla de pedidos recientes
function actualizarPedidosRecientes() {
    const tbody = document.getElementById('pedidos-recientes');
    tbody.innerHTML = '';

    const pedidosRecientes = [...pedidos]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    pedidosRecientes.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.total.toFixed(2)}€</td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar el home si estamos en home.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('home.html')) {
        actualizarResumenPedidos();
        actualizarClientesRecientes();
        actualizarPedidosRecientes();
    }
});
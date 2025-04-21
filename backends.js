// === Función: Abre el modal y carga los datos para editar una zona ===
function abrirModalEditarZona(cardBody) {
    const nombre = cardBody.querySelector('.card-title').textContent.trim();
    const tarifa = cardBody.querySelector('[id^="tarifa"]').textContent.replace('€', '').trim();
    const pedidos = cardBody.querySelector('[id^="pedidos"]').textContent.trim();

    document.getElementById('zonaNombre').value = nombre;
    document.getElementById('zonaTarifa').value = tarifa;
    document.getElementById('zonaPedidos').value = pedidos;

    // Guardamos la zona activa como dataset en el modal
    const modalEl = document.getElementById('zonaModal');
    modalEl.dataset.cardSelector = obtenerSelectorUnico(cardBody);

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// === Función: Guarda los cambios editados ===
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
    cerrarModal();
}

// === Función: Elimina la zona ===
function eliminarZona() {
    const modalEl = document.getElementById('zonaModal');
    const cardBody = document.querySelector(modalEl.dataset.cardSelector);
    if (!cardBody) return;

    cardBody.closest('.col-md-6').remove();
    actualizarEstadisticas();
    cerrarModal();
}

// === Función: Cierra el modal de edición ===
function cerrarModal() {
    const modalEl = document.getElementById('zonaModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    delete modalEl.dataset.cardSelector;
}

// === Función: Abre el modal para añadir una nueva zona ===
function abrirModalAñadirZona() {
    const modal = new bootstrap.Modal(document.getElementById('addZoneModal'));
    modal.show();
}

// === Función: Guarda la nueva zona ===
function guardarNuevaZona() {
    const nombreZona = document.getElementById('nombreZona').value;
    const tarifaZona = document.getElementById('tarifaZona').value;
    const pedidosZona = document.getElementById('pedidosZona').value;

    if (nombreZona && tarifaZona && pedidosZona) {
        // Crear la tarjeta de la nueva zona
        const nuevaZona = crearTarjetaZona(nombreZona, tarifaZona, pedidosZona);

        // Añadir la nueva zona al contenedor de zonas
        const contenedorZonas = document.querySelector('.container.mt-4.mb-4 .row.g-4');
        contenedorZonas.appendChild(nuevaZona);

        // Añadir evento de edición al botón "Ver Detalles" de la nueva zona
        nuevaZona.querySelector('.custom-outline-btn').addEventListener('click', () => {
            const cardBody = nuevaZona.querySelector('.card-body');
            abrirModalEditarZona(cardBody);
        });

        actualizarEstadisticas();
        cerrarModalAñadirZona();
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// === Función: Cierra el modal de añadir zona ===
function cerrarModalAñadirZona() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addZoneModal'));
    modal.hide();

    // Limpiar los campos del formulario
    document.getElementById('nombreZona').value = '';
    document.getElementById('tarifaZona').value = '';
    document.getElementById('pedidosZona').value = '';
}

// === Función: Crear la tarjeta de la nueva zona ===
function crearTarjetaZona(nombre, tarifa, pedidos) {
    const col = document.createElement('div');
    col.classList.add('col-md-6');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'border-0');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Generar un ID único para tarifa y pedidos
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

// === Función: Actualiza las estadísticas ===
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

// === Función auxiliar: genera un selector único del cardBody ===
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

// === Función: Inicializa los eventos ===
function inicializarEventos() {
    // Eventos para botones de "Ver Detalles" en zonas existentes
    document.querySelectorAll('.custom-outline-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            abrirModalEditarZona(cardBody);
        });
    });

    // Evento para abrir el modal de añadir zona
    document.getElementById('add-zone-btn').addEventListener('click', abrirModalAñadirZona);

    // Evento para guardar la nueva zona
    document.getElementById('guardarZonaBtnAdd').addEventListener('click', guardarNuevaZona);

    // Evento para guardar cambios en el modal de edición
    document.getElementById('guardarZonaBtn').addEventListener('click', guardarCambiosZona);

    // Evento para eliminar zona
    document.getElementById('eliminarZonaBtn').addEventListener('click', eliminarZona);
}

// Ejecutar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    actualizarEstadisticas();
});






let productos = [
    { id: 1, nombre: "Producto Ejemplo", stock: 5, precio: 100 }
];

let idAEliminar = null;

function abrirModalAgregar() {
    document.getElementById('productModalLabel').textContent = 'Añadir Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

function abrirModalEditar(id, nombre, stock, precio) {
    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = nombre;
    document.getElementById('productStock').value = stock;
    document.getElementById('productPrice').value = precio;
}

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

    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

function mostrarModalEliminar(id) {
    idAEliminar = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    deleteModal.show();
}

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (idAEliminar !== null) {
        productos = productos.filter(producto => producto.id !== idAEliminar);
        renderizarTabla();
        idAEliminar = null;
    }
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    deleteModal.hide();
});

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

document.addEventListener('DOMContentLoaded', renderizarTabla);





let pedidos = [];
let pedidoEditando = null;
let siguienteId = 1; // Contador para IDs autoincrementales

function abrirModalAgregar() {
  pedidoEditando = null;
  document.getElementById('pedidoForm').reset();
  document.getElementById('pedidoId').value = siguienteId;
}

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
    siguienteId++; // Incrementar el ID solo si es un nuevo pedido
  }

  actualizarTabla();
  bootstrap.Modal.getInstance(document.getElementById('pedidoModal')).hide();
}

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
      <td>${pedido.total.toFixed(2)}</td>
      <td>
        <button class="custom-outline-btn edit btn btn-sm mx-1" onclick="editarPedido(${pedido.id})">Editar</button>
        <button class="custom-outline-btn delete btn btn-sm mx-1" onclick="confirmarEliminacion(${pedido.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

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

function confirmarEliminacion(id) {
  const btnConfirmar = document.getElementById('confirmDeleteBtn');
  btnConfirmar.onclick = () => eliminarPedido(id);

  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

function eliminarPedido(id) {
  pedidos = pedidos.filter(p => p.id !== id);
  actualizarTabla();
  bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
}

document.addEventListener('DOMContentLoaded', () => {
  pedidos = [];
  siguienteId = 1; // Reinicia el contador al cargar
  actualizarTabla();
});







// Array para almacenar los clientes
let clientes = [];
let contadorId = 1; // Contador para las IDs secuenciales

// Constructor para el objeto Cliente
class Cliente {
    constructor(id, nombre, email, telefono) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
}

// Función para agregar un cliente
function agregarCliente(nombre, email, telefono) {
    const id = contadorId++; // Usamos el contador para asignar el ID secuencial
    const nuevoCliente = new Cliente(id, nombre, email, telefono);
    clientes.push(nuevoCliente);
    renderizarClientes();
}

// Función para editar un cliente
function editarCliente(id, nombre, email, telefono) {
    const cliente = clientes.find(cliente => cliente.id === id);
    if (cliente) {
        cliente.nombre = nombre;
        cliente.email = email;
        cliente.telefono = telefono;
        renderizarClientes();
    }
}

// Función para eliminar un cliente
function eliminarCliente(id) {
    clientes = clientes.filter(cliente => cliente.id !== id);
    renderizarClientes();
}

// Función para renderizar la lista de clientes en la tabla
function renderizarClientes() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar
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

// Función para abrir el modal de editar cliente
function abrirModalEditar(id) {
    const cliente = clientes.find(cliente => cliente.id === id);
    if (cliente) {
        document.getElementById('clientId').value = cliente.id;
        document.getElementById('clientName').value = cliente.nombre;
        document.getElementById('clientEmail').value = cliente.email;
        document.getElementById('clientPhone').value = cliente.telefono;

        // Abre el modal de Bootstrap usando su API nativa
        const myModal = new bootstrap.Modal(document.getElementById('clientModal'));
        myModal.show();
    }
}

// Función para guardar un cliente (nuevo o editado)
function guardarCliente() {
    const id = document.getElementById('clientId').value;
    const nombre = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const telefono = document.getElementById('clientPhone').value;

    if (id) {
        // Editar cliente
        editarCliente(Number(id), nombre, email, telefono);
    } else {
        // Agregar nuevo cliente
        agregarCliente(nombre, email, telefono);
    }

    // Limpiar los campos del formulario después de guardar
    document.getElementById('clientId').value = ''; // Limpiar ID (en caso de que sea un cliente nuevo)
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';

    // Cerrar el modal
    const myModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
    myModal.hide();
}

// Función para confirmar eliminación de un cliente
function confirmarEliminacion(id) {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = function() {
        eliminarCliente(id);

        // Cerrar el modal de confirmación de eliminación
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        deleteModal.hide();
    };

    // Abre el modal de confirmación de eliminación
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    deleteModal.show();
}

// Renderizar los clientes inicialmente
renderizarClientes();



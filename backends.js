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
    { id: 1, nombre: "Producto Ejemplo", enStock: true, precio: 100 }
];

let idAEliminar = null; // Guardará el ID del producto a eliminar

function abrirModalAgregar() {
    document.getElementById('productModalLabel').textContent = 'Añadir Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

function abrirModalEditar(id, nombre, enStock, precio) {
    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = nombre;
    document.getElementById('productStock').value = enStock.toString();
    document.getElementById('productPrice').value = precio;
}

function guardarProducto() {
    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value;
    const enStock = document.getElementById('productStock').value === 'true';
    const precio = parseFloat(document.getElementById('productPrice').value);

    if (!nombre || isNaN(precio)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    if (id) {
        const indice = productos.findIndex(producto => producto.id === parseInt(id));
        if (indice !== -1) {
            productos[indice] = { id: parseInt(id), nombre, enStock, precio };
        }
    } else {
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({ id: nuevoId, nombre, enStock, precio });
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
            <td>${producto.enStock ? 'Sí' : 'No'}</td>
            <td>${producto.precio.toFixed(2)}€</td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button class="custom-outline-btn edit btn btn-sm mx-1" 
                            data-bs-toggle="modal" 
                            data-bs-target="#productModal" 
                            onclick="abrirModalEditar(${producto.id}, '${producto.nombre}', ${producto.enStock}, ${producto.precio})">
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

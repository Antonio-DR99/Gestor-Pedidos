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



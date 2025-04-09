//GESTION DE LAS ZONAS DE PEDIDOS: 

const zonas=[
    ["Zona A", 5.99,[10,5,11,8,7,9,1]],
    ["Zona B", 3.99,[16,3,9,5,9,2,2]],
    ["Zona C", 4.99,[12,6,14,1,5,4,9]],
    ["Zona D", 7.99,[7,10,6,15,5,12,8]]

]

function calcularMediaYZonaActiva(zonas){
    let totalPedidos=0;
    let zonaMasActiva={nombre:"", media:0}; 

    zonas.forEach (zona => {
        const [nombre,tarifa,pedidos]=zona;
        let totalPedidosZona=0;

        for (let i=0; i<pedidos.length;i++){
            totalPedidosZona+=pedidos[i];
        }
        const mediaPedidos=totalPedidosZona/7;

        totalPedidos+=totalPedidosZona;

        if (mediaPedidos>zonaMasActiva.media) {
            zonaMasActiva={nombre:nombre,media:mediaPedidos};            
        }
    });
    return{
        totalZonas:zonas.length,
        totalPedidos:totalPedidos,
        zonaMasActiva:zonaMasActiva.nombre
    };
}

function mostrarDatos(){
    const resultados=calcularMediaYZonaActiva(zonas); 

    document.getElementById("total-zonas").textContent=resultados.totalZonas;
    document.getElementById("total-pedidos").textContent=resultados.totalPedidos;
    document.getElementById("zona-mas-activa").textContent=resultados.zonaMasActiva;

    zonas.forEach(zona =>{
        const [nombre,tarifa, pedidos]=zona; 
        let totalPedidosZona=0;
        for (let i = 0; i < pedidos.length; i++) {
            totalPedidosZona+=pedidos[i];
        }
        const zonaId=nombre.toLowerCase().replace(" ","-");

        document.getElementById(`tarifa-${zonaId}`).textContent = tarifa + "€";
        document.getElementById(`pedidos-${zonaId}`).textContent = totalPedidosZona;

    })
}
document.addEventListener("DOMContentLoaded",mostrarDatos);
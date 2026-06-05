// --- Base de datos en memoria (Ejemplos iniciales limpios distribuidos) ---
let pedidos = [
    { id: 101, cliente: "Distribuidora Sur", estado: "Ingresado" },
    { id: 102, cliente: "Cadenas Maxi", estado: "En proceso" },
    { id: 103, cliente: "Almacen Central (Falta Stock SKU-402)", estado: "Terminado con faltante" },
    { id: 104, cliente: "Logistica Express (Discrepancia en 5 bultos)", estado: "Terminado con faltante" },
    { id: 105, cliente: "Minorista Juan", estado: "Terminado" },
    { id: 106, cliente: "Supermercado Oeste", estado: "Terminado" },
    { id: 107, cliente: "Ferreteria Olmos", estado: "Facturado" },
    { id: 108, cliente: "Hipermercado San Jose", estado: "Facturado" }
];

const flujoEstados = ["Ingresado", "En proceso", "Terminado", "Terminado con faltante", "Facturado"];

// --- 1. FUNCIÓN DE RENDERIZADO RECOLECTORA ---
function actualizarPantalla() {
    console.log("[MONITOR] Evento detectado. Actualizando interfaz y recalculando totales...");

    const colPrep = document.getElementById('col-preparacion');
    const colRevisar = document.getElementById('col-revisar');
    const colListo = document.getElementById('col-listo');
    const colDesp = document.getElementById('col-despachado');

    let htmlPrep = '', htmlRevisar = '', htmlListo = '', htmlDesp = '';
    
    // Contadores para las cabeceras
    let totPrep = 0, totRevisar = 0, totListo = 0, totDesp = 0;

    pedidos.forEach(p => {
        let claseCard = '';
        let claseBadge = '';

        switch(p.estado) {
            case 'Ingresado': claseCard = 'card-ingresado'; claseBadge = 'badge-ingresado'; break;
            case 'En proceso': claseCard = 'card-proceso'; claseBadge = 'badge-proceso'; break;
            case 'Terminado': claseCard = 'card-terminado'; claseBadge = 'badge-terminado'; break;
            case 'Terminado con faltante': claseCard = 'card-faltante'; claseBadge = 'badge-faltante'; break;
            case 'Facturado': claseCard = 'card-facturado'; claseBadge = 'badge-facturado'; break;
        }

        const cardHtml = `
            <div class="pedido-card ${claseCard}">
                <h2>#${p.id}</h2>
                <p>${p.cliente}</p>
                <span class="badge ${claseBadge}">${p.estado}</span>
            </div>
        `;

        // Clasificación física e incrementos analíticos
        if (p.estado === 'Ingresado' || p.estado === 'En proceso') {
            htmlPrep += cardHtml;
            totPrep++;
        } else if (p.estado === 'Terminado con faltante') {
            htmlRevisar += cardHtml; 
            totRevisar++;
        } else if (p.estado === 'Terminado') {
            htmlListo += cardHtml;
            totListo++;
        } else if (p.estado === 'Facturado') {
            htmlDesp += cardHtml;
            totDesp++;
        }
    });

    // Inyección de elementos estructurados
    colPrep.innerHTML = htmlPrep;
    colRevisar.innerHTML = htmlRevisar;
    colListo.innerHTML = htmlListo;
    colDesp.innerHTML = htmlDesp;

    // Sincronización exacta de contadores en los elementos del DOM
    document.getElementById('cant-preparacion').textContent = totPrep;
    document.getElementById('cant-revisar').textContent = totRevisar;
    document.getElementById('cant-listo').textContent = totListo;
    document.getElementById('cant-despachado').textContent = totDesp;
}

// --- 2. GESTOR CENTRAL DE CAMBIOS (Event-Driven) ---
function cambiarEstadoPedido(id, nuevoEstado) {
    const pedido = pedidos.find(p => p.id === id);
    
    // Solo altera y renderiza si el estado actual es diferente al entrante
    if (pedido && pedido.estado !== nuevoEstado) {
        if (nuevoEstado === "Terminado con faltante" && !pedido.cliente.includes("Falta")) {
            pedido.cliente += " (Falta Stock / Revisar)";
        }
        if (nuevoEstado === "Facturado" && pedido.cliente.includes(" (Falta")) {
            pedido.cliente = pedido.cliente.split(" (Falta")[0];
        }

        console.log("[DATOS] Pedido #" + id + " muto a " + nuevoEstado);
        pedido.estado = nuevoEstado;
        actualizarPantalla(); 
    }
}

// --- 3. SIMULADOR AUTOMÁTICO DE EVENTOS LOGÍSTICOS ---
function recibirEventoDispositivo() {
    if (pedidos.length === 0) return;

    const indiceAleatorio = Math.floor(Math.random() * pedidos.length);
    const pedido = pedidos[indiceAleatorio];
    const estadoActual = pedido.estado;

    if (estadoActual !== "Facturado") {
        const idxFlujo = flujoEstados.indexOf(estadoActual);
        let proximoEstado;

        if (estadoActual === "En proceso") {
            proximoEstado = Math.random() < 0.35 ? "Terminado con faltante" : "Terminado";
        } else if (estadoActual === "Terminado con faltante") {
            proximoEstado = "Facturado";
        } else {
            proximoEstado = flujoEstados[idxFlujo + 1];
        }

        cambiarEstadoPedido(pedido.id, proximoEstado);

    } else {
        // Simulación de despacho definitivo y entrada de nueva orden
        pedidos = pedidos.filter(p => p.id !== pedido.id);
        
        const nuevosClientes = ["Distribuidora Cordoba", "Transportes LD", "Logistica Austral", "Industrias Fenix"];
        const nuevoId = Math.floor(Math.random() * (999 - 600 + 1)) + 600;
        const nuevoCliente = nuevosClientes[Math.floor(Math.random() * nuevosClientes.length)];
        
        pedidos.push({ id: nuevoId, cliente: nuevoCliente, estado: "Ingresado" });
        actualizarPantalla();
    }
}

// --- 4. INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    actualizarPantalla();
    // Ejecuta un evento cada 4 segundos
    setInterval(recibirEventoDispositivo, 4000);
});
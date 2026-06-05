// --- Base de datos masiva en memoria (50 clientes para pruebas de carga) ---
let pedidos = [
    // --- EN PREPARACIÓN (Ingresado / En proceso) ---
    { id: 101, cliente: "Distribuidora Sur", estado: "Ingresado" },
    { id: 102, cliente: "Cadenas Maxi", estado: "En proceso" },
    { id: 109, cliente: "Supermercados Coto", estado: "Ingresado" },
    { id: 110, cliente: "Mayorista Vital", estado: "En proceso" },
    { id: 111, cliente: "Almacen Pipon", estado: "Ingresado" },
    { id: 112, cliente: "Logistica Avellaneda", estado: "En proceso" },
    { id: 113, cliente: "Ferreteria El Tornillo", estado: "Ingresado" },
    { id: 114, cliente: "Hiper Chango", estado: "En proceso" },
    { id: 115, cliente: "Pañalera Mis Soles", estado: "Ingresado" },
    { id: 116, cliente: "Expreso Camionera", estado: "En proceso" },
    { id: 117, cliente: "Kiosco Open 25", estado: "Ingresado" },
    { id: 118, cliente: "Farmacias Central", estado: "En proceso" },
    { id: 119, cliente: "Proveedor Logistico Global", estado: "Ingresado" },
    { id: 120, cliente: "Polleria San Jose", estado: "En proceso" },

    // --- PEDIDOS PARA REVISAR (Terminado con faltante) ---
    { id: 103, cliente: "Almacen Central (Falta Stock SKU-402)", estado: "Terminado con faltante" },
    { id: 104, cliente: "Logistica Express (Discrepancia en 5 bultos)", estado: "Terminado con faltante" },
    { id: 121, cliente: "Hipermercado Carrefour (Falta SKU-909)", estado: "Terminado con faltante" },
    { id: 122, cliente: "Minimercado El Paso (Sin Stock Aceite)", estado: "Terminado con faltante" },
    { id: 123, cliente: "Distribuidora Oeste (Rotura de pack en picking)", estado: "Terminado con faltante" },
    { id: 124, cliente: "Matias Mayorista (Falta Stock SKU-102)", estado: "Terminado con faltante" },
    { id: 125, cliente: "Anibal Alimentos (Discrepancia en 2 bultos)", estado: "Terminado con faltante" },
    { id: 126, cliente: "Logistica Norte (Falta Validar Lote)", estado: "Terminado con faltante" },

    // --- PARA FACTURAR (Terminado) ---
    { id: 105, cliente: "Minorista Juan", estado: "Terminado" },
    { id: 106, cliente: "Supermercado Oeste", estado: "Terminado" },
    { id: 127, cliente: "Fiambreria Los Pinos", estado: "Terminado" },
    { id: 128, cliente: "Dietetica Natural", estado: "Terminado" },
    { id: 129, cliente: "Carniceria El Corte", estado: "Terminado" },
    { id: 130, cliente: "Maxikiosco Full", estado: "Terminado" },
    { id: 131, cliente: "Mercado De la Plaza", estado: "Terminado" },
    { id: 132, cliente: "Libreria Mitre", estado: "Terminado" },
    { id: 133, cliente: "Autoservicio Express", estado: "Terminado" },
    { id: 134, cliente: "Pet Shop Pitas", estado: "Terminado" },
    { id: 135, cliente: "Bazar Don Omar", estado: "Terminado" },
    { id: 136, cliente: "Verduleria Las Rosas", estado: "Terminado" },
    { id: 137, cliente: "Panaderia Del Pueblo", estado: "Terminado" },
    { id: 138, cliente: "Limpieza Total S.A.", estado: "Terminado" },

    // --- PARA DESPACHAR (Facturado) ---
    { id: 107, cliente: "Ferreteria Olmos", estado: "Facturado" },
    { id: 108, cliente: "Hipermercado San Jose", estado: "Facturado" },
    { id: 139, cliente: "Sabor Casero Distribuidora", estado: "Facturado" },
    { id: 140, cliente: "Abarrotes El Inca", estado: "Facturado" },
    { id: 141, cliente: "Deposito Fiscal Sud", estado: "Facturado" },
    { id: 142, cliente: "Vinos y Bodegas Unidas", estado: "Facturado" },
    { id: 143, cliente: "Consorcio Comercial Este", estado: "Facturado" },
    { id: 144, cliente: "Pañalera Mimitos", estado: "Facturado" },
    { id: 145, cliente: "Almacen El Puente", estado: "Facturado" },
    { id: 146, cliente: "Comercializadora Del Plata", estado: "Facturado" },
    { id: 147, cliente: "Logistica Integrada", estado: "Facturado" },
    { id: 148, cliente: "Súper Mercadito Ideal", estado: "Facturado" },
    { id: 149, cliente: "Textil San Martin", estado: "Facturado" },
    { id: 150, cliente: "Insumos Industriales Alfa", estado: "Facturado" }
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
    setInterval(recibirEventoDispositivo, 10000);
});